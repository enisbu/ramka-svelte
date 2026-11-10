<script lang="ts">
	import type { HTMLButtonAttributes } from 'svelte/elements';
	import { getLightbox } from './state.svelte.js';

	let { children, ...rest }: HTMLButtonAttributes = $props();
	const lb = getLightbox();
</script>

<button
	type="button"
	disabled={!lb.zoomed}
	{...rest}
	onclick={(e) => {
		rest.onclick?.(e);
		if (!e.defaultPrevented) lb.activeZoom?.zoomOut();
	}}
>
	{@render children?.()}
</button>
