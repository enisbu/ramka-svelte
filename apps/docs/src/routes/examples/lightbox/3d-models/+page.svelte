<script lang="ts">
	import ExampleShell from '#lib/presets/shell/ExampleShell.svelte';
	import Demo from '#lib/examples/3d-models/Demo.svelte';
</script>

<svelte:head>
	<title>3D models example</title>
	<meta
		name="description"
		content="A Three.js product grid in a Svelte lightbox: onBeforeOpen preheats GLB models before the morph, with a shared orbit between trigger and slide."
	/>
</svelte:head>

<ExampleShell
	title="3D models"
	docsHref="/docs/lightbox/state-lifecycle#before-open"
	docsLabel="State & lifecycle · onBeforeOpen"
>
	{#snippet description()}
		Each tile is its own <code class="models-3d-code">Lightbox.Root</code> with a single-item gallery, Three.js canvases
		in the trigger and <code class="models-3d-code">Lightbox.Media</code>.
		<code class="models-3d-code">onBeforeOpen</code> waits for the prepared lightbox canvas to paint a synced frame before
		the morph (spin stays live, like close). Rotate only (no zoom); orbit stays in sync with the grid tile.
		<code class="models-3d-code">pullToClose={'{false}'}</code> so vertical drag stays with orbit.
	{/snippet}
	<Demo />
</ExampleShell>

<style>
	:global(.models-3d-code) {
		padding: 0.125rem 0.25rem;
		border-radius: 0.25rem;
		background-color: #f5f5f5;
		font-size: 0.75rem;
		line-height: 1rem;
	}
	:global(:is(.dark, [data-theme='dark']) .models-3d-code) {
		background-color: #262626;
	}
</style>
