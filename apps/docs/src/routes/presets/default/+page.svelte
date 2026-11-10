<script lang="ts">
	import ComponentPreview from '#lib/presets/shell/ComponentPreview.svelte';
	import ExampleShell from '#lib/presets/shell/ExampleShell.svelte';
	import Demo from '#lib/presets/default/Demo.svelte';

	let { data } = $props();
</script>

<svelte:head>
	<title>Default lightbox preset</title>
	<meta
		name="description"
		content="A copy-paste Svelte lightbox preset: morphing open, swipe navigation, zoom, thumbnails, and captions, styled like the ramka docs and ready for a design system."
	/>
</svelte:head>

<ExampleShell title="Default" docsHref="/docs/lightbox" docsLabel="Lightbox overview">
	{#snippet description()}
		Plain CSS: <code>Gallery.svelte</code> and <code>Trigger.svelte</code> pair with <code>lightbox.css</code>, and
		<code>index.ts</code> exports the styled <code>Lightbox</code> namespace. Drop the
		<strong>Package</strong> files into a design-system entry, then compose triggers in your app. Gallery includes a
		top-right <strong>Theater / Peek</strong> toggle (desktop) to switch between full-width and aspect-sized slide
		tracks. The <strong>Example</strong> tab shows the live preview (<code>+N</code> crossfade, child
		<code>morphRef</code>, whole-trigger morph). It is app UI, not part of the skin.
	{/snippet}
	<ComponentPreview files={data.files}>
		<Demo />
	</ComponentPreview>
</ExampleShell>
