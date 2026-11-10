<script lang="ts">
	import ApiPartSection from '#lib/components/api/ApiPartSection.svelte';
	import { docsLink } from '#lib/components/docs-link.js';
	import DocsSection from '#lib/components/DocsSection.svelte';
	import DocsShell from '#lib/components/DocsShell.svelte';
	import { apiParts, contextApi, documentViewTransition, imperativeApi } from '#lib/content/api.js';
	import { apiHref, docsPages } from '#lib/content/nav.js';

	const byConcern = [
		{ label: 'State', links: [['Root', apiHref.root], ['createHandle', apiHref.createHandle]] },
		{ label: 'Trigger / Item', links: [['Trigger', apiHref.trigger], ['Item', apiHref.item], ['Media', apiHref.media]] },
		{ label: 'Layout', links: [['Slides', apiHref.slides], ['Slide', apiHref.slide]] },
		{ label: 'View transitions', links: [['Root (VT props)', apiHref.root], ['Document (VT)', apiHref.documentVt]] },
		{ label: 'Shell', links: [['Portal', apiHref.portal], ['Backdrop', apiHref.backdrop], ['Content', apiHref.content]] },
		{
			label: 'Gestures',
			links: [['Content', apiHref.content], ['Zoom', apiHref.zoom], ['ZoomIn', apiHref.zoomIn], ['ZoomOut', apiHref.zoomOut]]
		},
		{
			label: 'Chrome',
			links: [
				['Close', apiHref.close],
				['Previous', apiHref.previous],
				['Next', apiHref.next],
				['Counter', apiHref.counter],
				['Caption', apiHref.caption],
				['ThumbnailGroup', apiHref.thumbnailGroup],
				['Thumbnail', apiHref.thumbnail],
				['ThumbnailStrip', apiHref.thumbnailStrip],
				['ThumbnailStripTrack', apiHref.thumbnailStripTrack]
			]
		}
	];
	const toc = [
		{ id: 'by-concern', title: 'By concern' },
		...apiParts.map((part) => ({ id: part.id, title: part.name })),
		{ id: documentViewTransition.id, title: 'Document (VT)' },
		{ id: 'types', title: 'Types' },
		{ id: 'context', title: 'Context', children: contextApi.map((part) => ({ id: part.id, title: part.name })) },
		{ id: 'imperative', title: 'Imperative handles', children: imperativeApi.map((part) => ({ id: part.id, title: part.name })) }
	];
	const code = 'text-xs';
</script>

<svelte:head>
	<title>Lightbox API reference · ramka for Svelte</title>
	<meta
		name="description"
		content="API reference for the ramka Svelte lightbox parts: Root, Trigger, Slides, Zoom, thumbnails, captions, counter, context getters, types, and imperative handles."
	/>
</svelte:head>

<DocsShell title="API reference" {toc}>
	{#snippet description()}
		Props, data attributes, and CSS variables for every <a href={docsPages.overview.href} class={docsLink}>Lightbox</a> part.
	{/snippet}

	<p class="text-sm leading-relaxed text-neutral-600 dark:text-neutral-400">
		Each part spreads native attributes onto its element (listed as <code class={code}>...rest</code>). Custom props are
		listed below. Guides: <a href={docsPages.composition.href} class={docsLink}>Composition</a>,
		<a href={docsPages.viewTransitions.href} class={docsLink}>View transitions</a>,
		<a href={docsPages.gestures.href} class={docsLink}>Gestures</a>.
	</p>

	<DocsSection id="by-concern" title="By concern">
		<ul class="space-y-3">
			{#each byConcern as group (group.label)}
				<li>
					<div class="text-xs font-semibold tracking-wider text-neutral-500 uppercase">{group.label}</div>
					<div class="mt-1 flex flex-wrap gap-x-3 gap-y-1 text-sm">
						{#each group.links as [title, href] (title)}
							<a {href} class={docsLink}>{title}</a>
						{/each}
					</div>
				</li>
			{/each}
		</ul>
	</DocsSection>

	{#each apiParts as part (part.id)}
		<ApiPartSection {part} />
	{/each}

	<ApiPartSection part={documentViewTransition} />

	<DocsSection id="types" title="Types">
		<p>
			Helper types you will see in callbacks and snippets, exported on the <code class={code}>Lightbox</code> namespace
			(<code class={code}>Lightbox.NavigationSource</code> and so on):
		</p>
		<ul class="list-disc space-y-2 pl-5">
			<li>
				<code class={code}>NavigationSource</code>:
				<code class={code}>'trigger' | 'keyboard' | 'thumbnail' | 'button' | 'scroll' | 'imperative'</code>. Second
				argument to Root <code class={code}>onValueChange</code>. Handle <code class={code}>open</code>/<code class={code}
					>goTo</code
				>
				use <code class={code}>'imperative'</code>; scroll-driven Slides use <code class={code}>'scroll'</code>.
			</li>
			<li>
				<code class={code}>Crossfade</code>: <code class={code}>'open' | 'close' | 'both'</code> for Trigger
				<code class={code}>crossfade</code>. See
				<a href="{docsPages.viewTransitions.href}#crossfade" class={docsLink}>View transitions: crossfade</a>.
			</li>
			<li>
				<code class={code}>MorphTo</code>: <code class={code}>'active' | 'origin' | 'closest'</code> for Root
				<code class={code}>morphTo</code>, and <code class={code}>MorphPreset</code>:
				<code class={code}>'default' | 'snappy' | 'relaxed' | 'spring'</code> for Root <code class={code}>viewTransition</code>.
			</li>
			<li>
				Snippet state types such as <code class={code}>TriggerContext</code> and <code class={code}>ItemContext</code>
				(<code class={code}>active</code>, <code class={code}>visible</code>, refs) are documented on
				<a href={apiHref.trigger} class={docsLink}>Trigger</a> / <a href={apiHref.item} class={docsLink}>Item</a>.
			</li>
		</ul>
	</DocsSection>

	<DocsSection id="context" title="Context">
		<p>
			Context getters for nested wrapper components, the Svelte form of the React hooks. Call them during component
			initialization inside the matching part.
		</p>
	</DocsSection>
	{#each contextApi as part (part.id)}
		<ApiPartSection {part} />
	{/each}

	<DocsSection id="imperative" title="Imperative handles">
		<p>
			Use <code class={code}>Lightbox.createHandle()</code> on Root (and optional detached Triggers). Zoom exposes its
			controls through <code class={code}>bind:this</code>.
		</p>
	</DocsSection>
	{#each imperativeApi as part (part.id)}
		<ApiPartSection {part} />
	{/each}
</DocsShell>
