<script lang="ts">
	import type { Snippet } from 'svelte';
	import type { HTMLAttributes } from 'svelte/elements';
	import { getLightbox, setItem } from './state.svelte.js';

	interface Props extends Omit<HTMLAttributes<HTMLDivElement>, 'children'> {
		index: number;
		caption?: string;
		children?: Snippet<[{ active: boolean; visible: boolean }]>;
	}

	let { index, caption, children, ...rest }: Props = $props();
	const lb = getLightbox();
	const active = $derived(lb.index === index);
	const visible = $derived(Math.abs(lb.index - index) <= lb.preload);
	let seen = false;
	const rendered = $derived.by(() => (seen ||= visible));

	setItem({
		get index() {
			return index;
		},
		setMedia(el) {
			if (el) lb.media.set(index, el);
			else lb.media.delete(index);
		}
	});

	function register(el: HTMLElement) {
		lb.items.set(index, { el, caption });
		return () => lb.items.delete(index);
	}
</script>

<div
	role="group"
	aria-roledescription="slide"
	aria-label="{index + 1} / {lb.count}"
	inert={!active}
	data-ramka-item
	data-index={index}
	data-active={active || undefined}
	{...rest}
	{@attach register}
>
	{#if rendered}
		{@render children?.({ active, visible })}
	{/if}
</div>
