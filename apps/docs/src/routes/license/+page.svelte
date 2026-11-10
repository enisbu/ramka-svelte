<script lang="ts">
	import SiteFooter from '#lib/components/SiteFooter.svelte';
	import SiteHeader from '#lib/components/SiteHeader.svelte';
	import { upstream } from '#lib/content/site.js';
	import license from '../../../../../packages/svelte/LICENSE?raw';

	const link =
		'underline decoration-neutral-300 underline-offset-2 transition hover:decoration-neutral-500 dark:decoration-neutral-700 dark:hover:decoration-neutral-500';
</script>

<svelte:head>
	<title>License · ramka for Svelte</title>
	<meta name="description" content="ramka for Svelte is free software under the MIT License." />
</svelte:head>

<div class="isolate flex min-h-screen flex-col">
	<SiteHeader home />
	<main class="flex-1">
		<section class="mx-auto w-full max-w-2xl px-6 pt-16 pb-20 md:pt-20 md:pb-24">
			<h1 class="text-3xl font-semibold tracking-tight text-balance text-neutral-950 md:text-4xl dark:text-neutral-50">
				License
			</h1>
			<p class="mt-4 text-[15px] leading-7 text-neutral-600 dark:text-neutral-400">
				ramka for Svelte is free software under the MIT License, for open-source and proprietary use.
			</p>
			<pre
				class="mt-8 overflow-x-auto rounded-2xl border border-neutral-200 p-5 text-xs leading-6 whitespace-pre-wrap text-neutral-500 dark:border-neutral-800 dark:text-neutral-400">{license}</pre>
			<p class="mt-8 text-[15px] leading-7 text-neutral-600 dark:text-neutral-400">
				The original React library and its third-party notices live at
				<a href={upstream.site} target="_blank" rel="noreferrer" class={link}>ramka.dev</a>.
			</p>
		</section>
	</main>
	<SiteFooter />
</div>
