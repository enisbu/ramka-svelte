<script lang="ts">
	import ComponentPreview from '#lib/presets/shell/ComponentPreview.svelte';
	import ExampleShell from '#lib/presets/shell/ExampleShell.svelte';
	import Demo from '#lib/presets/twitter/Demo.svelte';

	let { data } = $props();
</script>

<svelte:head>
	<title>Twitter-style lightbox preset</title>
	<meta
		name="description"
		content="A Twitter-style media viewer for Svelte: split media and thread sidebar, translucent backdrop, and edge navigation, built from ramka lightbox primitives."
	/>
</svelte:head>

<ExampleShell title="Twitter" docsHref="/docs/lightbox" docsLabel="Lightbox overview">
	{#snippet description()}
		X-style split viewer: a semi-translucent dark media pane with close (top-left) and previous/next
		on the gallery edges. Desktop keeps a white thread sidebar; mobile shows a bottom engagement bar
		and opens the thread as a full-screen sheet from the comment control. Copy the <strong
			>Package</strong
		>
		files (<code>index.ts</code>, the
		<code>.svelte</code> files and <code>lightbox.css</code>) into your design system, then wire
		triggers in your app. The <strong>Example</strong> tab shows a three-post feed with
		Facebook-style image grids: single image, three-up, and a <code>+N</code> crossfade tile, each opening
		the split viewer (scoped CSS only).
	{/snippet}
	<ComponentPreview files={data.files}>
		<Demo />
	</ComponentPreview>
</ExampleShell>
