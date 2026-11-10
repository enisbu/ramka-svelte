<script lang="ts">
	import type { Snippet } from 'svelte';

	let { label, children }: { label?: string; children: Snippet } = $props();
</script>

<kbd
	class="pointer-events-none inline-flex h-5 w-fit min-w-5 items-center justify-center gap-1 rounded-sm bg-muted px-1 font-sans text-xs font-medium text-muted-foreground [&_svg:not([class*='size-'])]:size-3"
>
	{#if label}
		<span aria-hidden="true" class="contents">{@render children()}</span>
		<span class="sr-only">{label}</span>
	{:else}
		{@render children()}
	{/if}
</kbd>
