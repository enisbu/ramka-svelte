<script lang="ts">
	import ChevronDown from '@lucide/svelte/icons/chevron-down';
	import type { ApiPart } from '#lib/content/api.js';
	import DocsSection from '../DocsSection.svelte';
	import Description from './Description.svelte';
	import TypeCode from './TypeCode.svelte';
	import { shortType } from './type-tokens.js';

	let { part }: { part: ApiPart } = $props();

	const shell = 'overflow-x-auto rounded-xl border border-neutral-200 dark:border-neutral-800';
	const header =
		'border-b border-neutral-200 bg-neutral-50 py-2.5 text-xs font-medium text-neutral-500 dark:border-neutral-800 dark:bg-neutral-900/80 dark:text-neutral-400';
	const row = 'grid min-w-[36rem] items-start gap-x-4 px-4';
	const propsGrid = `${row} grid-cols-[13rem_minmax(0,1.25fr)_8rem_1.5rem]`;
	const attrsGrid = `${row} grid-cols-[13rem_minmax(0,1fr)]`;
	const varsGrid = `${row} grid-cols-[13rem_8rem_minmax(0,1fr)]`;
	const name =
		'min-w-0 font-mono text-[13px] font-medium break-all text-neutral-900 dark:text-neutral-50';
	const body = 'min-w-0 text-[13px] leading-6 text-neutral-700 dark:text-neutral-200';
	const heading = 'text-xs font-semibold tracking-wider text-neutral-500 uppercase';
	const detail = 'grid grid-cols-[6rem_minmax(0,1fr)] items-start gap-x-4 px-4';
	const label = 'text-[13px] leading-6 text-neutral-500 dark:text-neutral-400';
	const anchor = (prop: string) => `${part.id}-${prop.replace(/^\.+/, '')}`;
</script>

<DocsSection id={part.id} title={part.name} level={3}>
	<p><Description text={part.description} /></p>

	{#if part.props?.length}
		<div class="space-y-2">
			<h4 class={heading}>Props</h4>
			<div class={shell}>
				<div class="{propsGrid} {header}" aria-hidden="true">
					<div>Prop</div>
					<div>Type</div>
					<div>Default</div>
				</div>
				{#each part.props as prop (prop.name)}
					<details
						class="group border-b border-neutral-200 last:border-b-0 dark:border-neutral-800"
					>
						<summary
							id={anchor(prop.name)}
							class="{propsGrid} cursor-pointer list-none items-center py-3 transition-colors outline-none hover:bg-neutral-50 focus-visible:bg-neutral-50 focus-visible:ring-2 focus-visible:ring-neutral-400/40 focus-visible:ring-inset dark:hover:bg-neutral-900/60 dark:focus-visible:bg-neutral-900/60 [&::-webkit-details-marker]:hidden"
						>
							<span class="truncate {name}">
								{prop.name}{#if prop.required}<span
										class="ml-0.5 font-normal text-red-500"
										title="Required">*</span
									>{/if}
							</span>
							<span class="min-w-0 truncate"><TypeCode code={shortType(prop.type)} /></span>
							<span class="min-w-0 truncate">
								{#if prop.default == null}<span class="text-neutral-400">n/a</span>{:else}<TypeCode
										code={prop.default}
									/>{/if}
							</span>
							<ChevronDown
								aria-hidden="true"
								class="size-4 justify-self-end text-neutral-400 transition-transform duration-200 group-open:rotate-180"
							/>
						</summary>
						<dl
							class="min-w-[36rem] space-y-3.5 border-t border-neutral-200 bg-neutral-50 pt-4 pb-5 dark:border-neutral-800 dark:bg-neutral-900/80"
						>
							<div class={detail}>
								<dt class={label}>Name</dt>
								<dd>
									<a
										href="#{anchor(prop.name)}"
										class="font-mono text-[13px] font-medium text-blue-600 underline decoration-blue-600/40 underline-offset-[3px] hover:decoration-blue-600 dark:text-blue-400 dark:decoration-blue-400/40 dark:hover:decoration-blue-400"
										>{prop.name}</a
									>
								</dd>
							</div>
							<div class={detail}>
								<dt class={label}>Description</dt>
								<dd class={body}><Description text={prop.description} /></dd>
							</div>
							<div class={detail}>
								<dt class={label}>Type</dt>
								<dd>
									<div
										class="inline-block max-w-full overflow-x-auto rounded-md border border-neutral-200 bg-white px-2.5 py-1.5 dark:border-neutral-700 dark:bg-neutral-900"
									>
										<TypeCode code={prop.type} class="break-words whitespace-pre-wrap" />
									</div>
								</dd>
							</div>
							{#if prop.default != null}
								<div class={detail}>
									<dt class={label}>Default</dt>
									<dd><TypeCode code={prop.default} /></dd>
								</div>
							{/if}
						</dl>
					</details>
				{/each}
			</div>
		</div>
	{/if}

	{#if part.attributes?.length}
		<div class="space-y-2">
			<h4 class={heading}>Data attributes</h4>
			<div class={shell} role="table" aria-label="Data attributes">
				<div role="row" class="{attrsGrid} {header}">
					<div role="columnheader">Attribute</div>
					<div role="columnheader">Description</div>
				</div>
				{#each part.attributes as attr (attr.name)}
					<div
						role="row"
						class="{attrsGrid} border-b border-neutral-200 py-3 last:border-b-0 dark:border-neutral-800"
					>
						<div role="cell" class={name}><code>{attr.name}</code></div>
						<div role="cell" class={body}><Description text={attr.description} /></div>
					</div>
				{/each}
			</div>
		</div>
	{/if}

	{#if part.cssVariables?.length}
		<div class="space-y-2">
			<h4 class={heading}>CSS variables</h4>
			<div class={shell} role="table" aria-label="CSS variables">
				<div role="row" class="{varsGrid} {header}">
					<div role="columnheader">Variable</div>
					<div role="columnheader">Type</div>
					<div role="columnheader">Description</div>
				</div>
				{#each part.cssVariables as cssVar (cssVar.name)}
					<div
						role="row"
						class="{varsGrid} border-b border-neutral-200 py-3 last:border-b-0 dark:border-neutral-800"
					>
						<div role="cell" class={name}><code>{cssVar.name}</code></div>
						<div role="cell" class="min-w-0">
							{#if cssVar.type}<TypeCode code={cssVar.type} />{/if}
						</div>
						<div role="cell" class={body}><Description text={cssVar.description} /></div>
					</div>
				{/each}
			</div>
		</div>
	{/if}
</DocsSection>
