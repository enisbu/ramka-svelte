<script lang="ts">
	import type { Snippet } from 'svelte';

	interface Props {
		id: string;
		title: string | Snippet;
		level?: 2 | 3;
		children: Snippet;
	}

	let { id, title, level = 2, children }: Props = $props();
</script>

<section {id} class="scroll-mt-20">
	<svelte:element
		this={level === 2 ? 'h2' : 'h3'}
		class={[
			'font-semibold tracking-tight text-neutral-900 dark:text-neutral-50',
			level === 2 ? 'text-2xl' : 'text-[17px]'
		]}
	>
		{#if typeof title === 'string'}
			<a href="#{id}" class="hover:underline">{title}</a>
		{:else}
			{@render title()}
		{/if}
	</svelte:element>
	<div
		class="mt-4 space-y-4 text-[15px] leading-7 text-neutral-600 dark:text-neutral-400 [&_strong]:font-medium [&_strong]:text-neutral-800 dark:[&_strong]:text-neutral-200"
	>
		{@render children()}
	</div>
</section>
