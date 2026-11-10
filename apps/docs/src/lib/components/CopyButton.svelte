<script lang="ts">
	import Check from '@lucide/svelte/icons/check';
	import Copy from '@lucide/svelte/icons/copy';
	import { copyText } from '#lib/copy-text.js';

	let { code }: { code: string } = $props();
	let copied = $state(false);
	let timer: ReturnType<typeof setTimeout>;

	function copy() {
		if (!copyText(code)) return;
		copied = true;
		clearTimeout(timer);
		timer = setTimeout(() => (copied = false), 1500);
	}
</script>

<button
	type="button"
	onclick={copy}
	aria-label="Copy code"
	class="inline-flex items-center gap-1 rounded px-1.5 py-0.5 text-xs text-neutral-500 transition hover:bg-neutral-200/70 hover:text-neutral-800 dark:hover:bg-neutral-800 dark:hover:text-neutral-200"
>
	{#if copied}<Check class="size-3.5" />{:else}<Copy class="size-3.5" />{/if}
	{copied ? 'Copied' : 'Copy'}
</button>
