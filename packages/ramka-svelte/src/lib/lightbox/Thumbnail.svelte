<script lang="ts">
	import type { Snippet } from 'svelte';
	import type { HTMLButtonAttributes } from 'svelte/elements';
	import { getLightbox, getStrip } from './state.svelte.js';

	interface Props extends HTMLButtonAttributes {
		index: number;
		children?: Snippet;
	}

	let { index, children, ...rest }: Props = $props();
	const lb = getLightbox();
	const strip = getStrip();
	const active = $derived(lb.index === index);

	function follow(el: HTMLElement) {
		const track = el.parentElement;
		if (strip || !active || !track) return;
		const offset = el.getBoundingClientRect().left - track.getBoundingClientRect().left;
		track.scrollTo({ left: track.scrollLeft + offset - (track.clientWidth - el.offsetWidth) / 2, behavior: 'smooth' });
	}
</script>

<button
	type="button"
	aria-label="{index + 1} / {lb.count}"
	aria-current={strip ? undefined : active || undefined}
	role={strip ? 'tab' : undefined}
	aria-selected={strip ? active : undefined}
	data-index={index}
	data-ramka-thumbnail
	data-active={active || undefined}
	{...rest}
	onclick={(e) => {
		rest.onclick?.(e);
		if (e.defaultPrevented) return;
		if (strip) strip.select(index);
		else lb.go(index);
	}}
	{@attach follow}
>
	{@render children?.()}
</button>
