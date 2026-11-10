<script lang="ts">
	import type { Snippet } from 'svelte';
	import { ensureStyles, morphSource, type MorphPreset } from './morph.js';
	import { LightboxState, setLightbox, type MorphTo } from './state.svelte.js';

	interface Props {
		open?: boolean;
		index?: number;
		loop?: boolean;
		viewTransition?: boolean | MorphPreset;
		morphTo?: MorphTo;
		onOpenChange?: (open: boolean) => void;
		children?: Snippet;
	}

	let {
		open = $bindable(false),
		index = $bindable(0),
		loop = false,
		viewTransition = true,
		morphTo = 'active',
		onOpenChange,
		children
	}: Props = $props();

	const lb = setLightbox(
		new LightboxState({
			get open() {
				return open;
			},
			set open(v) {
				open = v;
			},
			get index() {
				return index;
			},
			set index(v) {
				index = v;
			},
			get loop() {
				return loop;
			},
			get viewTransition() {
				return viewTransition;
			},
			get morphTo() {
				return morphTo;
			},
			get onOpenChange() {
				return onOpenChange;
			}
		})
	);

	ensureStyles();

	/** Opens at `i`, morphing from its Trigger when one is registered. */
	export function show(i = index) {
		return lb.show(i);
	}

	/** Closes, morphing back to the Trigger picked by `morphTo`. */
	export function close() {
		return lb.close();
	}

	$effect(() => {
		if (open) {
			lb.present = true;
			return;
		}
		const portal = lb.portal;
		if (!lb.present || !portal) return;
		let cancelled = false;
		exitDone(portal).then(() => {
			if (!cancelled) lb.present = false;
		});
		return () => (cancelled = true);
	});

	$effect(() => {
		if (!open) return;
		const el = lb.closeTarget() && morphSource(lb.closeTarget()!.el);
		if (!el) return;
		el.setAttribute('data-morph-target', '');
		return () => el.removeAttribute('data-morph-target');
	});

	async function exitDone(el: HTMLElement) {
		await new Promise((r) => requestAnimationFrame(() => requestAnimationFrame(r)));
		const running = el
			.getAnimations({ subtree: true })
			.filter((a) => a.effect?.getComputedTiming().iterations !== Infinity);
		await Promise.allSettled(running.map((a) => a.finished));
	}
</script>

{@render children?.()}
