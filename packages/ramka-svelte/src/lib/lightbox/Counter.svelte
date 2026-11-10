<script lang="ts">
	import type { Snippet } from 'svelte';
	import type { HTMLAttributes } from 'svelte/elements';
	import { getLightbox } from './state.svelte.js';

	interface Props extends Omit<HTMLAttributes<HTMLDivElement>, 'children'> {
		children?: Snippet<[{ index: number; count: number }]>;
	}

	let { children, ...rest }: Props = $props();
	const lb = getLightbox();
</script>

<div data-ramka-counter {...rest}>
	{#if children}
		{@render children({ index: lb.index, count: lb.count })}
	{:else}
		{lb.index + 1} / {lb.count}
	{/if}
</div>
