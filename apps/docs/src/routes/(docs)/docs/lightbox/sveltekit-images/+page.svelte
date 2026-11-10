<script lang="ts">
	import DataTable, { td, tdLabel } from '#lib/components/DataTable.svelte';
	import { docsLink } from '#lib/components/docs-link.js';
	import DocsDemo from '#lib/components/DocsDemo.svelte';
	import DocsSection from '#lib/components/DocsSection.svelte';
	import DocsShell from '#lib/components/DocsShell.svelte';
	import { apiHref, docsPages } from '#lib/content/nav.js';
	import ImageDemo from '#lib/docs/images/ImageDemo.svelte';
	import NonImageTriggerDemo from '#lib/docs/images/NonImageTriggerDemo.svelte';
	import PlusNDemo from '#lib/docs/images/PlusNDemo.svelte';
	import snippets from '#lib/excerpts/images.txt?snippets';

	const toc = [
		{ id: 'rule', title: 'When to use a placeholder' },
		{ id: 'do', title: 'Do' },
		{ id: 'dont', title: 'Don’t' },
		{ id: 'no-trigger-image', title: 'No trigger image' },
		{ id: 'checklist', title: 'Checklist' }
	];
	const sourceAspect = `${docsPages.viewTransitions.href}#source-aspect`;
	const h3 = 'text-sm font-semibold text-neutral-900 dark:text-neutral-100';
</script>

<svelte:head>
	<title>SvelteKit images · ramka for Svelte</title>
	<meta
		name="description"
		content="Using blurred LQIP placeholders and SvelteKit image pipelines with the ramka Svelte lightbox: when the trigger image bridge covers loading, and when a placeholder should."
	/>
</svelte:head>

<DocsShell title="SvelteKit images" {toc}>
	{#snippet description()}
		Use blurred placeholders (LQIP) with ramka. Lightbox-side blur depends on whether that item has a trigger image.
		Part of <a href={docsPages.overview.href} class={docsLink}>Lightbox</a>.
	{/snippet}

	<div
		class="rounded-xl border border-neutral-200 bg-neutral-50 px-4 py-3 text-sm text-neutral-700 dark:border-neutral-800 dark:bg-neutral-900 dark:text-neutral-300"
	>
		The demos on this page delay every full-size lightbox image by about 500ms and bypass the browser cache on each
		open, so you can watch the placeholder mechanisms work on every open, with no DevTools throttling.
	</div>

	<DocsSection id="rule" title="When to use a placeholder">
		<p>
			SvelteKit has no built-in blur placeholder like <code class="text-xs">next/image</code>. The usual setup is a tiny
			image from your pipeline (<code class="text-xs">vite-imagetools</code>, <code class="text-xs">sharp</code> at build
			time, or your CDN) painted as the <code class="text-xs">background-image</code> of the
			<code class="text-xs">&lt;img&gt;</code> until the real pixels arrive. This page calls that the LQIP.
			<code class="text-xs">@sveltejs/enhanced-img</code> works too: its output is a plain
			<code class="text-xs">&lt;img&gt;</code>, so everything below applies.
		</p>
		<p>
			Decide <strong>per item index</strong>, not per gallery. ramka paints an open bridge only when that index has a
			registered trigger image (<code class="text-xs">imageRef</code>).
		</p>
		<DataTable columns={['Image', 'LQIP', 'Why']}>
			<tr>
				<td class={tdLabel}>Image inside <code class="text-xs">Lightbox.Trigger</code></td>
				<td class={td}>Yes</td>
				<td class={td}>A regular page image: the LQIP covers its own load. ramka never paints a placeholder here.</td>
			</tr>
			<tr>
				<td class={tdLabel}>Image inside <code class="text-xs">Lightbox.Thumbnail</code></td>
				<td class={td}>Yes</td>
				<td class={td}>
					Same as a trigger: a regular page image. ramka bridges only the destination media, never strip thumbnails, so
					the LQIP is the only thing covering the thumb’s own load.
				</td>
			</tr>
			<tr>
				<td class={tdLabel}>Lightbox image, index <em>has</em> a trigger image (<code class="text-xs">imageRef</code>)</td>
				<td class={td}>No</td>
				<td class={td}>
					While the full-size image loads, ramka paints the trigger’s image (already decoded and on screen) onto a
					canvas <em>behind</em> the lightbox image. An LQIP background sits on the lightbox image itself, in front of
					that canvas, so it hides a sharp placeholder behind a blurry one.
				</td>
			</tr>
			<tr>
				<td class={tdLabel}>Lightbox image, index has <em>no</em> trigger image</td>
				<td class={td}>Yes</td>
				<td class={td}>
					ramka has no trigger image to paint, so the LQIP is the only loading placeholder (see
					<a href="#no-trigger-image" class={docsLink}>No trigger image</a>).
				</td>
			</tr>
		</DataTable>
		<p>
			<strong>One exception:</strong> pages that server-render the lightbox already open (deep links). The bridge is
			painted on gesture opens. A server-rendered open has no gesture, and before hydration nothing is decoded to paint
			from, while an LQIP is part of the server HTML itself. For those visits, destination blur is the only placeholder
			that can exist on first paint: enable it for the deep-link visit and keep destinations clean for regular visits
			(decide once per mount).
		</p>
	</DocsSection>

	<DocsSection id="do" title="Do">
		<p>
			Use the same asset for trigger and destination. Put the LQIP on the trigger; leave the destination clean. A square
			trigger crop is CSS only: keep the source aspect matched to Media. See
			<a href={sourceAspect} class={docsLink}>View transitions: Source aspect</a> for a live Do / Don’t.
		</p>
		<DocsDemo code={snippets.do} title="Gallery.svelte"><ImageDemo kind="do" /></DocsDemo>
	</DocsSection>

	<DocsSection id="dont" title="Don’t">
		<p>
			An LQIP on a lightbox image whose index has a trigger image covers ramka’s bridge with a blur while the full image
			loads.
		</p>
		<DocsDemo code={snippets.dont} title="Gallery.svelte"><ImageDemo kind="dont" /></DocsDemo>
	</DocsSection>

	<DocsSection id="no-trigger-image" title="No trigger image">
		<p>
			If an index has no trigger <code class="text-xs">imageRef</code>, ramka has nothing to paint. Use a destination LQIP
			for those items only, not for siblings that still have a trigger image.
		</p>
		<h3 class="mt-8 {h3}">+N extras</h3>
		<p>
			Open the +N tile, then swipe past the triggered photos. Overflow slides show the LQIP; indexes 0 and 1 stay on
			ramka’s trigger-image bridge. Close uses
			<a href="{docsPages.viewTransitions.href}#morph-to" class={docsLink}>morphTo="closest"</a>.
		</p>
		<DocsDemo code={snippets.plusN} title="Album.svelte"><PlusNDemo /></DocsDemo>
		<h3 class="mt-10 {h3}">Non-image trigger</h3>
		<p>Initials and swatches have a Trigger but no trigger image. Blur on the lightbox image is the loading placeholder.</p>
		<DocsDemo code={snippets.nonImage} title="Team.svelte"><NonImageTriggerDemo /></DocsDemo>
	</DocsSection>

	<DocsSection id="checklist" title="Checklist">
		<ul class="list-disc space-y-2 pl-5">
			<li>Per index: trigger image means no destination LQIP; no trigger image means a destination LQIP is fine</li>
			<li>
				Match Media <code class="text-xs">width</code>/<code class="text-xs">height</code> to the image source aspect
			</li>
			<li>
				Trigger and destination must share that intrinsic aspect (CSS-crop the tile; don’t serve a differently cropped
				file). See <a href={sourceAspect} class={docsLink}>Source aspect</a>
			</li>
			<li>
				Trigger: <code class="text-xs">imageRef</code> (or
				<a href={apiHref.context} class={docsLink}>getTrigger()</a>); an LQIP on the trigger image is fine
			</li>
			<li><code class="text-xs">ThumbnailStrip</code> thumbs are regular images: an LQIP is fine, same as triggers</li>
			<li>
				Prefer <code class="text-xs">fetchpriority="high"</code> on the open destination. See
				<a href={docsPages.viewTransitions.href} class={docsLink}>View transitions</a>
			</li>
			<li><code class="text-xs">sizes="100vw"</code> for fullscreen</li>
			<li>Skip <code class="text-xs">size-full</code> on the image: Media already fills a direct img child</li>
		</ul>
	</DocsSection>
</DocsShell>
