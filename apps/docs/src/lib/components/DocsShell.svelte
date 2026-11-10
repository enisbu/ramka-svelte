<script lang="ts" module>
	/** Table of contents entry. */
	export interface TocItem {
		id: string;
		title: string;
		children?: TocItem[];
	}
</script>

<script lang="ts">
	import type { Snippet } from 'svelte';
	import DocsPager from './DocsPager.svelte';
	import { page } from '$app/state';
	import { pagerFor } from '#lib/content/nav.js';

	interface Props {
		title: string;
		description?: Snippet;
		toc?: TocItem[];
		children: Snippet;
	}

	let { title, description, toc, children }: Props = $props();
	const pager = $derived(pagerFor(page.url.pathname));
</script>

<div class="mx-auto flex w-full max-w-6xl gap-12 px-6 py-14 md:px-10 md:py-16">
	<div class="min-w-0 flex-1">
		<header class="mb-12">
			<h1
				class="text-4xl font-semibold tracking-tight text-balance text-neutral-900 dark:text-neutral-50"
			>
				{title}
			</h1>
			{#if description}
				<div
					class="mt-4 max-w-2xl text-[17px] leading-7 text-pretty text-neutral-500 dark:text-neutral-400"
				>
					{@render description()}
				</div>
			{/if}
		</header>
		<div class="docs-prose space-y-14">{@render children()}</div>
		<DocsPager {...pager} />
	</div>
	{#if toc?.length}
		<aside class="sticky top-12 hidden h-[calc(100vh-6rem)] w-56 shrink-0 overflow-y-auto xl:block">
			<div
				class="text-[11px] font-semibold tracking-[0.1em] text-neutral-400 uppercase dark:text-neutral-600"
			>
				On this page
			</div>
			<ul class="mt-4 space-y-0.5 border-l border-neutral-200 dark:border-neutral-800">
				{#each toc as item (item.id)}
					<li>
						<a
							href="#{item.id}"
							class="block border-l-2 border-transparent py-1 pl-3.5 text-[13px] leading-6 text-neutral-500 transition-colors hover:border-neutral-400 hover:text-neutral-900 dark:text-neutral-400 dark:hover:border-neutral-500 dark:hover:text-neutral-100"
						>
							{item.title}
						</a>
						{#if item.children?.length}
							<ul class="mt-0.5 space-y-0.5 pb-1">
								{#each item.children as child (child.id)}
									<li>
										<a
											href="#{child.id}"
											class="block py-0.5 pl-6 text-xs leading-5 text-neutral-400 transition-colors hover:text-neutral-800 dark:text-neutral-500 dark:hover:text-neutral-200"
										>
											{child.title}
										</a>
									</li>
								{/each}
							</ul>
						{/if}
					</li>
				{/each}
			</ul>
		</aside>
	{/if}
</div>
