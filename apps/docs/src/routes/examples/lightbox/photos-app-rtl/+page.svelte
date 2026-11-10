<script lang="ts">
	import PhotosApp from '#lib/examples/photos-app/PhotosApp.svelte';
</script>

<svelte:head>
	<title>Photos app example (RTL)</title>
	<meta
		name="description"
		content="The photos app example mirrored for a right-to-left locale: dir=&quot;rtl&quot; on Lightbox.Root mirrors navigation, the thumbnail strip, and the arrow keys."
	/>
</svelte:head>

<PhotosApp dir="rtl" />
