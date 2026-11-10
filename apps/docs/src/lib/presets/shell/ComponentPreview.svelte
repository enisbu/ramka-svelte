<script lang="ts">
	import Check from '@lucide/svelte/icons/check';
	import Copy from '@lucide/svelte/icons/copy';
	import type { Snippet } from 'svelte';
	import * as Tabs from '#lib/components/ui/tabs/index.js';
	import type { SourceFile } from './source.js';

	interface Props {
		files: SourceFile[];
		frame?: boolean;
		children: Snippet;
	}

	let { files, frame = false, children }: Props = $props();

	let active = $state<string>();
	let copied = $state(false);
	let copiedTimer = 0;
	const current = $derived(files.find((file) => file.name === active) ?? files[0]);
	const groups = $derived.by(() => {
		const order = ['package', 'example', undefined] as const;
		return order
			.map((group) => files.filter((file) => file.group === group))
			.filter((list) => list.length);
	});

	async function copy() {
		if (!current) return;
		try {
			await navigator.clipboard.writeText(current.code);
		} catch {
			return;
		}
		copied = true;
		clearTimeout(copiedTimer);
		copiedTimer = window.setTimeout(() => (copied = false), 1500);
	}
</script>

<div class="flex flex-col gap-4">
	{#if frame}
		<div class="overflow-hidden rounded-xl border border-neutral-200 dark:border-neutral-800">
			<div
				class="flex min-h-70 items-center justify-center bg-white p-6 sm:p-10 dark:bg-neutral-950"
			>
				{@render children()}
			</div>
		</div>
	{:else}
		<div class="py-4">{@render children()}</div>
	{/if}

	<div class="overflow-hidden rounded-xl border border-neutral-200 dark:border-neutral-800">
		<Tabs.Root
			value={current?.name}
			onValueChange={(value) => {
				active = value;
				copied = false;
			}}
			class="gap-0"
		>
			<div
				class="flex flex-col gap-2 border-b border-neutral-200 bg-neutral-50 px-3 py-2 dark:border-neutral-800 dark:bg-neutral-900"
			>
				<div class="flex items-center justify-between gap-3">
					{#if files.length > 1}
						<Tabs.List
							class="min-h-8 max-w-full flex-wrap justify-start group-data-horizontal/tabs:h-auto"
						>
							{#each groups as list, g (g)}
								{#if g > 0}
									<span
										aria-hidden="true"
										class="mx-1 h-4 w-px shrink-0 self-center bg-neutral-300 dark:bg-neutral-600"
									></span>
								{/if}
								{#each list as file (file.name)}
									<Tabs.Trigger
										value={file.name}
										class="h-[calc(2rem-7px)] flex-none px-2.5 text-xs">{file.name}</Tabs.Trigger
									>
								{/each}
							{/each}
						</Tabs.List>
					{:else}
						<span class="text-xs font-medium text-neutral-500">{current?.name}</span>
					{/if}
					<button
						type="button"
						onclick={copy}
						class="inline-flex h-8 shrink-0 items-center gap-1.5 rounded-md px-2 text-xs font-medium text-neutral-500 transition hover:bg-neutral-200/70 hover:text-neutral-900 dark:hover:bg-neutral-800 dark:hover:text-neutral-100"
						aria-label={current ? `Copy ${current.name}` : 'Copy code'}
					>
						{#if copied}<Check class="size-3.5" />{:else}<Copy class="size-3.5" />{/if}
						<span class="hidden sm:inline">{copied ? 'Copied' : 'Copy'}</span>
					</button>
				</div>
				{#if current?.note}
					<p class="text-[11px] leading-snug text-neutral-500 dark:text-neutral-400">
						{current.note}
					</p>
				{/if}
			</div>
			{#each files as file (file.name)}
				<Tabs.Content value={file.name} class="mt-0">
					{#if file === current}
						<div
							class="code max-h-[min(32rem,70vh)] overflow-auto bg-neutral-50 dark:bg-neutral-950"
						>
							{@html file.html}
						</div>
					{/if}
				</Tabs.Content>
			{/each}
		</Tabs.Root>
	</div>
</div>

<style>
	.code :global(.shiki) {
		margin: 0;
		padding: 1rem;
		font-family:
			ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono', 'Courier New',
			monospace;
		font-size: 13px;
		line-height: 1.625;
		tab-size: 2;
		background: transparent !important;
		color: var(--shiki-light);
	}
	.code :global(.shiki span) {
		color: var(--shiki-light);
		font-style: var(--shiki-light-font-style);
		font-weight: var(--shiki-light-font-weight);
		text-decoration: var(--shiki-light-text-decoration);
	}
	.code :global(.shiki code) {
		display: block;
		width: fit-content;
		min-width: 100%;
	}
	:global(.dark) .code :global(.shiki),
	:global(.dark) .code :global(.shiki span) {
		color: var(--shiki-dark) !important;
		font-style: var(--shiki-dark-font-style) !important;
		font-weight: var(--shiki-dark-font-weight) !important;
		text-decoration: var(--shiki-dark-text-decoration) !important;
	}
</style>
