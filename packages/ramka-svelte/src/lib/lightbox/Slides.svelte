<script lang="ts">
	import type { Snippet } from 'svelte';
	import type { HTMLAttributes } from 'svelte/elements';
	import { slideOffsets } from './geometry.js';
	import { getLightbox } from './state.svelte.js';

	interface Props extends HTMLAttributes<HTMLDivElement> {
		preload?: number;
		children?: Snippet;
	}

	let { preload = 1, children, ...rest }: Props = $props();
	const lb = getLightbox();
	let el: HTMLElement;
	let programmatic = false;
	let settleTimer = 0;

	$effect.pre(() => {
		lb.preload = preload;
	});

	function nearest() {
		let best = -1;
		let distance = Infinity;
		for (const { index, offset } of slideOffsets(el)) {
			const d = Math.abs(offset - el.scrollLeft);
			if (d < distance) [best, distance] = [index, d];
		}
		return best;
	}

	function scrollToIndex(i: number, behavior: ScrollBehavior) {
		const target = slideOffsets(el).find((s) => s.index === i);
		if (!target) return;
		programmatic = behavior === 'smooth';
		el.scrollTo({ left: target.offset, behavior });
	}

	function settle() {
		clearTimeout(settleTimer);
		programmatic = false;
		lb.scrolling = false;
		const i = nearest();
		if (i >= 0 && i !== lb.index) lb.index = i;
	}

	function onscroll() {
		lb.scrolling = true;
		clearTimeout(settleTimer);
		settleTimer = window.setTimeout(settle, 150);
		if (programmatic) return;
		const i = nearest();
		if (i >= 0 && i !== lb.index) lb.index = i;
	}

	function track(node: HTMLElement) {
		el = node;
		lb.slidesEl = node;
		let mounted = false;
		$effect(() => {
			const i = lb.index;
			const instant = lb.instant;
			lb.instant = false;
			const from = nearest();
			if (from === i && mounted) return;
			scrollToIndex(i, mounted && !instant && Math.abs(from - i) === 1 ? 'smooth' : 'instant');
			mounted = true;
		});
		const widths = new WeakMap<Element, number>();
		const observer = new ResizeObserver((entries) => {
			let changed = false;
			for (const { target } of entries) {
				const width = (target as HTMLElement).offsetWidth;
				if (widths.has(target) && widths.get(target) !== width) changed = true;
				widths.set(target, width);
			}
			if (changed && !lb.scrolling) scrollToIndex(lb.index, 'instant');
		});
		observer.observe(node);
		$effect(() => {
			if (!lb.count) return;
			for (const { slide } of slideOffsets(node)) observer.observe(slide);
		});
		return () => {
			observer.disconnect();
			clearTimeout(settleTimer);
			if (lb.slidesEl === node) lb.slidesEl = undefined;
		};
	}
</script>

<div
	data-ramka-slides
	data-locked={lb.zoomed || lb.pulling || undefined}
	data-scrolling={lb.scrolling || undefined}
	{...rest}
	{onscroll}
	onscrollend={settle}
	{@attach track}
>
	{@render children?.()}
</div>
