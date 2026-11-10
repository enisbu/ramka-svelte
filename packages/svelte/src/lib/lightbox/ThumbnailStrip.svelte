<script lang="ts">
	import { flushSync, type Snippet } from 'svelte';
	import type { HTMLAttributes } from 'svelte/elements';
	import { scrollProgress } from './geometry.js';
	import { getLightbox, setStrip } from './state.svelte.js';

	interface Props extends HTMLAttributes<HTMLDivElement> {
		children?: Snippet;
		indicator?: Snippet;
	}

	let { children, indicator, ...rest }: Props = $props();
	const lb = getLightbox();
	let root: HTMLElement;
	let track: HTMLElement;
	let scrub: Animation | null = null;
	let frame = 0;

	const SCRUB_DURATION = 450;
	const SCRUB_EASING = 'cubic-bezier(0.22, 1, 0.36, 1)';
	const translate = (x: number) => `translate3d(${x}px, 0, 0)`;

	function travel(at: number) {
		const centers = new Map<number, number>();
		for (const thumb of track.querySelectorAll<HTMLElement>('[data-ramka-thumbnail]'))
			centers.set(Number(thumb.dataset.index), thumb.offsetLeft + thumb.offsetWidth / 2);
		const lo = Math.floor(at);
		const a = centers.get(lo) ?? 0;
		const b = centers.get(lo + 1) ?? a;
		return root.clientWidth / 2 - (a + (b - a) * (at - lo));
	}

	function sync() {
		if (scrub || !lb.slidesEl) return;
		track.style.transform = translate(travel(scrollProgress(lb.slidesEl)));
	}

	function schedule() {
		if (!frame) frame = requestAnimationFrame(() => ((frame = 0), sync()));
	}

	setStrip({
		select(i) {
			if (i === lb.index || lb.scrolling) return;
			const from = new DOMMatrixReadOnly(getComputedStyle(track).transform).m41;
			const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
			const slides = lb.slidesEl as (HTMLElement & { startViewTransition?: (cb: () => void) => unknown }) | undefined;
			if (!reduce) {
				scrub?.cancel();
				const to = travel(i);
				const anim = (scrub = track.animate([{ transform: translate(from) }, { transform: translate(to) }], {
					duration: SCRUB_DURATION,
					easing: SCRUB_EASING,
					fill: 'forwards'
				}));
				anim.finished.then(
					() => {
						if (scrub !== anim) return;
						track.style.transform = translate(to);
						anim.cancel();
						scrub = null;
						sync();
					},
					() => {}
				);
			}
			if (!reduce && slides?.startViewTransition) slides.startViewTransition(() => flushSync(() => lb.go(i, true)));
			else lb.go(i);
		}
	});

	function strip(node: HTMLElement) {
		root = node;
		track = node.querySelector<HTMLElement>('[data-ramka-thumbnail-strip-track]')!;
		const observer = new ResizeObserver(sync);
		observer.observe(node);
		observer.observe(track);
		$effect(() => {
			const slides = lb.slidesEl;
			if (!slides) return;
			sync();
			slides.addEventListener('scroll', schedule, { passive: true });
			return () => slides.removeEventListener('scroll', schedule);
		});
		return () => {
			observer.disconnect();
			cancelAnimationFrame(frame);
			scrub?.cancel();
		};
	}
</script>

<div data-ramka-thumbnail-strip {...rest} {@attach strip}>
	<div data-ramka-thumbnail-strip-track role="tablist">
		{@render children?.()}
	</div>
	{@render indicator?.()}
</div>
