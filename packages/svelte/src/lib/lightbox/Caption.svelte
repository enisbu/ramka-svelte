<script lang="ts">
	import type { Snippet } from 'svelte';
	import type { HTMLAttributes } from 'svelte/elements';
	import { getLightbox } from './state.svelte.js';

	interface Props extends Omit<HTMLAttributes<HTMLDivElement>, 'children'> {
		children?: Snippet<[string]>;
	}

	let { children, ...rest }: Props = $props();
	const lb = getLightbox();
</script>

{#if lb.caption}
	<div data-ramka-caption aria-live="polite" {...rest}>
		{#if children}{@render children(lb.caption)}{:else}{lb.caption}{/if}
	</div>
{/if}
