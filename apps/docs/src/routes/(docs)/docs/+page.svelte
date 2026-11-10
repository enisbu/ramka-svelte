<script lang="ts">
	import CodeBlock from '#lib/components/CodeBlock.svelte';
	import { docsLink } from '#lib/components/docs-link.js';
	import { docsPages } from '#lib/content/nav.js';
	import { upstream } from '#lib/content/site.js';
	import quickStart from '#lib/excerpts/QuickStart.svelte?highlight';
	import snippets from './install.txt?snippets';

	const h2 = 'text-2xl font-semibold tracking-tight text-neutral-900 dark:text-neutral-50';
	const body = 'text-[15px] leading-7 text-neutral-600 dark:text-neutral-400';
</script>

<svelte:head>
	<title>Installation · ramka for Svelte</title>
	<meta
		name="description"
		content="Install the ramka Svelte lightbox with npm, pnpm, or yarn, and open your first morphing image gallery in a few lines of code."
	/>
</svelte:head>

<div class="mx-auto w-full max-w-3xl px-6 py-14 md:px-10 md:py-16">
	<p class="text-xs font-semibold tracking-[0.1em] text-neutral-400 uppercase dark:text-neutral-600">Getting started</p>
	<h1 class="mt-3 text-5xl font-semibold tracking-tight text-neutral-900 dark:text-neutral-50">ramka</h1>
	<p class="mt-5 max-w-2xl text-[17px] leading-7 text-pretty text-neutral-500 dark:text-neutral-400">
		Unstyled, accessible lightbox primitives for Svelte 5, in the style of Bits UI. Compose your own lightbox UI on
		headless parts with view-transition morph by default, swipe slides, zoom, and pull-to-dismiss.
	</p>

	<section class="mt-14 space-y-4">
		<h2 class={h2}>Installation</h2>
		<CodeBlock code={snippets.install} />
		<p class={body}>
			Peer dependency: <code class="text-xs">svelte</code> &gt;= 5.40. Works in SvelteKit and plain Vite apps.
		</p>
	</section>

	<section class="mt-14 space-y-4">
		<h2 class={h2}>Quick start</h2>
		<CodeBlock code={quickStart} title="Gallery.svelte" />
		<p class={body}>
			The trigger is a plain <code class="text-xs">&lt;button&gt;</code>; its first <code class="text-xs">img</code> is
			the morph source. Every string in the viewer is yours: the library ships none, so nothing it renders is ever in the
			wrong language.
		</p>
	</section>

	<section class="mt-14 space-y-4">
		<h2 class={h2}>Licensing</h2>
		<p class={body}>
			ramka is free software under the <a href="/license" class={docsLink}>MIT License</a>, for open-source and
			proprietary use.
		</p>
	</section>

	<section class="mt-14 space-y-4">
		<h2 class={h2}>Coming from React?</h2>
		<p class={body}>
			This is a Svelte 5 port of <a href={upstream.site} class={docsLink} target="_blank" rel="noreferrer">ramka</a> by
			<a href={upstream.authorUrl} class={docsLink} target="_blank" rel="noreferrer">{upstream.author}</a>. The parts and
			their names match <a href={upstream.npm} class={docsLink} target="_blank" rel="noreferrer">@ramka/react</a>
			one to one. What changes:
		</p>
		<ul class="list-disc space-y-2 pl-5 {body}">
			<li>
				No <code class="text-xs">render</code> prop. Render props become snippets, and refs such as
				<code class="text-xs">imageRef</code> and <code class="text-xs">morphRef</code> become attachments
				(<code class="text-xs">&#123;@attach imageRef&#125;</code>).
			</li>
			<li>
				<code class="text-xs">bind:open</code> and <code class="text-xs">bind:index</code> replace
				<code class="text-xs">open</code>/<code class="text-xs">defaultOpen</code> and
				<code class="text-xs">value</code>/<code class="text-xs">defaultValue</code>.
			</li>
			<li>
				Counter’s snippet gets <code class="text-xs">&#123; current, total &#125;</code>. The caption type is exported
				as <code class="text-xs">CaptionContent</code>.
			</li>
			<li>
				Zoom takes <code class="text-xs">minZoom</code>, <code class="text-xs">maxZoom</code>,
				<code class="text-xs">zoomStep</code>, <code class="text-xs">scrollToZoom</code>,
				<code class="text-xs">wheelSensitivity</code>, <code class="text-xs">keyboardPanDistance</code>,
				<code class="text-xs">doubleClickDelay</code> and <code class="text-xs">onZoomChange</code>;
				<code class="text-xs">bind:this</code> exposes <code class="text-xs">zoomIn</code>,
				<code class="text-xs">zoomOut</code>, <code class="text-xs">zoomTo</code> and <code class="text-xs">reset</code>.
			</li>
			<li>ThumbnailStrip needs a ThumbnailStripTrack child around the thumbnails.</li>
			<li>
				React hooks become context getters: <code class="text-xs">getLightbox</code>,
				<code class="text-xs">getTrigger</code>, <code class="text-xs">getItem</code>, <code class="text-xs">getStage</code>.
			</li>
			<li>The morph and pull engines ship in one bundle instead of loading lazily.</li>
		</ul>
	</section>

	<section class="mt-14 rounded-2xl border border-neutral-200 p-6 dark:border-neutral-800">
		<h2 class="text-base font-semibold text-neutral-900 dark:text-neutral-50">Next steps</h2>
		<ul class="mt-3 space-y-2.5 {body}">
			<li>
				<a href={docsPages.overview.href} class={docsLink}>Lightbox overview</a>: guidelines and anatomy, then
				<a href={docsPages.composition.href} class={docsLink}>Composition</a>.
			</li>
			<li>
				<a href="/examples/lightbox/photos-app" class={docsLink}>Examples</a>: live product demos and API pattern pages.
			</li>
		</ul>
	</section>
</div>
