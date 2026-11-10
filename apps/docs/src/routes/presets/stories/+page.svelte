<script lang="ts">
	import ComponentPreview from '#lib/presets/shell/ComponentPreview.svelte';
	import ExampleShell from '#lib/presets/shell/ExampleShell.svelte';
	import Demo from '#lib/presets/stories/Demo.svelte';

	let { data } = $props();
</script>

<svelte:head>
	<title>Stories lightbox preset</title>
	<meta
		name="description"
		content="An Instagram Stories-style viewer for Svelte: an avatar tray that crossfades into 9:16 video with a scroll-driven 3D page turn, built with ramka."
	/>
</svelte:head>

<ExampleShell title="Stories" docsHref="/docs/lightbox" docsLabel="Lightbox overview">
	{#snippet description()}
		Instagram-style stories: a horizontal row of avatars, each dissolving into a vertical video via
		<code>crossfade="both"</code> (the circle is not the 9:16 frame, so a geometry morph would look
		wrong). Inside the viewer, slides are a native snap scroller with a CSS view-timeline rotateY:
		cards hinge on their leading edge as they enter and on their trailing edge as they leave. Copy
		the <strong>Package</strong> files (<code>index.ts</code>, the
		<code>.svelte</code> files and <code>lightbox.css</code>) into your design system, then wire
		triggers in your app.
	{/snippet}
	<ComponentPreview files={data.files} frame={false}>
		<Demo />
	</ComponentPreview>
</ExampleShell>
