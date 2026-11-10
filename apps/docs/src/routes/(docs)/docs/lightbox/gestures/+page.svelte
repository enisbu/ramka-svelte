<script lang="ts">
	import ArrowDown from '@lucide/svelte/icons/arrow-down';
	import ArrowLeft from '@lucide/svelte/icons/arrow-left';
	import ArrowRight from '@lucide/svelte/icons/arrow-right';
	import ArrowUp from '@lucide/svelte/icons/arrow-up';
	import Command from '@lucide/svelte/icons/command';
	import Minus from '@lucide/svelte/icons/minus';
	import Plus from '@lucide/svelte/icons/plus';
	import CodeBlock from '#lib/components/CodeBlock.svelte';
	import DataTable from '#lib/components/DataTable.svelte';
	import { docsLink } from '#lib/components/docs-link.js';
	import DocsSection from '#lib/components/DocsSection.svelte';
	import DocsShell from '#lib/components/DocsShell.svelte';
	import Kbd from '#lib/components/Kbd.svelte';
	import PropSectionTitle from '#lib/components/PropSectionTitle.svelte';
	import { apiHref, docsPages } from '#lib/content/nav.js';
	import zoomBridge from '#lib/excerpts/ZoomBridge.svelte?highlight';
	import openClose from '#lib/excerpts/open-close.css?highlight';
	import pullProgress from '#lib/excerpts/pull-progress.css?highlight';

	const toc = [
		{ id: 'pull', title: 'Pull-to-dismiss' },
		{ id: 'zoom', title: 'Zoom' },
		{ id: 'keyboard', title: 'Keyboard & focus' },
		{ id: 'matrix', title: 'Interaction matrix' }
	];
	const matrix = [
		['Idle, zoom = 1', 'Allowed', 'Allowed', 'Allowed'],
		['Zoomed > 1', 'Blocked', 'Allowed', 'Arrows pan; buttons still navigate'],
		['Slides flinging', 'Blocked', 'Blocked', 'Blocked until settle'],
		['Pulling', 'Active', 'Should idle', 'Should idle']
	];
</script>

<svelte:head>
	<title>Gestures and pull to dismiss · ramka for Svelte</title>
	<meta
		name="description"
		content="Swipe navigation and pull to dismiss in the ramka Svelte lightbox: native scroll snapping, pull progress CSS variables, snap-back timing, and open and close fades."
	/>
</svelte:head>

<DocsShell title="Gestures" {toc}>
	{#snippet description()}
		Pull-to-dismiss, zoom and pan, and keyboard ownership. Part of
		<a href={docsPages.overview.href} class={docsLink}>Lightbox</a>. For the usual gallery chrome
		(pull, zoom, keyboard) see the <a href="/presets/default" class={docsLink}>Default preset</a>.
	{/snippet}

	<DocsSection id="pull">
		{#snippet title()}
			<PropSectionTitle
				partHref={apiHref.content}
				part="Content"
				prop="pullToClose"
				sectionId="pull"
			/>
		{/snippet}
		<p>
			Content enables pull-to-dismiss by default (<code class="text-xs">pullToClose</code>). Drag
			down (touch) or wheel-dismiss (trackpad) scales the surface and sets
			<code class="text-xs">data-pulling</code>
			/
			<code class="text-xs">data-pull-dismissing</code> plus
			<code class="text-xs">--lightbox-pull-progress</code> (0→1).
		</p>
		<ul class="list-disc space-y-2 pl-5">
			<li>
				The hit target is Stage-wide (or Content when Stage is omitted): letterbox and empty Stage
				area can start a pull, matching the trackpad wheel. Interactive controls (buttons, links,
				inputs,
				<code class="text-xs">[data-ramka-no-pull]</code>) keep their press. Side panels outside
				Stage do not start a pull.
			</li>
			<li>
				Disabled while zoomed above 1×, and while Slides is scrolling until <code class="text-xs"
					>scrollend</code
				> (so a gallery swipe that turns vertical cannot pull mid-gesture).
			</li>
			<li>
				Backdrop is optional. When used, nest it inside <a href={apiHref.portal} class={docsLink}
					>Portal</a
				> beside Content. Pull still works without a Backdrop.
			</li>
		</ul>
		<p>
			Open and close fades are plain CSS on your Backdrop and Content classes, keyed to
			<code class="text-xs">data-open</code> and <code class="text-xs">@starting-style</code>. Pull
			then modulates the open scrim (media stays opaque) through
			<code class="text-xs">--lightbox-pull-progress</code>.
		</p>
		<p>
			When a pull is released short of the threshold, the surface springs back and the library
			publishes
			<code class="text-xs">--lightbox-pull-snap-duration</code> /
			<code class="text-xs">--lightbox-pull-snap-easing</code>
			for the duration of that spring. Reference them in your
			<code class="text-xs">transition</code>
			(with your open and close values as the fallbacks, as below) and anything keyed to
			<code class="text-xs">--lightbox-pull-progress</code>
			(backdrop opacity, chrome, blur) eases back on the same curve and duration as the item.
		</p>
		<CodeBlock code={openClose} title="Open / close CSS" />
		<CodeBlock code={pullProgress} title="Pull progress CSS" />
	</DocsSection>

	<DocsSection id="zoom" title="Zoom">
		<p>
			Wrap media in <a href={apiHref.zoom} class={docsLink}>Zoom</a> (inside Item, typically inside
			Slide). Prefer
			<a href={apiHref.media} class={docsLink}>Media</a> inside Zoom so pan and
			<code class="text-xs">maxZoom</code>
			use the sized content box. Supports pinch, pan, double-tap, ctrl/meta+wheel (or
			<code class="text-xs">scrollToZoom</code>), and keyboard pan when focused.
		</p>
		<p>
			Zoomed media can cover the full Content surface only if Slide → Item → Zoom → Media fill that
			box, see
			<a href="{docsPages.composition.href}#media-layout" class={docsLink}
				>Composition: Media layout</a
			>.
		</p>
		<p>
			<a href={apiHref.zoomIn} class={docsLink}>ZoomIn</a> /
			<a href={apiHref.zoomOut} class={docsLink}>ZoomOut</a>
			can sit in toolbar chrome outside Zoom: they target the <em>active</em> slide through Root’s
			active-zoom bridge. Content reflects <code class="text-xs">data-zooming</code> /
			<code class="text-xs">data-zoomed</code> for styling.
		</p>
		<CodeBlock code={zoomBridge} title="Viewer.svelte" />
	</DocsSection>

	<DocsSection id="keyboard" title="Keyboard & focus">
		<p>
			<a href={apiHref.content} class={docsLink}>Content</a> is the keyboard authority while open:
		</p>
		<ul class="list-disc space-y-2 pl-5">
			<li><Kbd>Esc</Kbd>: close</li>
			<li>
				<Kbd label="Left arrow"><ArrowLeft /></Kbd>
				<Kbd label="Right arrow"><ArrowRight /></Kbd>
				<Kbd label="Up arrow"><ArrowUp /></Kbd>
				<Kbd label="Down arrow"><ArrowDown /></Kbd>: pan when zoomed, otherwise previous and next
			</li>
			<li>
				<Kbd label="Plus"><Plus /></Kbd> / <Kbd label="Minus"><Minus /></Kbd> / <Kbd>0</Kbd>: zoom
				in, out, reset (active Zoom)
			</li>
		</ul>
		<p>
			Image zoom uses unmodified keys only: <Kbd label="Command"><Command /></Kbd><Kbd label="Plus"
				><Plus /></Kbd
			> /
			<Kbd>Ctrl</Kbd><Kbd label="Plus"><Plus /></Kbd> and the other modified combos are left to the browser,
			so page zoom (WCAG 1.4.4 text resize) keeps working while the dialog is open.
		</p>
		<p>
			Focus is trapped in the dialog; closing restores focus to the opening Trigger. Native page
			pinch-zoom is blocked while Content is mounted so it does not fight <code class="text-xs"
				>Lightbox.Zoom</code
			>.
		</p>
	</DocsSection>

	<DocsSection id="matrix" title="Interaction matrix">
		<DataTable columns={['State', 'Pull', 'Zoom chrome / buttons', 'Prev / Next']} rows={matrix} />
	</DocsSection>
</DocsShell>
