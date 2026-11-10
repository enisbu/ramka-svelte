<script lang="ts" module>
	/** Source text plus Shiki tokens per line, produced at build time by the highlight plugin. */
	export interface Highlighted {
		code: string;
		lines: { content: string; style: string }[][];
	}
</script>

<script lang="ts">
	import CopyButton from './CopyButton.svelte';

	interface Props {
		code: Highlighted;
		title?: string;
		embedded?: boolean;
		class?: string;
	}

	let { code, title, embedded = false, class: className }: Props = $props();
</script>

<div
	class={[
		'code-block overflow-hidden',
		embedded
			? 'rounded-none border-0'
			: 'rounded-lg border border-neutral-200 dark:border-neutral-800',
		className
	]}
>
	<div
		class={[
			'flex items-center border-b border-neutral-200 bg-neutral-50 dark:border-neutral-800 dark:bg-neutral-900',
			title ? 'justify-between px-3 py-1.5' : 'justify-end px-2 py-1'
		]}
	>
		{#if title}<span class="text-xs font-medium text-neutral-500">{title}</span>{/if}
		<CopyButton code={code.code} />
	</div>
	<div class="code-block-pre overflow-x-auto bg-neutral-50 dark:bg-neutral-950">
		<pre class="shiki"><code
				>{#each code.lines as line, i (i)}<span class="line"
						>{#each line as token, j (j)}<span style={token.style}>{token.content}</span
							>{/each}</span
					>{/each}</code
			></pre>
	</div>
</div>
