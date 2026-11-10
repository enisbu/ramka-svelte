<script lang="ts">
	import type { Snippet } from 'svelte';
	import type { HTMLAttributes } from 'svelte/elements';
	import { pullToDismiss } from './pull.js';
	import { getLightbox } from './state.svelte.js';

	interface Props extends HTMLAttributes<HTMLDivElement> {
		pullToClose?: boolean;
		children?: Snippet;
	}

	let { pullToClose = true, children, ...rest }: Props = $props();
	const lb = getLightbox();
	const PAN_STEP = 60;
	const FOCUSABLE = 'button:not([disabled]), [href], input, select, textarea, [tabindex]:not([tabindex="-1"])';

	let dialogEl: HTMLElement;

	function dialog(el: HTMLElement) {
		dialogEl = el;
		const returnFocus = document.activeElement as HTMLElement | null;
		const html = document.documentElement;
		const { overflow, paddingRight } = html.style;
		html.style.paddingRight = `${window.innerWidth - html.clientWidth}px`;
		html.style.overflow = 'hidden';
		queueMicrotask(() => el.focus({ preventScroll: true }));
		return () => {
			html.style.overflow = overflow;
			html.style.paddingRight = paddingRight;
			returnFocus?.focus({ preventScroll: true });
		};
	}

	function trapTab(e: KeyboardEvent, el: HTMLElement) {
		const nodes = [...el.querySelectorAll<HTMLElement>(FOCUSABLE)].filter(
			(n) => n.checkVisibility() && !n.closest('[inert]')
		);
		if (!nodes.length) return e.preventDefault();
		const [first, last] = [nodes[0], nodes[nodes.length - 1]];
		const current = document.activeElement;
		if (!el.contains(current)) {
			e.preventDefault();
			first.focus();
		} else if (e.shiftKey && (current === first || current === el)) {
			e.preventDefault();
			last.focus();
		} else if (!e.shiftKey && current === last) {
			e.preventDefault();
			first.focus();
		}
	}

	function onkeydown(e: KeyboardEvent) {
		if (e.defaultPrevented || !lb.open) return;
		if (e.key === 'Tab') return trapTab(e, dialogEl);
		if (e.ctrlKey || e.metaKey || e.altKey) return;
		const zoom = lb.activeZoom;
		const pan: Record<string, [number, number]> = {
			ArrowLeft: [PAN_STEP, 0],
			ArrowRight: [-PAN_STEP, 0],
			ArrowUp: [0, PAN_STEP],
			ArrowDown: [0, -PAN_STEP]
		};
		const actions: Record<string, () => void> = {
			Escape: () => lb.close(),
			ArrowLeft: () => lb.go(lb.index - 1),
			ArrowRight: () => lb.go(lb.index + 1),
			Home: () => lb.go(0),
			End: () => lb.go(lb.count - 1),
			'+': () => zoom?.zoomIn(),
			'=': () => zoom?.zoomIn(),
			'-': () => zoom?.zoomOut(),
			'0': () => zoom?.reset()
		};
		if (lb.zoomed && pan[e.key]) zoom?.pan(...pan[e.key]);
		else if (actions[e.key]) actions[e.key]();
		else return;
		e.preventDefault();
	}
</script>

<svelte:document {onkeydown} />

<div
	role="dialog"
	aria-modal="true"
	tabindex="-1"
	data-ramka-content
	data-open={lb.open || undefined}
	data-closed={!lb.open || undefined}
	data-pulling={lb.pulling || undefined}
	data-pull-dismissing={lb.pullDismissing || undefined}
	data-zoomed={lb.zoomed || undefined}
	{...rest}
	{@attach dialog}
	{@attach pullToClose && pullToDismiss(lb)}
>
	{@render children?.()}
</div>
