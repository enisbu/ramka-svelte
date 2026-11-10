<script lang="ts">
	import CodeBlock from '#lib/components/CodeBlock.svelte';
	import { docsLink } from '#lib/components/docs-link.js';
	import DocsSection from '#lib/components/DocsSection.svelte';
	import DocsShell from '#lib/components/DocsShell.svelte';
	import { docsPages } from '#lib/content/nav.js';
	import HeroDemo from '#lib/docs/HeroDemo.svelte';
	import anatomy from '#lib/excerpts/Anatomy.svelte?highlight';

	const guides = [
		{ ...docsPages.stateLifecycle, description: 'bind:open, bind:index, show() and close(), open-change callbacks.' },
		{ ...docsPages.composition, description: 'Slides + Zoom chrome, media sizing, and the Item snippet.' },
		{ ...docsPages.images, description: 'Plain img with width and height, srcset, and enhanced:img.' },
		{ ...docsPages.viewTransitions, description: 'Morph on by default, crossfade, morphTo, and presets.' },
		{ ...docsPages.gestures, description: 'Pull-to-dismiss, zoom, keyboard, and what wins when.' },
		{ ...docsPages.rtl, description: 'Reading direction, what mirrors and what stays physical.' },
		{ ...docsPages.api, description: 'Props, data attributes, and CSS variables for every part.' }
	];
	const toc = [
		{ id: 'usage-guidelines', title: 'Usage guidelines' },
		{ id: 'anatomy', title: 'Anatomy' },
		{ id: 'next-steps', title: 'Next steps' }
	];
</script>

<svelte:head>
	<title>Svelte lightbox overview · ramka for Svelte</title>
	<meta
		name="description"
		content="Headless lightbox primitives for Svelte built on native scrolling and View Transitions: morphing open, swipe navigation, pinch to zoom, and pull to dismiss. Start here."
	/>
</svelte:head>

<DocsShell title="Lightbox" {toc}>
	{#snippet description()}
		Accessible primitives for fullscreen media lightboxes: compound Svelte components in the style of Bits UI.
		Cosmetically unstyled: you own colors, chrome, and radius values. ramka owns state, focus, gestures, morphs, and the
		structural styles those mechanics need.
	{/snippet}

	<div class="rounded-xl border border-neutral-200 p-4 dark:border-neutral-800"><HeroDemo /></div>

	<DocsSection id="usage-guidelines" title="Usage guidelines">
		<p>Work through these decisions in order:</p>
		<ol class="list-decimal space-y-3 pl-5">
			<li>
				<strong>State</strong>: uncontrolled, or <code class="text-xs">bind:open</code> and
				<code class="text-xs">bind:index</code>? See <a href={docsPages.stateLifecycle.href} class={docsLink}>State &amp; lifecycle</a>.
			</li>
			<li>
				<strong>Layout</strong>: default to the swipe carousel
				(<a href="{docsPages.composition.href}#slides" class={docsLink}>Slides + Zoom</a>). See
				<a href={docsPages.composition.href} class={docsLink}>Composition</a>.
			</li>
			<li>
				<strong>Morph</strong>: on by default. Wrap destination media in
				<code class="text-xs">Lightbox.Media</code>, put an <code class="text-xs">img</code> inside each Trigger, choose
				<code class="text-xs">crossfade</code> and <code class="text-xs">morphTo</code>, or pass
				<code class="text-xs">viewTransition={'{false}'}</code> to opt out. See
				<a href={docsPages.viewTransitions.href} class={docsLink}>View transitions</a>.
			</li>
			<li>
				<strong>Gestures</strong>: pull-to-dismiss on Content, Zoom on media, keyboard on Content. See
				<a href={docsPages.gestures.href} class={docsLink}>Gestures</a>.
			</li>
			<li>
				<strong>Cosmetics vs mechanics</strong>: colors, chrome, and radius <em>values</em> are yours.
				Structural styles (view-transition morph CSS, morph host box, zoom overflow, slide snap alignment) are applied by
				the library or through Media <code class="text-xs">width</code>/<code class="text-xs">height</code>. Slide track
				width (full-bleed or snug cards) is your CSS, see
				<a href="{docsPages.composition.href}#slides" class={docsLink}>Composition: Slides + Zoom</a>. Style with the
				documented <code class="text-xs">data-*</code> attributes and CSS variables from the
				<a href={docsPages.api.href} class={docsLink}>API reference</a>.
			</li>
		</ol>
	</DocsSection>

	<DocsSection id="anatomy" title="Anatomy">
		<p>
			Import the namespace and compose parts. The sketch below is the default gallery shape (Slides + Zoom + chrome).
			Every part is optional except Root, which holds the state.
		</p>
		<CodeBlock code={anatomy} title="Gallery.svelte" />
	</DocsSection>

	<DocsSection id="next-steps" title="Next steps">
		<ul class="grid gap-3 sm:grid-cols-2">
			{#each guides as guide (guide.href)}
				<li>
					<a
						href={guide.href}
						class="block h-full rounded-xl border border-neutral-200 bg-white p-4 transition hover:border-neutral-300 hover:bg-neutral-50 dark:border-neutral-800 dark:bg-neutral-900 dark:hover:border-neutral-700 dark:hover:bg-neutral-800"
					>
						<div class="text-sm font-semibold text-neutral-900 dark:text-neutral-50">{guide.title}</div>
						<p class="mt-1 text-xs text-neutral-600 dark:text-neutral-400">{guide.description}</p>
					</a>
				</li>
			{/each}
		</ul>
		<p class="mt-4">
			Browse product demos under <a href="/examples/lightbox/photos-app" class={docsLink}>Examples</a>. The guides above
			are canonical for behavior; examples are compositions.
		</p>
	</DocsSection>
</DocsShell>
