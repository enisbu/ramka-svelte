<script lang="ts">
	import ComponentPreview from '#lib/presets/shell/ComponentPreview.svelte';
	import ExampleShell from '#lib/presets/shell/ExampleShell.svelte';
	import Demo from '#lib/presets/editorial/Demo.svelte';

	let { data } = $props();
</script>

<svelte:head>
	<title>Editorial lightbox preset</title>
	<meta
		name="description"
		content="A newsroom article-figure lightbox for Svelte: near-black surface with a caption and credit block, built from ramka lightbox primitives."
	/>
</svelte:head>

<ExampleShell title="Editorial" docsHref="/docs/lightbox" docsLabel="Lightbox overview">
	{#snippet description()}
		The viewer newsrooms use for article figures: a near-black surface in both color schemes, a typography-forward
		caption and credit block under the media, and ghost controls. Keyboard-first, no zoom: a reading context, not an
		inspection one. Copy the <strong>Package</strong> files (<code>index.ts</code>, the <code>.svelte</code> parts and
		<code>lightbox.css</code>) into your design system, then wire triggers in your app. The <strong>Example</strong> tab
		shows an article excerpt whose inline figures open the viewer with their caption and credit.
	{/snippet}
	<ComponentPreview files={data.files}>
		<Demo />
	</ComponentPreview>
</ExampleShell>
