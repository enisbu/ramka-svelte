<script lang="ts">
	import type { Snippet } from 'svelte';
	import type { HTMLAttributes } from 'svelte/elements';
	import { getItem, getLightbox } from './state.svelte.js';
	import { ZoomController } from './zoom.js';

	interface Props extends HTMLAttributes<HTMLDivElement> {
		max?: number;
		children?: Snippet;
	}

	let { max = 4, children, ...rest }: Props = $props();
	const lb = getLightbox();
	const item = getItem();
	let scale = $state(1);
	const active = $derived(lb.index === item.index);

	$effect(() => {
		if (active) lb.zoomScale = scale;
	});

	function zoom(viewport: HTMLElement) {
		const controller = new ZoomController(viewport, viewport.firstElementChild as HTMLElement, () => max, (s) => (scale = s));
		const index = item.index;
		lb.zooms.set(index, controller);
		const events = ['pointerdown', 'pointermove', 'pointerup', 'pointercancel', 'dblclick'] as const;
		const handlers = {
			pointerdown: controller.onpointerdown,
			pointermove: controller.onpointermove,
			pointerup: controller.onpointerup,
			pointercancel: controller.onpointerup,
			dblclick: controller.ondblclick
		};
		for (const type of events) viewport.addEventListener(type, handlers[type] as EventListener);
		viewport.addEventListener('wheel', controller.onwheel, { passive: false });
		$effect(() => {
			if (!active && controller.scale !== 1) controller.reset(0);
		});
		return () => {
			for (const type of events) viewport.removeEventListener(type, handlers[type] as EventListener);
			viewport.removeEventListener('wheel', controller.onwheel);
			controller.destroy();
			if (lb.zooms.get(index) === controller) lb.zooms.delete(index);
			if (active) lb.zoomScale = 1;
		};
	}
</script>

<div data-ramka-zoom data-zoomed={scale > 1.01 || undefined} {...rest} {@attach zoom}>
	<div data-ramka-zoom-content>
		{@render children?.()}
	</div>
</div>
