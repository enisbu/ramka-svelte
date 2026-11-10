<script lang="ts">
	import type { Snippet } from 'svelte';
	import CodeBlock, { type Highlighted } from './CodeBlock.svelte';

	interface Props {
		code: Highlighted;
		title?: string;
		children: Snippet;
	}

	let { code, title, children }: Props = $props();
</script>

<div class="overflow-hidden rounded-xl border border-neutral-200 dark:border-neutral-800">
	<div
		class="border-b border-neutral-200 bg-white p-4 sm:p-6 dark:border-neutral-800 dark:bg-neutral-950"
	>
		{@render children()}
	</div>
	<CodeBlock {code} {title} embedded />
</div>
