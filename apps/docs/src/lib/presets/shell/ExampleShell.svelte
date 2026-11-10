<script lang="ts">
	import type { Snippet } from 'svelte';

	interface Props {
		title: string;
		description?: Snippet;
		docsHref?: string;
		docsLabel?: string;
		children: Snippet;
	}

	let { title, description, docsHref, docsLabel = 'Lightbox docs', children }: Props = $props();
</script>

<div class="shell">
	<header>
		<h1>{title}</h1>
		{#if description}
			<div class="description">{@render description()}</div>
		{/if}
		{#if docsHref}
			<p class="see-also">See also: <a href={docsHref}>{docsLabel}</a></p>
		{/if}
	</header>
	<div>{@render children()}</div>
</div>

<style>
	.shell {
		box-sizing: border-box;
		width: 100%;
		max-width: 56rem;
		margin-inline: auto;
		padding: 3.5rem 1.5rem;
	}
	@media (min-width: 768px) {
		.shell {
			padding: 4rem 2.5rem;
		}
	}
	header {
		margin-bottom: 2.5rem;
	}
	h1 {
		margin: 0;
		font-size: 2.25rem;
		line-height: 2.5rem;
		font-weight: 600;
		letter-spacing: -0.025em;
		text-wrap: balance;
		color: #171717;
	}
	.description {
		max-width: 42rem;
		margin-top: 1rem;
		font-size: 15px;
		line-height: 1.75rem;
		text-wrap: pretty;
		color: #737373;
	}
	.description :global(strong) {
		font-weight: 500;
		color: #262626;
	}
	.description :global(code) {
		font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;
		font-size: 0.75rem;
	}
	.see-also {
		margin: 1rem 0 0;
		font-size: 13px;
		color: #737373;
	}
	.see-also a {
		color: #2563eb;
		text-decoration: underline;
		text-underline-offset: 2px;
	}
	:global(.dark) h1 {
		color: #fafafa;
	}
	:global(.dark) .description {
		color: #a3a3a3;
	}
	:global(.dark) .description :global(strong) {
		color: #e5e5e5;
	}
	:global(.dark) .see-also a {
		color: #60a5fa;
	}
</style>
