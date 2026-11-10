<script lang="ts">
	import type { HTMLButtonAttributes } from 'svelte/elements';
	import { warnUnnamed } from './dom.js';
	import { getLightbox, getZoom } from './state.svelte.js';

	let { children, ...rest }: HTMLButtonAttributes = $props();
	const lb = getLightbox();
	const local = getZoom();
	const zoom = $derived(local ?? lb.activeZoom);
	const disabled = $derived(!zoom || zoom.zoom <= zoom.minZoom + 0.01);
</script>

<button
	type="button"
	{disabled}
	data-ramka-zoom-out
	data-disabled={disabled || undefined}
	{...rest}
	onclick={(e) => {
		rest.onclick?.(e);
		if (!e.defaultPrevented) zoom?.zoomOut();
	}}
	{@attach warnUnnamed('Lightbox.ZoomOut')}
>
	{@render children?.()}
</button>
