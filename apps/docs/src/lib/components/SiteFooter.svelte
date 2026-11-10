<script lang="ts">
	import { githubUrl, upstream } from '#lib/content/site.js';
	import FooterWordplay from './FooterWordplay.svelte';

	const link = 'transition hover:text-neutral-900 dark:hover:text-neutral-100';
</script>

<footer class="border-t border-neutral-200 dark:border-neutral-800">
	<div
		class="mx-auto flex w-full max-w-5xl min-w-0 flex-col gap-4 px-6 py-8 text-sm text-neutral-500 sm:flex-row sm:flex-wrap sm:items-center sm:justify-between dark:text-neutral-400"
	>
		<FooterWordplay />
		<nav class="flex min-w-0 flex-wrap items-center gap-x-4 gap-y-2">
			<a href="/docs" class={link}>Docs</a>
			<a href="/examples/lightbox/photos-app" class={link}>Examples</a>
			<a href="/license" class={link}>License</a>
			<a href={githubUrl} target="_blank" rel="noreferrer" class={link}>GitHub</a>
		</nav>
		<p class="w-full text-[13px] text-neutral-400 dark:text-neutral-500">
			Svelte port of <a href={upstream.site} target="_blank" rel="noreferrer" class={link}>ramka</a> by
			<a href={upstream.authorUrl} target="_blank" rel="noreferrer" class={link}>{upstream.author}</a>. The React
			original is <a href={upstream.npm} target="_blank" rel="noreferrer" class={link}>@ramka/react</a>.
		</p>
	</div>
</footer>
