<script lang="ts">
	import ArrowLeft from '@lucide/svelte/icons/arrow-left';
	import ArrowRight from '@lucide/svelte/icons/arrow-right';
	import CodeBlock from '#lib/components/CodeBlock.svelte';
	import { docsLink } from '#lib/components/docs-link.js';
	import DocsSection from '#lib/components/DocsSection.svelte';
	import DocsShell from '#lib/components/DocsShell.svelte';
	import Kbd from '#lib/components/Kbd.svelte';
	import { apiHref, docsPages } from '#lib/content/nav.js';
	import chrome from '#lib/excerpts/ChromeComposition.svelte?highlight';
	import fitBox from '#lib/excerpts/MediaFitBox.svelte?highlight';
	import nesting from '#lib/excerpts/SlidesNesting.svelte?highlight';
	import snippets from '#lib/excerpts/composition.txt?snippets';
	import track from '#lib/excerpts/slide-track.css?highlight';

	const toc = [
		{ id: 'slides', title: 'Slides + Zoom' },
		{ id: 'media-layout', title: 'Media layout' },
		{ id: 'stage', title: 'Stage (split layouts)' },
		{ id: 'chrome', title: 'Chrome' },
		{ id: 'item-count', title: 'Dynamic item count' }
	];
</script>

<svelte:head>
	<title>Composition · ramka for Svelte</title>
	<meta
		name="description"
		content="Compose ramka lightbox primitives into any Svelte layout: Slides with Zoom, media fill and fit-box sizing, Stage for split layouts, custom chrome, and dynamic item counts."
	/>
</svelte:head>

<DocsShell title="Composition" {toc}>
	{#snippet description()}
		Default to Slides + Zoom (swipe carousel with pinch zoom), size media to fill Content, then layer chrome. Part of
		<a href={docsPages.overview.href} class={docsLink}>Lightbox</a>.
	{/snippet}

	<DocsSection id="slides" title="Slides + Zoom">
		<p>
			Prefer <a href={apiHref.slides} class={docsLink}>Slides</a> + <a href={apiHref.slide} class={docsLink}>Slide</a>
			for a swipeable snap carousel wired to the active index. Nearly every docs demo and example uses this layout. Slide
			boxes stay mounted; <code class="text-xs">preload</code> gates heavy Item content.
		</p>
		<ul class="list-disc space-y-2 pl-5">
			<li>
				Nesting rule: put <code class="text-xs">Item</code> and <a href={apiHref.zoom} class={docsLink}>Zoom</a>
				<em>inside</em> each <code class="text-xs">Slide</code>. Pull transforms the item, not the snap box.
			</li>
			<li>
				User flings set an internal scroll lock so pull-to-dismiss, zoom chrome, and discrete prev/next do not fight the
				carousel mid-gesture.
			</li>
			<li>
				Scroll-driven index changes report <code class="text-xs">onValueChange</code> with
				<code class="text-xs">source: 'scroll'</code>, see <a href={apiHref.types} class={docsLink}>NavigationSource</a>.
			</li>
			<li>
				The Item snippet’s <code class="text-xs">active</code> is the current index (drive expensive work here).
				<code class="text-xs">visible</code> means the item is in the preload window: use it for lightweight prefetch, not
				video autoplay.
			</li>
		</ul>
		<CodeBlock code={nesting} title="Gallery.svelte" />
		<CodeBlock code={track} title="Slide track (full-bleed carousel)" />
	</DocsSection>

	<DocsSection id="media-layout" title="Media layout">
		<p>
			ramka is <em>cosmetically</em> unstyled (colors and chrome are yours), but Media may apply <em>structural</em>
			fit-box styles through <code class="text-xs">width</code>/<code class="text-xs">height</code> so the morph target
			has a correct aspect before pixels load. Slide width is your CSS too:
			<a href={apiHref.slide} class={docsLink}>Slide</a> only bakes in snap alignment
			(<code class="text-xs">scroll-snap-align: center</code>, <code class="text-xs">scroll-snap-stop: always</code>); you
			size each snap box. For a full-bleed carousel, use <code class="text-xs">flex: 0 0 100%</code> and
			<code class="text-xs">min-width: 100%</code> on each slide (see the snippet above). Snug, variable-width tracks use
			a different width formula, see the <a href="/presets/default" class={docsLink}>Default preset</a>. Item and Zoom
			fill the slide content box; size the stack so when Zoom scales past 1× the image can cover the viewport and is not
			clipped by a shorter ancestor.
		</p>
		<ul class="list-disc space-y-2 pl-5">
			<li><code class="text-xs">Content</code>: fullscreen surface (<code class="text-xs">fixed inset-0</code> or a full dialog)</li>
			<li><code class="text-xs">Slides</code>: <code class="text-xs">flex-1</code> (or an equivalent stretch)</li>
			<li>
				<code class="text-xs">Slide</code>: <code class="text-xs">flex: 0 0 100%; min-width: 100%</code> for a full-bleed
				track; <code class="text-xs">h-full</code> for height; put chrome and safe-area insets here as padding (not on Zoom)
			</li>
			<li><code class="text-xs">Item</code>: already fills the Slide (<code class="text-xs">width/height: 100%</code>)</li>
			<li><code class="text-xs">Zoom</code>: already fills and centers (structural)</li>
			<li>
				<code class="text-xs">Media</code>: sized fit-box (morph and placeholder host);
				<code class="text-xs">&lt;img&gt;</code> or <code class="text-xs">&lt;video&gt;</code> inside
			</li>
		</ul>
		<p>
			Keep Close, Counter, Caption, and thumbnails as <em>absolutely positioned siblings</em> of Slides (see Chrome below),
			not in-flow above or below Zoom. Resting insets belong on Slide padding and safe-area so zoomed media can still
			paint into that padding under chrome. Gesture details live in
			<a href={docsPages.gestures.href} class={docsLink}>Gestures</a>.
		</p>
		<p>
			Set HTML <code class="text-xs">width</code> and <code class="text-xs">height</code> on the destination
			<code class="text-xs">&lt;img&gt;</code> (from known pixel dimensions or CMS metadata) so the box and aspect ratio
			exist <em>before</em> pixels load. That avoids layout shift, keeps the morph target sized on slow networks, and
			prevents an unloaded image from collapsing to 0×0 (which can skip or weaken the open morph). When dimensions are
			unknown, see <a href="/examples/lightbox/url-synced-state" class={docsLink}>URL-synced state</a>. For mixed media
			(photos plus WebGL) with <a href={apiHref.root} class={docsLink}>onBeforeOpen</a> preheat, see
			<a href="/examples/lightbox/3d-models" class={docsLink}>3D models</a>.
		</p>
		<p>
			To fill the maximum available space without distorting the source aspect ratio, nest Media under
			<a href={apiHref.zoom} class={docsLink}>Lightbox.Zoom</a> (a size container for <code class="text-xs">cqw</code>/<code
				class="text-xs">cqh</code
			>) and pass <code class="text-xs">width</code>/<code class="text-xs">height</code> to
			<a href={apiHref.media} class={docsLink}>Lightbox.Media</a>. Media applies the inscribed fit-box
			(<code class="text-xs">min(100cqw, 100cqh × w/h)</code> + <code class="text-xs">aspect-ratio: w / h</code>). Or put
			HTML <code class="text-xs">width</code>/<code class="text-xs">height</code> on the child image and omit the Media
			props: Media derives the box. When the box matches the source aspect, child
			<code class="text-xs">object-fit</code> is a no-op and Media’s grid stretch fills the box. Put border-radius on Media
			(the morph target). Leave chrome outside Media.
		</p>
		<CodeBlock code={fitBox} title="Viewer.svelte" />
		<p>
			Live compositions: <a href="/presets/default" class={docsLink}>Default preset</a>,
			<a href="/presets/twitter" class={docsLink}>Twitter preset</a>,
			<a href="/presets/stories" class={docsLink}>Stories preset</a>,
			<a href="/examples/lightbox/photos-app" class={docsLink}>Photos app</a>.
		</p>
	</DocsSection>

	<DocsSection id="stage" title="Stage (split layouts)">
		<p>
			Use <a href={apiHref.stage} class={docsLink}>Lightbox.Stage</a> when Content holds more than the media pane, for
			example a thread sidebar beside the gallery. Stage is the media interaction surface: trackpad wheel
			pull-to-dismiss, Zoom pan cover geometry, and
			<Kbd label="Left arrow"><ArrowLeft /></Kbd>
			<Kbd label="Right arrow"><ArrowRight /></Kbd> / <Kbd>Home</Kbd> / <Kbd>End</Kbd> gallery navigation are scoped to
			it. Content remains the dialog shell (focus trap, <Kbd>Esc</Kbd>, zoom shortcuts). Place side panels as siblings of
			Stage under Content so they keep native scroll and their own keyboard behavior. Without a Stage, Content itself is
			the stage (default full-bleed viewers need no change).
		</p>
		<CodeBlock code={snippets.stage} title="Stage + side panel" />
		<p>
			Attach Stage’s <code class="text-xs">morphRef</code> when the open and close morph should capture the Stage
			surface (or a descendant) instead of the active item: a 9:16 stories frame, the slides track, or a custom bezel.
			Decode and the thumbnail placeholder stay on the item. In Svelte, <code class="text-xs">morphRef</code> is an
			attachment: <code class="text-xs">{'{@attach morphRef}'}</code>.
		</p>
		<CodeBlock code={snippets.stageMorph} title="Stage morphRef" />
		<p>
			Live examples: <a href="/presets/twitter" class={docsLink}>Twitter preset</a>,
			<a href="/presets/stories" class={docsLink}>Stories preset</a>.
		</p>
	</DocsSection>

	<DocsSection id="chrome" title="Chrome">
		<p>
			The site default viewer is Slides + Zoom with Counter, Close, ZoomIn and ZoomOut, Caption, and a desktop
			<a href={apiHref.thumbnailStrip} class={docsLink}>ThumbnailStrip</a> (scroll-linked midline track) as siblings
			inside <a href={apiHref.content} class={docsLink}>Content</a>. Midline selection chrome goes in the strip’s
			<code class="text-xs">indicator</code> snippet. Thumbnails register by <code class="text-xs">index</code> like
			Triggers. Put Backdrop and Content in <a href={apiHref.portal} class={docsLink}>Portal</a>. Stacking follows the
			usual dialog pattern: <code class="text-xs">isolation: isolate</code> on the app layout root and, with
			<code class="text-xs">keepMounted</code>, your own <code class="text-xs">z-index</code> on the Portal host (for
			example <code class="text-xs">class="relative z-[1]"</code>). Inside the portal, document order keeps Backdrop under
			Content.
		</p>
		<p>
			Thumbnails go inside a <a href={apiHref.thumbnailStripTrack} class={docsLink}>ThumbnailStripTrack</a>, the
			<code class="text-xs">role="tablist"</code> that the strip moves. Label the track, not the strip.
		</p>
		<CodeBlock code={chrome} title="Gallery.svelte" />
		<p>Packaged as a skin: <a href="/presets/default" class={docsLink}>Default preset</a>.</p>
	</DocsSection>

	<DocsSection id="item-count" title="Dynamic item count">
		<p>
			Items register on mount, and the item count comes from the registered items. Indices do not need to be
			contiguous, but Counter, loop edges, and preload distance all use that count. Prefer dense
			<code class="text-xs">0…n-1</code> indexes unless you leave holes on purpose. Before the viewer has mounted (for a
			counter outside it, say), Root’s <code class="text-xs">count</code> prop stands in.
		</p>
	</DocsSection>
</DocsShell>
