<script lang="ts">
	import { githubUrl } from '#lib/content/site.js';
	import GitHubIcon from './GitHubIcon.svelte';
	import ThemeToggle from './ThemeToggle.svelte';

	let { home = false }: { home?: boolean } = $props();
	const wordmark = 'text-sm font-semibold tracking-tight text-neutral-900 dark:text-neutral-50';
</script>

<header class="mx-auto flex w-full max-w-5xl items-center justify-between px-6 py-3 md:py-5">
	{#if home}
		<a href="/" class="{wordmark} transition-colors hover:text-neutral-600 dark:hover:text-neutral-300">ramka</a>
	{:else}
		<span class={wordmark}>ramka</span>
	{/if}
	<div class="flex items-center gap-2">
		<a
			href={githubUrl}
			target="_blank"
			rel="noreferrer"
			aria-label="ramka for Svelte on GitHub"
			class="inline-flex h-8 w-8 items-center justify-center rounded-md border border-neutral-200 bg-white text-neutral-700 transition hover:bg-neutral-100 dark:border-neutral-800 dark:bg-neutral-900 dark:text-neutral-300 dark:hover:bg-neutral-800"
		>
			<GitHubIcon class="h-4 w-4" />
		</a>
		<ThemeToggle />
	</div>
</header>
