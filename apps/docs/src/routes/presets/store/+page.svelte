<script lang="ts">
	import ComponentPreview from '#lib/presets/shell/ComponentPreview.svelte';
	import ExampleShell from '#lib/presets/shell/ExampleShell.svelte';
	import Demo from '#lib/presets/store/Demo.svelte';

	let { data } = $props();
</script>

<svelte:head>
	<title>Store gallery lightbox preset</title>
	<meta
		name="description"
		content="An e-commerce product gallery lightbox for Svelte: thumbnail rail and a buy panel with price, highlights, and a CTA, built from ramka lightbox primitives."
	/>
</svelte:head>

<ExampleShell title="Store" docsHref="/docs/lightbox" docsLabel="Lightbox overview">
	{#snippet description()}
		A full commerce viewer: the media stage (vertical thumbnail rail, pager, corner zoom) sits beside a buy panel with
		price, highlights, and the add-to-cart CTA. On mobile the panel collapses into a sticky price + CTA bar, so the
		shopper never loses the buy button while inspecting photos. Copy the <strong>Package</strong> files
		(<code>index.ts</code>, <code>Gallery.svelte</code>, <code>Trigger.svelte</code> + <code>lightbox.css</code>) into
		your design system, then wire triggers in your app. The <strong>Example</strong> tab shows a product card whose
		thumbnails swap the main image, viewer navigation synced back so the close morph lands on the visible image, and
		add-to-cart state shared between the card and the viewer.
	{/snippet}
	<ComponentPreview files={data.files} frame={false}>
		<Demo />
	</ComponentPreview>
</ExampleShell>
