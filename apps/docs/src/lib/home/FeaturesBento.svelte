<script lang="ts">
	import Accessibility from '@lucide/svelte/icons/accessibility';
	import ArrowDownToLine from '@lucide/svelte/icons/arrow-down-to-line';
	import Blocks from '@lucide/svelte/icons/blocks';
	import Clapperboard from '@lucide/svelte/icons/clapperboard';
	import FileCode2 from '@lucide/svelte/icons/file-code-2';
	import GalleryHorizontalEnd from '@lucide/svelte/icons/gallery-horizontal-end';
	import Languages from '@lucide/svelte/icons/languages';
	import Sparkles from '@lucide/svelte/icons/sparkles';
	import ZoomIn from '@lucide/svelte/icons/zoom-in';

	const features = [
		{
			title: 'Morph view transitions',
			description:
				'Shared-element View Transitions morph anything into the lightbox and back: images, video, plain HTML. Browsers without the API get a clean crossfade.',
			icon: Sparkles
		},
		{
			title: 'Native scrolling',
			description:
				'Slides ride real CSS scroll snapping, not a transform-emulated carousel. Swiping feels native because it is.',
			icon: GalleryHorizontalEnd
		},
		{
			title: 'Pinch to zoom',
			description:
				'Pinch on touch or trackpad, double-tap to zoom, ctrl + scroll to zoom at the cursor. Pan with a finger, mouse, or arrow keys.',
			icon: ZoomIn
		},
		{
			title: 'Pull to dismiss',
			description:
				'Drag down on touch or wheel on a trackpad to close, like every photos app. Elastic, interruptible, and aware of zoom.',
			icon: ArrowDownToLine
		},
		{
			title: 'Headless and unstyled',
			description:
				'Composable Svelte 5 components in the shape you know from Bits UI and Melt: Trigger, Slides, Zoom, Captions, Thumbnails, Counter. Snippets and bindings instead of render props. You own every pixel.',
			icon: Blocks,
			wide: true
		},
		{
			title: 'Accessible by default',
			description:
				'A focus-trapped dialog with full keyboard navigation: arrows, Escape, and zoom shortcuts. Screen-reader naming hooks built in, and prefers-reduced-motion respected.',
			icon: Accessibility,
			wide: true
		},
		{
			title: 'RTL support',
			description: 'One dir="rtl" mirrors slide order, arrow keys, and thumbnails.',
			icon: Languages
		},
		{
			title: 'Typed and small',
			description:
				'Fully typed, tree-shakeable, zero runtime dependencies beyond Svelte itself. The same engine as the React original, rewritten on runes.',
			icon: FileCode2,
			wide: true
		},
		{
			title: 'Images, video, anything',
			description:
				'Photos, videos, 3D models, or any Svelte content. Plain img with width and height, srcset, or enhanced:img from SvelteKit.',
			icon: Clapperboard
		}
	];
</script>

<section id="features" class="mx-auto w-full max-w-5xl px-6 pb-24 md:pb-32">
	<h2
		class="text-center text-3xl font-semibold tracking-tight text-balance text-neutral-950 md:text-4xl dark:text-neutral-50"
	>
		Everything a lightbox should do.
	</h2>
	<p class="mx-auto mt-4 max-w-xl text-center text-pretty text-neutral-500 dark:text-neutral-400">
		An image viewer that feels like the native photos app, from gestures to keyboard and
		screen-reader support. Zero opinions about how your gallery looks.
	</p>
	<div class="mt-12 grid gap-4 md:grid-cols-3 md:gap-5">
		{#each features as feature (feature.title)}
			<div
				class={[
					'rounded-3xl border border-neutral-200 p-7 dark:border-neutral-800',
					feature.wide && 'md:col-span-2'
				]}
			>
				<feature.icon
					aria-hidden="true"
					class="size-5 text-neutral-400 dark:text-neutral-500"
					strokeWidth={1.75}
				/>
				<h3
					class="mt-4 text-[15px] font-semibold tracking-tight text-neutral-900 dark:text-neutral-50"
				>
					{feature.title}
				</h3>
				<p class="mt-2 text-[14px] leading-6 text-pretty text-neutral-500 dark:text-neutral-400">
					{feature.description}
				</p>
			</div>
		{/each}
	</div>
</section>
