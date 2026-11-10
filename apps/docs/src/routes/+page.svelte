<script lang="ts">
	import { flushSync, untrack } from 'svelte';
	import { goto } from '$app/navigation';
	import { page } from '$app/state';
	import { Lightbox } from '@ramka/svelte';

	const photos = [
		{ id: 1015, w: 1600, h: 1067, caption: 'Fjord am Morgen' },
		{ id: 1025, w: 1067, h: 1600, caption: 'Mops im Mantel' },
		{ id: 1039, w: 1600, h: 1067, caption: 'Wasserfall' },
		{ id: 1043, w: 1600, h: 1067, caption: 'Waldweg' },
		{ id: 1050, w: 1067, h: 1600, caption: 'Küste' },
		{ id: 1062, w: 1600, h: 1067, caption: 'Hund unter Decke' }
	].map((p) => ({
		...p,
		src: `https://picsum.photos/id/${p.id}/${p.w}/${p.h}`,
		thumb: `https://picsum.photos/id/${p.id}/${Math.round(p.w / 4)}/${Math.round(p.h / 4)}`
	}));

	const ratio = (p: { w: number; h: number }) => p.w / p.h;

	type Layout = 'snug' | 'bleed';
	const LAYOUT_KEY = 'ramka-lightbox-slides-layout';
	let layout = $state<Layout>(readLayout());

	function readLayout(): Layout {
		try {
			return (typeof window !== 'undefined' && (localStorage.getItem(LAYOUT_KEY) as Layout | null)) || 'snug';
		} catch {
			return 'snug';
		}
	}

	function toggleLayout() {
		const next = layout === 'snug' ? 'bleed' : 'snug';
		try {
			localStorage.setItem(LAYOUT_KEY, next);
		} catch {}
		const apply = () => flushSync(() => (layout = next));
		if (document.startViewTransition && !matchMedia('(prefers-reduced-motion: reduce)').matches)
			document.startViewTransition(apply);
		else apply();
	}

	let open = $state(false);
	let index = $state(0);
	let root = $state<{ show(i?: number): Promise<void>; close(): Promise<void> }>();

	function onOpenChange(next: boolean) {
		if (next && !page.state.lightbox) goto('', { shallow: true, state: { lightbox: true } });
		else if (!next && page.state.lightbox) history.back();
	}

	$effect(() => {
		const inHistory = !!page.state.lightbox;
		untrack(() => {
			if (!inHistory && open) root?.close();
			else if (inHistory && !open) root?.show();
		});
	});
</script>

<main>
	<h1>ramka-svelte</h1>
	<p>Svelte-5-Port von <a href="https://ramka.dev">ramka</a>. Bild antippen: Morph, wischen, runterziehen, pinchen.</p>

	<Lightbox.Root bind:this={root} bind:open bind:index {onOpenChange}>
		<div class="grid">
			{#each photos as photo, i (photo.id)}
				<Lightbox.Trigger index={i} class="tile" aria-label="Foto {i + 1} öffnen">
					<img src={photo.thumb} alt="" width={photo.w} height={photo.h} />
				</Lightbox.Trigger>
			{/each}
		</div>

		<Lightbox.Portal>
			<Lightbox.Backdrop class="backdrop" />
			<Lightbox.Content class="content {layout}" aria-label="Galerie">
				<Lightbox.Slides
					class="slides"
					preload={2}
					style="--ratio-start: {ratio(photos[0])}; --ratio-end: {ratio(photos[photos.length - 1])}"
				>
					{#each photos as photo, i (photo.id)}
						<Lightbox.Slide class="slide" style="--ratio: {ratio(photo)}">
							<Lightbox.Item index={i} caption={photo.caption}>
								<Lightbox.Zoom>
									<Lightbox.Media width={photo.w} height={photo.h} class="media">
										<img src={photo.src} alt={photo.caption} width={photo.w} height={photo.h} />
									</Lightbox.Media>
								</Lightbox.Zoom>
							</Lightbox.Item>
						</Lightbox.Slide>
					{/each}
				</Lightbox.Slides>

				<div class="chrome top">
					<button
						type="button"
						class="control desktop"
						aria-pressed={layout === 'snug'}
						aria-label={layout === 'snug' ? 'Zur Kinoansicht wechseln' : 'Zur Vorschauansicht wechseln'}
						onclick={toggleLayout}
					>
						{#if layout === 'snug'}
							<svg viewBox="0 0 24 24" class="lg"><path d="M2 3v18M22 3v18" /><rect width="12" height="18" x="6" y="3" rx="2" /></svg>
						{:else}
							<svg viewBox="0 0 24 24" class="lg"><rect width="20" height="12" x="2" y="6" rx="2" /></svg>
						{/if}
					</button>
					<div class="group desktop">
						<Lightbox.ZoomOut class="control" aria-label="Herauszoomen">
							<svg viewBox="0 0 24 24"><circle cx="11" cy="11" r="8" /><path d="m21 21-4.3-4.3M8 11h6" /></svg>
						</Lightbox.ZoomOut>
						<Lightbox.ZoomIn class="control" aria-label="Hineinzoomen">
							<svg viewBox="0 0 24 24"><circle cx="11" cy="11" r="8" /><path d="m21 21-4.3-4.3M11 8v6M8 11h6" /></svg>
						</Lightbox.ZoomIn>
					</div>
					<Lightbox.Close class="control" aria-label="Schließen">
						<svg viewBox="0 0 24 24" class="x"><path d="M18 6 6 18M6 6l12 12" /></svg>
					</Lightbox.Close>
				</div>
				<div class="chrome bottom">
					<div class="placard">
						<Lightbox.Caption class="caption" />
						<Lightbox.Counter class="counter" />
					</div>
					<Lightbox.ThumbnailStrip class="strip">
						{#each photos as photo, i (photo.id)}
							<Lightbox.Thumbnail index={i} class="thumb" aria-label="Foto {i + 1}">
								<img src={photo.thumb} alt="" />
							</Lightbox.Thumbnail>
						{/each}
						{#snippet indicator()}
							<span class="indicator"></span>
						{/snippet}
					</Lightbox.ThumbnailStrip>
				</div>
			</Lightbox.Content>
		</Lightbox.Portal>
	</Lightbox.Root>

	<p class="state">open: {open} · index: {index}</p>
</main>

<style>
	:global(body) {
		margin: 0;
		font-family: system-ui, sans-serif;
		background: #fafafa;
		color: #171717;
	}
	main {
		max-width: 960px;
		margin: 0 auto;
		padding: 2rem 1rem 50vh;
	}
	a {
		color: inherit;
	}
	.grid {
		display: grid;
		grid-template-columns: repeat(auto-fill, minmax(140px, 1fr));
		gap: 8px;
	}
	.grid :global(.tile) {
		padding: 0;
		border: 0;
		background: none;
		cursor: zoom-in;
		aspect-ratio: 1;
	}
	.grid :global(.tile img) {
		display: block;
		width: 100%;
		height: 100%;
		object-fit: cover;
		border-radius: 12px;
	}
	.state {
		opacity: 0.5;
		font-size: 0.85rem;
	}

	:global(.backdrop) {
		position: fixed;
		inset: 0;
		background: #fff;
		opacity: 0;
		transition: opacity var(--lightbox-pull-snap-duration, var(--lightbox-vt-duration, 360ms))
			var(--lightbox-pull-snap-easing, cubic-bezier(0.16, 1, 0.3, 1));
	}
	:global(.backdrop[data-open]) {
		opacity: calc(1 - var(--lightbox-pull-progress, 0) * 0.6);
	}
	:global(.backdrop[data-pulling]) {
		transition: none;
	}
	@starting-style {
		:global(.backdrop[data-open]) {
			opacity: 0;
		}
	}

	:global(.content) {
		--inset-top: calc(4rem + env(safe-area-inset-top, 0px));
		--inset-bottom: calc(4rem + env(safe-area-inset-bottom, 0px));
		--inset-inline: 0px;
		--gap: 1.25rem;
		position: fixed;
		inset: 0;
		display: flex;
		flex-direction: column;
		overscroll-behavior: contain;
		outline: none;
		opacity: 0;
		transition: opacity var(--lightbox-vt-duration, 360ms) cubic-bezier(0.16, 1, 0.3, 1);
	}
	:global(.content[data-open]) {
		opacity: 1;
	}
	@starting-style {
		:global(.content[data-open]) {
			opacity: 0;
		}
	}
	:global(.slides) {
		flex: 1;
		gap: var(--gap);
	}
	:global(.slide) {
		height: 100%;
		box-sizing: border-box;
		padding-block: var(--inset-top) var(--inset-bottom);
	}
	:global(.media) {
		overflow: hidden;
	}

	@media (min-width: 768px) {
		:global(.content) {
			--inset-top: calc(4.5rem + env(safe-area-inset-top, 0px));
			--inset-bottom: calc(8.625rem + env(safe-area-inset-bottom, 0px));
			--inset-inline: 3rem;
		}
		:global(.content.snug) {
			--inset-inline: 2rem;
		}
		:global(.content.bleed .slides) {
			gap: 0;
		}
		:global(.content.bleed .slide) {
			padding-inline: var(--inset-inline);
		}
		:global(.content.snug .slides) {
			--fit: calc(100cqh - var(--inset-top) - var(--inset-bottom));
			--max: calc(100cqw - 2 * var(--inset-inline));
		}
		:global(.content.snug .slides)::before,
		:global(.content.snug .slides)::after {
			content: '';
			pointer-events: none;
		}
		:global(.content.snug .slides)::before {
			flex: 0 0 calc((100cqw - min(var(--max), var(--fit) * var(--ratio-start))) / 2 - var(--gap));
		}
		:global(.content.snug .slides)::after {
			flex: 0 0 calc((100cqw - min(var(--max), var(--fit) * var(--ratio-end))) / 2 - var(--gap));
		}
		:global(.content.snug .slide) {
			flex: 0 0 auto;
			min-width: 0;
			width: min(var(--max), var(--fit) * var(--ratio));
		}
		:global(.media) {
			position: relative;
			border-radius: 0.5rem;
		}
		:global(.media)::after {
			content: '';
			position: absolute;
			inset: 0;
			pointer-events: none;
			border-radius: inherit;
			box-shadow: inset 0 0 0 0.5px rgb(0 0 0 / 0.1);
		}
		:global(.content.snug .slide [data-ramka-item]) {
			transition: opacity var(--lightbox-pull-snap-duration, 500ms)
				var(--lightbox-pull-snap-easing, cubic-bezier(0.16, 1, 0.3, 1));
		}
		:global(.content.snug .slide [data-ramka-item]:not([data-active])) {
			opacity: calc(1 - var(--lightbox-pull-progress, 0) * 0.85);
		}
		:global(.content.snug:is([data-pulling], [data-pull-dismissing]) .slide [data-ramka-item]) {
			transition: none;
		}
	}
	:global(.content[data-zoomed] .slide:has([data-active])) {
		z-index: 1;
	}

	.chrome {
		position: absolute;
		z-index: 1;
		transition:
			opacity 200ms,
			visibility 0s linear 0s;
	}
	@starting-style {
		.chrome {
			opacity: 0;
		}
	}
	:global(.content:is([data-pulling], [data-pull-dismissing])) .chrome,
	:global(.content[data-zoomed]) .bottom {
		opacity: 0;
		visibility: hidden;
		transition:
			opacity 200ms,
			visibility 0s linear 200ms;
	}
	.top {
		top: calc(0.75rem + env(safe-area-inset-top, 0px));
		right: 0.75rem;
		display: flex;
		gap: 0.5rem;
	}
	.bottom {
		inset-inline: 0;
		bottom: 0;
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 0.75rem;
		padding: 0 0.75rem calc(1rem + env(safe-area-inset-bottom, 0px));
		pointer-events: none;
	}

	.top :global(.control),
	.group {
		border: 1px solid rgb(0 0 0 / 0.2);
		background: rgb(255 255 255 / 0.55);
		box-shadow:
			0 0.5px 1px rgb(0 0 0 / 0.12),
			0 1px 2px rgb(0 0 0 / 0.08),
			inset 0 0.5px 0 rgb(255 255 255 / 0.65);
		backdrop-filter: blur(40px) saturate(1.5);
	}
	.top :global(.control) {
		display: inline-flex;
		align-items: center;
		justify-content: center;
		width: 2.25rem;
		height: 2.25rem;
		padding: 0;
		border-radius: 999px;
		color: #171717;
		cursor: pointer;
		transition:
			transform 150ms ease-out,
			opacity 150ms ease-out;
	}
	.top :global(.control:focus) {
		outline: none;
	}
	.top :global(.control:focus-visible) {
		box-shadow:
			0 0 0 2px rgb(0 0 0 / 0.25),
			0 0.5px 1px rgb(0 0 0 / 0.12),
			0 1px 2px rgb(0 0 0 / 0.08),
			inset 0 0.5px 0 rgb(255 255 255 / 0.65);
	}
	.group :global(.control:focus-visible) {
		box-shadow: inset 0 0 0 2px rgb(0 0 0 / 0.25);
	}
	.top :global(.control:hover) {
		background-image: linear-gradient(rgb(0 0 0 / 0.05), rgb(0 0 0 / 0.05));
	}
	.top :global(.control:active) {
		transform: scale(0.96);
	}
	.top :global(.control:disabled) {
		opacity: 0.3;
		cursor: not-allowed;
		transform: none;
	}
	.group {
		display: inline-flex;
		border-radius: 999px;
		overflow: hidden;
	}
	.group :global(.control) {
		position: relative;
		border: 0;
		border-radius: 0;
		background-color: transparent;
		box-shadow: none;
		backdrop-filter: none;
	}
	.group :global(.control:active) {
		transform: none;
	}
	.group :global(.control + .control)::before {
		content: '';
		position: absolute;
		left: 0;
		top: 22%;
		bottom: 22%;
		width: 1px;
		background: rgb(0 0 0 / 0.15);
	}
	svg {
		width: 1rem;
		height: 1rem;
		fill: none;
		stroke: currentColor;
		stroke-width: 2.25;
		stroke-linecap: round;
		stroke-linejoin: round;
	}
	svg.x,
	svg.lg {
		width: 1.125rem;
		height: 1.125rem;
	}

	.placard {
		display: flex;
		flex-direction: column;
		align-items: center;
		max-width: 100%;
		text-align: center;
	}
	:global(.caption) {
		max-width: 100%;
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;
		font-size: 0.8125rem;
		font-weight: 500;
		line-height: 1.25;
		pointer-events: auto;
	}
	:global(.counter) {
		font-size: 0.6875rem;
		line-height: 1.25;
		font-variant-numeric: tabular-nums;
		color: #737373;
	}

	:global(.strip) {
		--thumb: 4.5rem;
		--fade: 40px;
		display: none;
		align-self: stretch;
		padding-block: 0.3125rem;
		pointer-events: auto;
		mask-image: linear-gradient(
			to right,
			rgb(0 0 0 / 0) 0,
			rgb(0 0 0 / 0.156) calc(var(--fade) * 0.25),
			rgb(0 0 0 / 0.5) calc(var(--fade) * 0.5),
			rgb(0 0 0 / 0.844) calc(var(--fade) * 0.75),
			#000 var(--fade),
			#000 calc(100% - var(--fade)),
			rgb(0 0 0 / 0.844) calc(100% - var(--fade) * 0.75),
			rgb(0 0 0 / 0.5) calc(100% - var(--fade) * 0.5),
			rgb(0 0 0 / 0.156) calc(100% - var(--fade) * 0.25),
			rgb(0 0 0 / 0) 100%
		);
	}
	:global(.strip [data-ramka-thumbnail-strip-track]) {
		gap: 0.625rem;
		align-items: center;
	}
	:global(.thumb) {
		flex: none;
		width: var(--thumb);
		height: var(--thumb);
		padding: 0;
		border: 0;
		border-radius: 0.5rem;
		overflow: hidden;
		background: transparent;
		cursor: pointer;
	}
	:global(.thumb:focus) {
		outline: none;
	}
	:global(.thumb:focus-visible) {
		outline: 2px solid #3b82f6;
		outline-offset: 2px;
	}
	:global(.thumb img) {
		display: block;
		width: 100%;
		height: 100%;
		object-fit: cover;
	}
	.indicator {
		position: absolute;
		left: 50%;
		top: 50%;
		box-sizing: border-box;
		width: calc(var(--thumb) + 10px);
		height: calc(var(--thumb) + 10px);
		border: 2px solid #000;
		border-radius: calc(0.5rem + 3px);
		pointer-events: none;
		transform: translate(-50%, -50%);
	}

	@media (max-width: 767px) {
		.top .desktop {
			display: none;
		}
		:global(.content[data-zoomed]) .top {
			opacity: 0;
			visibility: hidden;
		}
	}
	@media (min-width: 768px) {
		:global(.strip) {
			display: block;
		}
		:global(.counter) {
			position: absolute;
			width: 1px;
			height: 1px;
			overflow: hidden;
			clip: rect(0 0 0 0);
			white-space: nowrap;
		}
	}
</style>
