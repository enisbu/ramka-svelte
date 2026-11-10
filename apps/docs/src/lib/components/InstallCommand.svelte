<script lang="ts">
	import Check from '@lucide/svelte/icons/check';
	import Copy from '@lucide/svelte/icons/copy';
	import { copyText } from '#lib/copy-text.js';
	import { installCommand } from '#lib/content/site.js';

	let copied = $state(false);
	let timer: ReturnType<typeof setTimeout>;

	function copy() {
		if (!copyText(installCommand)) return;
		copied = true;
		clearTimeout(timer);
		timer = setTimeout(() => (copied = false), 1600);
	}
</script>

<button
	type="button"
	onclick={copy}
	aria-label="Copy install command: {installCommand}"
	class="group inline-flex h-11 items-center gap-3 rounded-full border border-neutral-200 bg-neutral-50 px-4 font-mono text-sm text-neutral-600 transition hover:border-neutral-300 hover:text-neutral-900 dark:border-neutral-800 dark:bg-neutral-900 dark:text-neutral-400 dark:hover:border-neutral-700 dark:hover:text-neutral-100"
>
	<span aria-hidden="true" class="text-neutral-400 select-none dark:text-neutral-600">$</span>
	{installCommand}
	<span
		class="text-neutral-400 transition group-hover:text-neutral-600 dark:text-neutral-600 dark:group-hover:text-neutral-300"
	>
		{#if copied}<Check aria-hidden="true" class="size-4" />{:else}<Copy
				aria-hidden="true"
				class="size-4"
			/>{/if}
	</span>
</button>
