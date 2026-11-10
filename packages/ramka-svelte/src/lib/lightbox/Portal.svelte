<script lang="ts">
	import type { Snippet } from 'svelte';
	import type { HTMLAttributes } from 'svelte/elements';
	import { PRESETS } from './morph.js';
	import { getLightbox } from './state.svelte.js';

	let { children, ...rest }: HTMLAttributes<HTMLDivElement> & { children?: Snippet } = $props();
	const lb = getLightbox();
	const timing = $derived(PRESETS[lb.preset]);

	function portal(el: HTMLElement) {
		document.body.append(el);
		lb.portal = el;
		return () => {
			lb.portal = null;
			el.remove();
		};
	}
</script>

{#if lb.present}
	<div
		data-ramka-portal
		style:--lightbox-vt-duration="{timing.duration}ms"
		style:--lightbox-vt-easing={timing.easing}
		{...rest}
		{@attach portal}
	>
		{@render children?.()}
	</div>
{/if}
