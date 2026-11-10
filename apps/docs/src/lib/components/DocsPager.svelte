<script lang="ts">
	import type { NavLink } from '#lib/content/nav.js';

	let { prev, next }: { prev?: NavLink; next?: NavLink } = $props();
	const card =
		'rounded-2xl border border-neutral-200 px-5 py-4 transition hover:border-neutral-300 hover:bg-neutral-50 dark:border-neutral-800 dark:hover:border-neutral-700 dark:hover:bg-neutral-900';
</script>

{#if prev || next}
	<nav
		aria-label="Docs pagination"
		class={[
			'mt-20 grid gap-3 border-t border-neutral-200 pt-10 dark:border-neutral-800',
			prev && next ? 'sm:grid-cols-2' : 'grid-cols-1'
		]}
	>
		{#if prev}
			<a href={prev.href} class={card}>
				<div class="text-[11px] font-medium tracking-[0.08em] text-neutral-400 uppercase">Previous</div>
				<div class="mt-1.5 text-sm font-semibold text-neutral-900 dark:text-neutral-50">{prev.title}</div>
			</a>
		{:else}
			<div></div>
		{/if}
		{#if next}
			<a href={next.href} class={[card, prev && 'sm:text-right']}>
				<div class="text-[11px] font-medium tracking-[0.08em] text-neutral-400 uppercase">Next</div>
				<div class="mt-1.5 text-sm font-semibold text-neutral-900 dark:text-neutral-50">{next.title}</div>
			</a>
		{/if}
	</nav>
{/if}
