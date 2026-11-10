<script lang="ts">
	import ExampleShell from '#lib/presets/shell/ExampleShell.svelte';
	import Demo from '#lib/examples/film-trailers/Demo.svelte';
</script>

<svelte:head>
	<title>Film trailers example</title>
	<meta
		name="description"
		content="A Svelte video lightbox example: movie posters morph into fullscreen videos that autoplay on becoming active, built with ramka."
	/>
</svelte:head>

<ExampleShell title="Film trailers">
	{#snippet description()}
		Each poster is its own <code class="film-trailers-code">Lightbox.Root</code> with a single-item gallery and a
		<code class="film-trailers-code">Lightbox.Item</code> snippet for the video.
		<code class="film-trailers-code">crossfade="close"</code> hard-cuts the open morph into the video and dissolves the
		live frame back into the poster on close. Video autoplays (muted) only after
		<code class="film-trailers-code">onOpenChangeComplete</code>.
	{/snippet}
	<Demo />
</ExampleShell>

<style>
	:global(.film-trailers-code) {
		padding: 0.125rem 0.25rem;
		border-radius: 0.25rem;
		background-color: #f5f5f5;
		font-size: 0.75rem;
		line-height: 1rem;
	}
	:global(:is(.dark, [data-theme='dark']) .film-trailers-code) {
		background-color: #262626;
	}
</style>
