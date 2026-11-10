<script lang="ts">
	import Command from '@lucide/svelte/icons/command';
	import CodeBlock from '#lib/components/CodeBlock.svelte';
	import DataTable, { td, tdLabel } from '#lib/components/DataTable.svelte';
	import { docsLink } from '#lib/components/docs-link.js';
	import DocsSection from '#lib/components/DocsSection.svelte';
	import DocsShell from '#lib/components/DocsShell.svelte';
	import Kbd from '#lib/components/Kbd.svelte';
	import { apiHref, docsPages } from '#lib/content/nav.js';
	import { desktopApps, desktopRamka, mobileApps, mobileRamka, wcag } from '#lib/content/zoom.js';
	import zoomCursor from '#lib/excerpts/zoom-cursor.css?highlight';

	const toc = [
		{ id: 'desktop-conventions', title: 'Desktop conventions' },
		{ id: 'desktop-ramka', title: 'ramka on desktop' },
		{ id: 'mobile-conventions', title: 'Mobile conventions' },
		{ id: 'mobile-ramka', title: 'ramka on mobile' },
		{ id: 'heuristics', title: 'UX heuristics' },
		{ id: 'wcag', title: 'WCAG conformance' }
	];
	const comparison = ['Interaction', 'ramka', 'Consensus', 'Verdict'];
	const keyboard = 'https://www.w3.org/WAI/WCAG22/Understanding/keyboard.html';
</script>

<svelte:head>
	<title>Zoom & a11y · ramka for Svelte</title>
	<meta
		name="description"
		content="How zoom and pan in the ramka Svelte lightbox line up with mainstream desktop and touch image viewers, and how they map to WCAG 2.2."
	/>
</svelte:head>

{#snippet modifier()}<Kbd>Ctrl</Kbd>/<Kbd label="Command"><Command /></Kbd>{/snippet}

<DocsShell title="Zoom & a11y" {toc}>
	{#snippet description()}
		How ramka’s zoom and pan, on desktop and on touch, line up with mainstream image viewers, and how they map to WCAG
		2.2. For the wiring and gesture ownership, see <a href={docsPages.gestures.href} class={docsLink}>Gestures</a>.
	{/snippet}

	<DocsSection id="desktop-conventions" title="Desktop conventions">
		<p>
			Desktop image viewers split into two families, depending on whether the surface is treated as a
			<em>media viewer</em> or a <em>canvas / document</em>:
		</p>
		<ul class="list-disc space-y-2 pl-5">
			<li>
				<strong>Media-viewer model</strong> (Google Photos, Lightroom, PhotoSwipe, OpenSeadragon): a bare scroll wheel
				zooms toward the cursor; drag pans.
			</li>
			<li>
				<strong>Canvas / document model</strong> (Figma, macOS Preview, Google Maps on trackpad): a bare scroll pans, and
				zoom is gated behind a modifier ({@render modifier()}) or a trackpad pinch, so it never hijacks the user’s scroll.
			</li>
		</ul>
		<p>
			Regardless of family, four things are near-universal: <strong>drag pans</strong> when zoomed,
			<strong>wheel/pinch zoom is focal</strong> (zooms toward the pointer), <strong>double-click toggles</strong> zoom,
			and <strong>{@render modifier()}+wheel and trackpad pinch always zoom</strong>. The only real disagreement is
			whether a <em>bare</em> wheel zooms or pans.
		</p>
		<DataTable columns={['App', 'Bare scroll', 'Modifier', 'Double-click', 'Drag']} rows={desktopApps}>
			{#snippet head(column)}
				{#if column === 'Modifier'}{@render modifier()}+wheel · pinch{:else}{column}{/if}
			{/snippet}
		</DataTable>
	</DocsSection>

	<DocsSection id="desktop-ramka" title="ramka on desktop">
		<p>
			ramka defaults to the canvas model: {@render modifier()}+wheel and trackpad pinch zoom to the cursor, a bare wheel
			is a no-op, and <code class="text-xs">scrollToZoom</code> on <a href={apiHref.zoom} class={docsLink}>Zoom</a>
			opts into the media-viewer behavior. That is the more embed-friendly default: a lightbox often lives inside a
			scrollable page, so bare-wheel zoom risks trapping the user’s scroll.
		</p>
		<p>
			The Svelte port differs from <code class="text-xs">@ramka/react</code> in two rows below: the bare wheel does not
			pan a zoomed image yet, and trackpad pinch is clamped at the zoom limits instead of rubber-banding past them.
		</p>
		<DataTable columns={comparison} rows={desktopRamka} />
		<p>
			The one intentional inconsistency: <a href={apiHref.zoomIn} class={docsLink}>ZoomIn</a> /
			<a href={apiHref.zoomOut} class={docsLink}>ZoomOut</a> zoom about the center rather than the cursor. That is
			standard (buttons have no pointer position) and matches Google Maps / OpenSeadragon button behavior.
		</p>
	</DocsSection>

	<DocsSection id="mobile-conventions" title="Mobile conventions">
		<p>
			Touch is far more uniform than desktop. Every mainstream photo viewer converges on the same model, set by iOS
			Photos and Android’s Google Photos:
		</p>
		<ul class="list-disc space-y-2 pl-5">
			<li>
				<strong>Pinch to zoom</strong>, focal at the pinch midpoint. The image stays glued to the centroid, so spreading
				and sliding two fingers zoom and pan as one gesture, with a <em>rubber-band</em> overshoot past the min/max that
				snaps back on release.
			</li>
			<li><strong>Double-tap</strong> toggles between fit and a zoomed level, centered on the tap point.</li>
			<li><strong>One- or two-finger drag pans</strong> while zoomed, with <strong>inertia / momentum</strong> on release.</li>
			<li>
				At fit, a <strong>horizontal swipe navigates</strong> and a <strong>downward swipe dismisses</strong> the viewer.
			</li>
		</ul>
		<p>
			The subtle but critical part is arbitration: pinch, pan, swipe-to-navigate, and swipe-to-dismiss all start from the
			same finger, so a viewer has to decide which gesture owns a given touch without misfiring.
		</p>
		<DataTable columns={['App', 'Pinch', 'Double-tap', 'Pan', 'Momentum', 'Swipe down']} rows={mobileApps} />
	</DocsSection>

	<DocsSection id="mobile-ramka" title="ramka on mobile">
		<p>
			ramka implements the iOS/Android touch model, including the arbitration details that make it feel native: a
			double-tap that commits on pointerup (so a flick that starts near the last tap never zooms by mistake), elastic
			overscroll on both pinch and pan, momentum with bound-clamping, and a haptic tick on snap-back. Pull-to-dismiss and
			zoom/pan share a <a href="{docsPages.gestures.href}#matrix" class={docsLink}>navigation lock</a> so an in-flight
			Slides fling can’t be hijacked mid-scroll.
		</p>
		<DataTable columns={comparison} rows={mobileRamka} />
		<p>
			The touch model is where ramka is strongest. It matches the platform viewers almost point for point and adds
			haptics that most web lightboxes skip (where the browser exposes them: <code class="text-xs">navigator.vibrate</code>
			does nothing on iOS). Instagram-style <em>pinch-to-peek</em> (zoom only holds while fingers are down, then springs
			back to fit) is a deliberate product choice, not the default; ramka keeps the zoom level after release like Photos,
			which is the right behavior for a general-purpose viewer.
		</p>
	</DocsSection>

	<DocsSection id="heuristics" title="UX heuristics">
		<ul class="list-disc space-y-2 pl-5">
			<li>
				<strong>Zoom to the cursor.</strong> The single most important pointer-zoom heuristic. ramka honors it for wheel,
				pinch, and double-click.
			</li>
			<li>
				<strong>Don’t hijack bare scroll by default.</strong> Keeping <code class="text-xs">scrollToZoom</code> off is the
				safer default for embedded lightboxes; enable it for full-bleed, single-image viewers.
			</li>
			<li>
				<strong>Signal zoomability at rest.</strong> Consider a <code class="text-xs">zoom-in</code> cursor over the image
				at 1× so mouse-only users discover double-click and Ctrl-wheel zoom. ramka leaves this to your CSS: the
				<a href={apiHref.zoom} class={docsLink}>Zoom</a> surface exposes <code class="text-xs">data-zoom</code> only while
				scaled past 1×. Set <code class="text-xs">cursor: zoom-in</code> on the class you pass to
				<code class="text-xs">Lightbox.Zoom</code>; ramka’s grab / grabbing cursor wins once scaled:
			</li>
		</ul>
		<CodeBlock code={zoomCursor} title="zoom.css" />
		<ul class="list-disc space-y-2 pl-5">
			<li>
				<strong>Never steal swipe-to-dismiss.</strong> On touch, pan must only take over <em>after</em> the image is
				zoomed; at fit, the vertical swipe belongs to pull-to-dismiss and the horizontal swipe to navigation. ramka gates
				this with <code class="text-xs">touch-action</code> and the navigation lock.
			</li>
			<li>
				<strong>Rubber-band, don’t hard-stop.</strong> Elastic overscroll on pinch and pan (plus a haptic tick on
				snap-back) is what makes zoom feel native rather than mechanical.
			</li>
			<li>
				<strong>Size touch controls for fingers.</strong> Give <a href={apiHref.zoomIn} class={docsLink}>ZoomIn</a> /
				<a href={apiHref.zoomOut} class={docsLink}>ZoomOut</a> and <a href={apiHref.close} class={docsLink}>Close</a> a
				hit area of at least 44×44 px on touch (WCAG 2.5.8 asks for 24 px or more; 44 px is the platform norm).
			</li>
		</ul>
	</DocsSection>

	<DocsSection id="wcag" title="WCAG conformance">
		<p>
			These are the WCAG 2.2 success criteria that govern zoom and pan. ramka ships the pointer and keyboard
			alternatives the criteria expect:
		</p>
		<DataTable columns={['Success criterion', 'Level', 'Applies to', 'ramka']}>
			{#each wcag as row (row.sc)}
				<tr>
					<td class={tdLabel}><a href={row.href} class={docsLink} target="_blank" rel="noreferrer">{row.sc}</a></td>
					<td class={td}>{row.level}</td>
					<td class={td}>{row.applies}</td>
					<td class={td}><strong>{row.verdict}</strong> {row.status}</td>
				</tr>
			{/each}
		</DataTable>
		<p>
			<strong>Note on 2.5.7.</strong> Pan-by-drag has a keyboard alternative (arrows), which satisfies
			<a href={keyboard} class={docsLink} target="_blank" rel="noreferrer">2.1.1 Keyboard</a>, but 2.5.7 specifically
			wants a <em>single-pointer, non-drag</em> alternative, and keyboard does not count for it. If you must meet AA
			strictly, add pointer pan controls (such as edge or arrow buttons) alongside
			<a href={apiHref.zoomIn} class={docsLink}>ZoomIn</a> / <a href={apiHref.zoomOut} class={docsLink}>ZoomOut</a>.
			Many shipping viewers do not either, but for enterprise targets it is worth flagging.
		</p>
	</DocsSection>
</DocsShell>
