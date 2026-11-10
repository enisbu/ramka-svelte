<script lang="ts">
	import type { Snippet } from 'svelte';
	import { cubicOut } from 'svelte/easing';
	import { fade } from 'svelte/transition';

	interface Props {
		open: boolean;
		title: string;
		description?: string;
		children: Snippet;
	}

	let { open = $bindable(), title, description, children }: Props = $props();
	let drag = $state(0);
	let start = $state<number | null>(null);

	function sheet(_node: Element, { duration = 450 } = {}) {
		return {
			duration,
			easing: cubicOut,
			css: (t: number) => `transform: translate3d(0, ${(1 - t) * 100}%, 0)`
		};
	}

	function trap(node: HTMLElement) {
		const returnFocus = document.activeElement as HTMLElement | null;
		node.focus();
		const html = document.documentElement;
		const overflow = html.style.overflow;
		html.style.overflow = 'hidden';
		return () => {
			html.style.overflow = overflow;
			returnFocus?.focus();
		};
	}

	function onpointerdown(e: PointerEvent) {
		start = e.clientY;
		(e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
	}

	function onpointermove(e: PointerEvent) {
		if (start !== null) drag = Math.max(0, e.clientY - start);
	}

	function onpointerup() {
		if (drag > 80) open = false;
		drag = 0;
		start = null;
	}
</script>

<svelte:window onkeydown={(e) => open && e.key === 'Escape' && (open = false)} />

{#if open}
	<div
		class="fixed inset-0 z-50 min-h-dvh bg-black/10 backdrop-blur-xs"
		transition:fade={{ duration: 300 }}
		onclick={() => (open = false)}
		aria-hidden="true"
	></div>
	<div
		role="dialog"
		aria-modal="true"
		aria-label={title}
		tabindex="-1"
		class="fixed inset-x-0 bottom-0 z-50 flex max-h-[85dvh] flex-col rounded-t-xl border-t bg-popover text-sm text-popover-foreground outline-none"
		style:transform={drag ? `translate3d(0, ${drag}px, 0)` : undefined}
		style:transition={start === null ? 'transform 450ms cubic-bezier(0.22, 1, 0.36, 1)' : 'none'}
		transition:sheet
		{@attach trap}
	>
		<!-- svelte-ignore a11y_no_static_element_interactions -->
		<div
			class="touch-none"
			{onpointerdown}
			{onpointermove}
			{onpointerup}
			onpointercancel={onpointerup}
		>
			<div class="flex h-3 w-full cursor-grab items-end justify-center">
				<span class="block h-1 w-24 rounded-full bg-muted"></span>
			</div>
			<div class="flex flex-col gap-0.5 p-4 pb-0 text-left">
				<h2 class="text-base font-medium text-foreground">{title}</h2>
				{#if description}<p class="text-sm text-balance text-muted-foreground">
						{description}
					</p>{/if}
			</div>
		</div>
		{@render children()}
	</div>
{/if}
