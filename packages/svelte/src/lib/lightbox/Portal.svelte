<script lang="ts">
	import type { Snippet } from 'svelte';
	import type { HTMLAttributes } from 'svelte/elements';
	import { PRESETS } from './morph.js';
	import { getLightbox } from './state.svelte.js';

	interface Props extends HTMLAttributes<HTMLDivElement> {
		container?: HTMLElement | ShadowRoot | null;
		keepMounted?: boolean;
		children?: Snippet;
	}

	let { container, keepMounted = false, children, ...rest }: Props = $props();
	const lb = getLightbox();
	const timing = $derived(PRESETS[lb.preset]);
	const parked = $derived(!lb.present);

	function portal(el: HTMLElement) {
		if (container !== null) (container ?? document.body).append(el);
		lb.portal = el;
		return () => {
			if (lb.portal === el) lb.portal = null;
			if (container !== null) el.remove();
		};
	}
</script>

{#if lb.present || keepMounted}
	<div
		data-ramka-portal
		dir={lb.dirAttribute}
		inert={parked || undefined}
		style:visibility={parked ? 'hidden' : undefined}
		style:pointer-events={parked ? 'none' : undefined}
		style:--lightbox-vt-duration="{timing.duration}ms"
		style:--lightbox-vt-easing={timing.easing}
		style:--lightbox-vt-root-easing={timing.rootEasing}
		{...rest}
		{@attach portal}
	>
		{@render children?.()}
	</div>
{/if}
