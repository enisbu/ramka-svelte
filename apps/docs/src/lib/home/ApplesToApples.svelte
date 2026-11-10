<script lang="ts">
	import Check from '@lucide/svelte/icons/check';

	const rows: [string, true | string, string, string][] = [
		['Morph transitions', true, 'FLIP, take 3', 'fade()'],
		['Native scrolling', true, 'translateX', 'arrows'],
		['Pinch, pan, flick', true, 'sprint 14', 'mouse only'],
		['Pull to dismiss', true, 'in the backlog', 'Esc'],
		['Keyboard, a11y', true, 'TODO', 'nope'],
		['Respects reduced motion', true, 'oops', 'always has'],
		['Your design, not a theme', true, 'to be fair, yes', 'skin.css']
	];
	const head = 'px-1 pb-3 text-center align-bottom md:px-2';
	const cell = 'px-1 py-3.5 text-center text-[13px] md:px-2 md:text-sm';
</script>

{#snippet value(v: true | string)}
	{#if v === true}
		<Check
			aria-label="Yes"
			class="mx-auto h-4 w-4 text-neutral-900 dark:text-neutral-50"
			strokeWidth={2.5}
		/>
	{:else}
		<span class="text-neutral-400 dark:text-neutral-500">{v}</span>
	{/if}
{/snippet}

<section class="mx-auto w-full max-w-3xl px-6 pb-24">
	<h2
		class="text-center text-3xl font-semibold tracking-tight text-balance text-neutral-950 md:text-4xl dark:text-neutral-50"
	>
		How it compares.
	</h2>
	<p class="mx-auto mt-4 max-w-md text-center text-pretty text-neutral-500 dark:text-neutral-400">
		Nobody chooses a lightbox. You inherit one from 2013, or you decide to build your own. Here is
		how that goes.
	</p>
	<table class="mt-12 w-full border-collapse text-sm">
		<thead>
			<tr class="border-b border-neutral-200 dark:border-neutral-800">
				<th class="w-[34%]" aria-hidden="true"></th>
				<th
					scope="col"
					class="{head} font-semibold tracking-tight text-neutral-950 dark:text-neutral-50"
					>ramka</th
				>
				<th scope="col" class="{head} font-normal text-neutral-400 dark:text-neutral-500"
					>the one you&rsquo;d build</th
				>
				<th scope="col" class="{head} font-normal text-neutral-400 dark:text-neutral-500"
					>that 2013 plugin</th
				>
			</tr>
		</thead>
		<tbody class="divide-y divide-neutral-100 dark:divide-neutral-900">
			{#each rows as [feature, ramka, diy, plugin] (feature)}
				<tr>
					<th
						scope="row"
						class="py-3.5 pr-3 text-left text-[13px] font-normal text-neutral-600 md:pr-4 md:text-sm dark:text-neutral-300"
					>
						{feature}
					</th>
					<td class={cell}>{@render value(ramka)}</td>
					<td class={cell}>{@render value(diy)}</td>
					<td class={cell}>{@render value(plugin)}</td>
				</tr>
			{/each}
		</tbody>
	</table>
</section>
