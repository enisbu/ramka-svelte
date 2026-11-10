<script lang="ts">
	import type { Snippet } from 'svelte';
	import type { SourceFile } from './source.js';

	interface Props {
		files: SourceFile[];
		frame?: boolean;
		children: Snippet;
	}

	let { files, frame = false, children }: Props = $props();

	let active = $state(0);
	let copied = $state(false);
	let copiedTimer = 0;
	const current = $derived(files[active] ?? files[0]);
	const groups = $derived.by(() => {
		const order = ['package', 'example', undefined] as const;
		return order
			.map((group) =>
				files.map((file, i) => ({ file, i })).filter(({ file }) => file.group === group)
			)
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

<div class="preview">
	{#if frame}
		<div class="frame"><div class="stage">{@render children()}</div></div>
	{:else}
		<div class="bare">{@render children()}</div>
	{/if}

	<div class="source">
		<div class="bar">
			<div class="row">
				{#if files.length > 1}
					<div class="tabs" role="tablist">
						{#each groups as list, g (g)}
							{#if g > 0}<span class="divider" aria-hidden="true"></span>{/if}
							{#each list as { file, i } (file.name)}
								<button
									type="button"
									role="tab"
									class="tab"
									aria-selected={i === active}
									data-active={i === active || undefined}
									onclick={() => {
										active = i;
										copied = false;
									}}
								>
									{file.name}
								</button>
							{/each}
						{/each}
					</div>
				{:else}
					<span class="single">{current?.name}</span>
				{/if}
				<button
					type="button"
					class="copy"
					onclick={copy}
					aria-label="Copy {current?.name ?? 'code'}"
				>
					{#if copied}
						<svg viewBox="0 0 24 24"><path d="M20 6 9 17l-5-5" /></svg>
					{:else}
						<svg viewBox="0 0 24 24"
							><rect width="14" height="14" x="8" y="8" rx="2" ry="2" /><path
								d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2"
							/></svg
						>
					{/if}
					<span class="copy-label">{copied ? 'Copied' : 'Copy'}</span>
				</button>
			</div>
			{#if current?.note}
				<p class="note">{current.note}</p>
			{/if}
		</div>
		<div class="code" role="tabpanel">
			{@html current?.html}
		</div>
	</div>
</div>

<style>
	.preview {
		display: flex;
		flex-direction: column;
		gap: 1rem;
	}
	.bare {
		padding-block: 1rem;
	}
	.frame {
		overflow: hidden;
		border: 1px solid #e5e5e5;
		border-radius: 0.75rem;
	}
	.stage {
		display: flex;
		align-items: center;
		justify-content: center;
		min-height: 17.5rem;
		padding: 1.5rem;
		background: #fff;
	}
	@media (min-width: 640px) {
		.stage {
			padding: 2.5rem;
		}
	}
	.source {
		overflow: hidden;
		border: 1px solid #e5e5e5;
		border-radius: 0.75rem;
	}
	.bar {
		display: flex;
		flex-direction: column;
		gap: 0.5rem;
		padding: 0.5rem 0.75rem;
		border-bottom: 1px solid #e5e5e5;
		background: #fafafa;
	}
	.row {
		display: flex;
		align-items: center;
		justify-content: space-between;
		gap: 0.75rem;
	}
	.tabs {
		display: inline-flex;
		flex-wrap: wrap;
		align-items: center;
		max-width: 100%;
		min-height: 2rem;
		box-sizing: border-box;
		padding: 3px;
		border-radius: 0.5rem;
		background: #f5f5f5;
	}
	.tab {
		display: inline-flex;
		align-items: center;
		justify-content: center;
		height: calc(2rem - 7px);
		padding: 0.125rem 0.625rem;
		border: 1px solid transparent;
		border-radius: 0.375rem;
		background: transparent;
		font: inherit;
		font-size: 0.75rem;
		font-weight: 500;
		line-height: 1rem;
		white-space: nowrap;
		color: rgb(10 10 10 / 0.6);
		cursor: pointer;
		transition: all 150ms cubic-bezier(0.4, 0, 0.2, 1);
	}
	.tab:hover {
		color: #0a0a0a;
	}
	.tab[data-active] {
		background: #fff;
		color: #0a0a0a;
		box-shadow:
			0 1px 3px 0 rgb(0 0 0 / 0.1),
			0 1px 2px -1px rgb(0 0 0 / 0.1);
	}
	.tab:focus-visible {
		outline: 1px solid #a1a1a1;
		box-shadow: 0 0 0 3px rgb(161 161 161 / 0.5);
	}
	.divider {
		flex-shrink: 0;
		width: 1px;
		height: 1rem;
		margin-inline: 0.25rem;
		background: #d4d4d4;
	}
	.single {
		font-size: 0.75rem;
		font-weight: 500;
		color: #737373;
	}
	.copy {
		display: inline-flex;
		flex-shrink: 0;
		align-items: center;
		gap: 0.375rem;
		height: 2rem;
		padding: 0 0.5rem;
		border: 0;
		border-radius: 0.375rem;
		background: transparent;
		font: inherit;
		font-size: 0.75rem;
		font-weight: 500;
		color: #737373;
		cursor: pointer;
		transition: all 150ms cubic-bezier(0.4, 0, 0.2, 1);
	}
	.copy:hover {
		background: rgb(229 229 229 / 0.7);
		color: #171717;
	}
	.copy svg {
		width: 0.875rem;
		height: 0.875rem;
		fill: none;
		stroke: currentColor;
		stroke-width: 2;
		stroke-linecap: round;
		stroke-linejoin: round;
	}
	.copy-label {
		display: none;
	}
	@media (min-width: 640px) {
		.copy-label {
			display: inline;
		}
	}
	.note {
		margin: 0;
		font-size: 11px;
		line-height: 1.375;
		color: #737373;
	}
	.code {
		max-height: min(32rem, 70vh);
		overflow: auto;
		background: #fafafa;
	}
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

	:global(.dark) .frame,
	:global(.dark) .source {
		border-color: #262626;
	}
	:global(.dark) .stage,
	:global(.dark) .code {
		background: #0a0a0a;
	}
	:global(.dark) .bar {
		border-color: #262626;
		background: #171717;
	}
	:global(.dark) .tabs {
		background: #262626;
	}
	:global(.dark) .tab {
		color: #a1a1a1;
	}
	:global(.dark) .tab:hover,
	:global(.dark) .tab[data-active] {
		color: #fafafa;
	}
	:global(.dark) .tab[data-active] {
		border-color: rgb(255 255 255 / 0.15);
		background: rgb(255 255 255 / 0.045);
	}
	:global(.dark) .divider {
		background: #525252;
	}
	:global(.dark) .copy:hover {
		background: #262626;
		color: #f5f5f5;
	}
	:global(.dark) .note {
		color: #a3a3a3;
	}
	:global(.dark) .code :global(.shiki),
	:global(.dark) .code :global(.shiki span) {
		color: var(--shiki-dark) !important;
		font-style: var(--shiki-dark-font-style) !important;
		font-weight: var(--shiki-dark-font-weight) !important;
		text-decoration: var(--shiki-dark-text-decoration) !important;
	}
</style>
