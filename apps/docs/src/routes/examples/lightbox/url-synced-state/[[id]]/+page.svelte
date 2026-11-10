<script lang="ts">
	import ExampleShell from '#lib/presets/shell/ExampleShell.svelte';
	import Demo from '#lib/examples/url-synced-state/Demo.svelte';
	import { photoPageTitle } from '#lib/examples/url-synced-state/photos.js';

	let { data } = $props();
	const description = $derived(
		data.photo
			? `${data.photo.alt}: a deep link straight into the lightbox, driven by a SvelteKit optional parameter and ramka's controlled open / index props.`
			: 'A masonry lightbox wired to SvelteKit routing: every photo is a shareable URL. Deep links open the viewer, swipes rewrite the URL, browser Back closes it. Built with ramka.'
	);
</script>

<svelte:head>
	<meta name="description" content={description} />
	{#if data.photo}
		<meta property="og:title" content={photoPageTitle(data.photo)} />
		<meta property="og:description" content={data.photo.alt} />
		<meta property="og:image" content={data.photo.src} />
		<meta property="og:image:width" content={String(data.photo.width)} />
		<meta property="og:image:height" content={String(data.photo.height)} />
		<meta property="og:image:alt" content={data.photo.alt} />
		<meta name="twitter:card" content="summary_large_image" />
	{/if}
</svelte:head>

<ExampleShell title="URL-synced state" docsHref="/docs/lightbox/state-lifecycle" docsLabel="State & lifecycle docs">
	{#snippet description()}
		Every photo in this masonry wall is its own URL, driven by a SvelteKit optional parameter: the page lives at an
		[[id]] route, and the lightbox is controlled via bind:open / bind:index on Lightbox.Root. Tapping a tile opens the
		viewer and pushes /examples/lightbox/url-synced-state/5 with SvelteKit shallow routing (goto with shallow: true),
		swiping rewrites that URL in place (replace: true), and the browser Back button closes the viewer. Loading a photo URL cold serves the
		viewer already open, straight from the server HTML with per-photo metadata: deep-link visits render the Portal in
		place (container={'{null}'}) instead of moving it into document.body, and Slides ssrSlideShift paints the right photo
		before hydration. Because the URL writes happen in the gesture callbacks, trigger taps keep the view-transition morph.
	{/snippet}
	<Demo />
</ExampleShell>
