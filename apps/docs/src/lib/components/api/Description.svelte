<script lang="ts">
	let { text }: { text: string } = $props();
</script>

{#each text.split(/(`[^`]+`)/) as part, i (i)}{#if part.startsWith('`')}<code
			class="rounded bg-neutral-100 px-1 py-0.5 font-mono text-xs dark:bg-neutral-800">{part.slice(1, -1)}</code
		>{:else}{part}{/if}{/each}
