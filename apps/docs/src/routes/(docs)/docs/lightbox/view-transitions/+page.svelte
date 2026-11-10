<script lang="ts">
	import CodeBlock from '#lib/components/CodeBlock.svelte';
	import { docsLink } from '#lib/components/docs-link.js';
	import DocsDemo from '#lib/components/DocsDemo.svelte';
	import DocsSection from '#lib/components/DocsSection.svelte';
	import DocsShell from '#lib/components/DocsShell.svelte';
	import PropSectionTitle from '#lib/components/PropSectionTitle.svelte';
	import { apiHref, docsPages } from '#lib/content/nav.js';
	import AspectDemo from '#lib/docs/vt/AspectDemo.svelte';
	import CrossfadeDemos from '#lib/docs/vt/CrossfadeDemos.svelte';
	import MorphToDemos from '#lib/docs/vt/MorphToDemos.svelte';
	import crossfadeBoth from '#lib/excerpts/CrossfadeBoth.svelte?highlight';
	import minimalMorph from '#lib/excerpts/MinimalMorph.svelte?highlight';
	import aspectDo from '#lib/excerpts/MorphAspectDo.svelte?highlight';
	import aspectDont from '#lib/excerpts/MorphAspectDont.svelte?highlight';
	import morphToClosest from '#lib/excerpts/MorphToClosest.svelte?highlight';
	import snippets from '#lib/excerpts/view-transitions.txt?snippets';

	const toc = [
		{ id: 'enable', title: 'Morph refs' },
		{ id: 'source-aspect', title: 'Source aspect' },
		{ id: 'crossfade', title: 'Trigger crossfade' },
		{ id: 'morph-to', title: 'Root morphTo' },
		{ id: 'scroll-trigger', title: 'scrollTriggerIntoView' },
		{ id: 'programmatic', title: 'Programmatic open' },
		{ id: 'styling', title: 'Styling' },
		{ id: 'timing-presets', title: 'Timing presets' },
		{ id: 'injected-css', title: 'Injected CSS' }
	];
</script>

<svelte:head>
	<title>Morph view transitions · ramka for Svelte</title>
	<meta
		name="description"
		content="Shared element View Transitions in a Svelte lightbox: morph attachments, trigger crossfade, source aspect handling, morphTo, scrollTriggerIntoView, and programmatic opens."
	/>
</svelte:head>

<DocsShell title="View transitions" {toc}>
	{#snippet description()}
		Morph open and close between a trigger and the active item with the browser View Transitions API. Part of
		<a href={docsPages.overview.href} class={docsLink}>Lightbox</a>. Unsupported browsers, reduced motion, and low-end
		devices fall back to a plain fade.
	{/snippet}

	<DocsSection id="enable" title="Morph refs">
		<p>
			Morph is on by default (<code class="text-xs">viewTransition</code> on
			<a href={apiHref.root} class={docsLink}>Root</a>). Pass <code class="text-xs">viewTransition={'{false}'}</code> to
			opt out. Recommended destination shape: <a href={apiHref.media} class={docsLink}>Lightbox.Media</a> around the
			<code class="text-xs">&lt;img&gt;</code> or <code class="text-xs">&lt;video&gt;</code> (a sized fit-box that is
			both morph target and placeholder host). On <a href={apiHref.trigger} class={docsLink}>Trigger</a>, the first
			<code class="text-xs">img</code> inside is the morph source on its own. To be explicit, take the refs from the
			children snippet; both are attachments:
		</p>
		<ul class="list-disc space-y-2 pl-5">
			<li>
				<code class="text-xs">imageRef</code>: attach to the Trigger thumb <code class="text-xs">&lt;img&gt;</code> whose
				pixels bridge the morph. Media finds the destination image (or video poster) by itself. Open reuses the
				already-decoded bitmap so the transition doesn’t flash empty space.
			</li>
			<li>
				<code class="text-xs">morphRef</code>: optional escape hatch when morph bounds should differ from Media or the
				image (tile with overlay, swatch + label).
			</li>
		</ul>
		<p>
			Nested components can read the same refs from context with
			<a href={apiHref.context} class={docsLink}>getTrigger() and getItem()</a> instead of threading the snippet
			argument. Use <code class="text-xs">awaitImageDecode</code> on <a href={apiHref.root} class={docsLink}>Root</a> when
			you want a short wait for the destination image before the morph starts (default cap about 200ms).
		</p>
		<CodeBlock code={minimalMorph} title="Gallery.svelte" />
	</DocsSection>

	<DocsSection id="source-aspect" title="Source aspect">
		<p>
			The morph snapshots whatever pixels are on the trigger <code class="text-xs">&lt;img&gt;</code> and interpolates
			them into the destination Media box. That only looks like one photo when both sides share the
			<em>same intrinsic aspect ratio</em>: the same file, or srcset candidates of that file. A square tile is fine; crop
			it with CSS (<code class="text-xs">object-fit: cover</code>), not by baking
			<code class="text-xs">w=h&amp;fit=crop</code> into a different image.
		</p>
		<p>
			A CDN-cropped 1∶1 thumb against a 3∶2 lightbox image will reframe mid-animation: ramka paints the square thumb into
			the landscape box, then the full file lands with a different crop. Element boxes may differ. Intrinsic aspect must
			not.
		</p>
		<p>These demos delay the lightbox image by about 500ms so the handoff is visible on every open.</p>
		<DocsDemo code={aspectDo} title="Do.svelte"><AspectDemo kind="do" /></DocsDemo>
		<div class="mt-4">
			<DocsDemo code={aspectDont} title="Dont.svelte"><AspectDemo kind="dont" /></DocsDemo>
		</div>
	</DocsSection>

	<DocsSection id="crossfade">
		{#snippet title()}
			<PropSectionTitle partHref={apiHref.trigger} part="Trigger" prop="crossfade" sectionId="crossfade" />
		{/snippet}
		<p>Controls whether the morph <em>dissolves</em> between trigger and item snapshots or hard-cuts geometry only.</p>
		<ul class="list-disc space-y-2 pl-5">
			<li>
				<strong>Omit (default)</strong>: hard-cut. Best when trigger and item show the <em>same</em>
				picture at the <em>same intrinsic aspect</em> (a CSS <code class="text-xs">object-cover</code> window or a
				smaller srcset is fine; a CDN-baked crop that changes the aspect is not, see
				<a href="#source-aspect" class={docsLink}>Source aspect</a>). Leaves
				<code class="text-xs">data-ramka-crossfade</code> unset on <code class="text-xs">&lt;html&gt;</code> during the
				transition.
			</li>
			<li><code class="text-xs">both</code>: dissolve on open and close (stack → single photo, +N overlay tile).</li>
			<li>
				<code class="text-xs">open</code> / <code class="text-xs">close</code>: dissolve in one direction only (poster →
				live video often wants <code class="text-xs">close</code>).
			</li>
		</ul>
		<p>
			Keep trigger and item images on <code class="text-xs">object-fit: cover</code> (or the same fit) so crops stay
			coherent. Put border-radius on the morph target itself: the library interpolates
			<code class="text-xs">--lightbox-morph-border-radius-from/to</code> on <code class="text-xs">&lt;html&gt;</code>.
		</p>
		<DocsDemo code={crossfadeBoth} title="Gallery.svelte"><CrossfadeDemos /></DocsDemo>
	</DocsSection>

	<DocsSection id="morph-to">
		{#snippet title()}
			<PropSectionTitle partHref={apiHref.root} part="Root" prop="morphTo" sectionId="morph-to" />
		{/snippet}
		<p>Picks which trigger receives the <em>close</em> morph:</p>
		<ul class="list-disc space-y-2 pl-5">
			<li>
				<code class="text-xs">active</code> (default): the trigger for the current active index. No morph if that index
				has no trigger.
			</li>
			<li>
				<code class="text-xs">origin</code>: always the trigger that opened the lightbox (one tile opens many items).
			</li>
			<li>
				<code class="text-xs">closest</code>: the active index if registered, otherwise the nearest registered trigger.
			</li>
		</ul>
		<DocsDemo code={morphToClosest} title="Gallery.svelte"><MorphToDemos /></DocsDemo>
	</DocsSection>

	<DocsSection id="scroll-trigger">
		{#snippet title()}
			<PropSectionTitle partHref={apiHref.root} part="Root" prop="scrollTriggerIntoView" sectionId="scroll-trigger" />
		{/snippet}
		<p>
			When the page scrolls while the lightbox is open, the close morph can land off-screen. Use
			<code class="text-xs">scrollTriggerIntoView</code> to keep the target trigger in view:
		</p>
		<ul class="list-disc space-y-2 pl-5">
			<li><code class="text-xs">onChange</code>: scroll to the active trigger as the index changes (preemptive).</li>
			<li>
				<code class="text-xs">onOpenComplete</code>: reposition once open settles (invisible under the overlay;
				<code class="text-xs">instant</code> recommended).
			</li>
			<li><code class="text-xs">onClose</code>: scroll just before the close morph (visible jump at close start).</li>
		</ul>
		<p>
			Pass one option or an array. Each option also accepts <code class="text-xs">block</code> /
			<code class="text-xs">inline</code> alignment (default <code class="text-xs">nearest</code>): use
			<code class="text-xs">inline: 'center'</code> for horizontal snap strips with variable-width tiles. Pair with
			<code class="text-xs">morphTo</code> so the scrolled element is the same one that receives the morph.
		</p>
		<CodeBlock code={snippets.scrollTrigger} title="Gallery.svelte" />
	</DocsSection>

	<DocsSection id="programmatic" title="Programmatic open">
		<p>
			Prefer <a href={apiHref.root} class={docsLink}>createHandle()</a>:
			<code class="text-xs">open(index, {'{ triggerId }'})</code> associates a Trigger that declared that
			<code class="text-xs">id</code> so the open morph can use that element. Without a registered trigger (or
			<code class="text-xs">triggerId</code>), the open falls back to the fade path. Trigger clicks still morph. Demo:
			<a href="{docsPages.stateLifecycle.href}#imperative" class={docsLink}>State &amp; lifecycle: Imperative API</a>.
		</p>
	</DocsSection>

	<DocsSection id="styling" title="Styling">
		<p>
			You write <strong>zero</strong> view-transition CSS: the library injects the structural
			<code class="text-xs">::view-transition-*</code> rules itself (see
			<a href="#injected-css" class={docsLink}>Injected CSS</a>) and writes document hooks during a morph so your own
			skin CSS can react, for example to keep Backdrop and Content fades on the morph’s clock. Attribute and CSS variable
			tables live under <a href={apiHref.documentVt} class={docsLink}>Document (view transitions)</a>. Hooks:
		</p>
		<ul class="list-disc space-y-2 pl-5">
			<li>
				<code class="text-xs">data-ramka-view-transition</code>: <code class="text-xs">opening</code> |
				<code class="text-xs">closing</code>
			</li>
			<li>
				<code class="text-xs">data-ramka-crossfade</code>: dissolve path (present when Trigger
				<code class="text-xs">crossfade</code> is active for this phase; absent for hard-cut)
			</li>
			<li>
				<code class="text-xs">--lightbox-morph-border-radius-from/to</code>,
				<code class="text-xs">--lightbox-morph-old/new-opacity</code>
			</li>
			<li>
				<code class="text-xs">data-ramka-vt-preset</code>, <code class="text-xs">--lightbox-vt-duration</code>,
				<code class="text-xs">--lightbox-vt-easing</code>, <code class="text-xs">--lightbox-vt-crossfade-close-easing</code>,
				<code class="text-xs">--lightbox-vt-root-easing</code>: the active timing preset, written by the library (see
				<a href="#timing-presets" class={docsLink}>Timing presets</a>)
			</li>
			<li>
				<a href={apiHref.trigger} class={docsLink}>Trigger</a> <code class="text-xs">data-morph-target</code> /
				<a href={apiHref.item} class={docsLink}>Item</a> <code class="text-xs">data-skip-fade</code>: hide the live morph
				source and suppress entrance fades on the destination while the transition layer is up
			</li>
		</ul>
		<p>
			Motion splits into <strong>timing</strong> (a preset picked on Root, see below) and
			<strong>structure</strong> (injected by the library). Your CSS only handles cosmetics, and reads the
			library-written variables where it wants to stay in sync.
		</p>
	</DocsSection>

	<DocsSection id="timing-presets" title="Timing presets">
		<p>
			Morph duration and easing are chosen with the <code class="text-xs">viewTransition</code> prop on
			<a href={apiHref.root} class={docsLink}>Root</a>: pass a preset name instead of <code class="text-xs">true</code>:
		</p>
		<ul class="list-disc space-y-2 pl-5">
			<li><code class="text-xs">"default"</code>: 360ms, sheet curve with a tamed launch (what <code class="text-xs">true</code> runs)</li>
			<li><code class="text-xs">"snappy"</code>: 340ms, hotter launch; reads quicker</li>
			<li><code class="text-xs">"relaxed"</code>: 400ms, softer launch and longer settle</li>
			<li><code class="text-xs">"spring"</code>: 450ms, critically damped spring; Photos-style settle</li>
		</ul>
		<CodeBlock code={snippets.preset} title="Picking a preset" />
		<p>
			Timing is preset-based rather than free-form CSS on purpose: each preset is vetted on-device to stay smooth and
			skip-safe on iOS Safari (including Low Power Mode) and Android, where arbitrary curves stutter or teleport. The
			library publishes the preset timing as <code class="text-xs">--lightbox-vt-duration</code> /
			<code class="text-xs">--lightbox-vt-easing</code> / <code class="text-xs">--lightbox-vt-root-easing</code> in two
			places: always on the <a href={apiHref.portal} class={docsLink}>Portal</a> host, and, together with
			<code class="text-xs">data-ramka-vt-preset</code>, on <code class="text-xs">documentElement</code> for the duration
			of a morph. Read those variables in your own CSS as the skin’s single motion clock (for example
			<code class="text-xs">transition: opacity var(--lightbox-vt-duration, 360ms) ease-out</code> on Backdrop and
			Content): during a morph the fades stay in lockstep with it, and on the non-morph paths (unsupported browsers,
			reduced motion, low-end fallback) they still run on the preset’s timing. Do not set the variables yourself.
		</p>
	</DocsSection>

	<DocsSection id="injected-css" title="Injected CSS">
		<p>
			On first <a href={apiHref.root} class={docsLink}>Root</a> mount the library injects one stylesheet with everything a
			morph structurally needs: no copy-paste block to maintain, and several skins on one page can never fight over it.
		</p>
		<ul class="list-disc space-y-2 pl-5">
			<li>
				<strong>Name isolation</strong>: <code class="text-xs">startViewTransition</code> snapshots the
				whole document, so any page element with its own <code class="text-xs">view-transition-name</code> would paint
				<em>over</em> the lightbox. Every name is cleared while <code class="text-xs">data-ramka-view-transition</code> is
				set; the morph target re-applies its name inline with <code class="text-xs">!important</code> and stays the only
				captured group.
			</li>
			<li>
				<strong>Morph group</strong>: clipping and border-radius interpolation (put radius on the morph
				target element; the library writes <code class="text-xs">--lightbox-morph-border-radius-from/to</code>), timed by
				the active preset.
			</li>
			<li>
				<strong>Snapshots</strong>: hard-cut by default (<code class="text-xs">object-fit: cover</code>, no
				browser dissolve). When Trigger <code class="text-xs">crossfade</code> sets
				<code class="text-xs">data-ramka-crossfade</code>, the dissolve path (browser fade,
				<code class="text-xs">plus-lighter</code>, <code class="text-xs">object-fit: fill</code>) runs on the same preset
				clock, on a shorter window so the outgoing snapshot is gone before the size settles.
			</li>
			<li>
				<strong>Root snapshot</strong>: the page-behind crossfade, kept as a <em>single</em> root group
				(promoting Backdrop or Content into named groups tanks Safari). Fade scrim and chrome with live
				<code class="text-xs">opacity</code> transitions instead.
			</li>
			<li>
				<strong>Morph-target hide</strong>: <code class="text-xs">[data-morph-target]</code> gets
				<code class="text-xs">opacity: 0</code> with a 200ms fade-back (disabled during the transition so it can’t be
				captured mid-flight), so the live trigger never shows doubled under the morphing snapshot.
			</li>
			<li>
				<strong>Thumb-jump crossfade</strong>: the element-scoped Slides transition started when a
				ThumbnailStrip thumbnail jumps several slides, tunable with
				<code class="text-xs">--lightbox-select-vt-duration/easing</code> on Slides.
			</li>
		</ul>
		<p>
			Everything except name isolation is gated under <code class="text-xs">prefers-reduced-motion: no-preference</code>.
			The stylesheet is inserted at the <em>start</em> of <code class="text-xs">&lt;head&gt;</code>, so your own
			stylesheets cascade after it: overriding an injected rule takes an ordinary declaration of equal specificity, no
			<code class="text-xs">!important</code> needed.
		</p>
		<p>
			Lifecycle timing for your own CSS: Content and Backdrop stay mounted through exit animations; while a morph open is
			preparing they may be <code class="text-xs">visibility: hidden</code> so the morph layer owns the pixels. Prefer
			<code class="text-xs">onOpenChangeComplete</code> for post-motion work, see
			<a href="{docsPages.stateLifecycle.href}#lifecycle" class={docsLink}>State &amp; lifecycle: Lifecycle callbacks</a>.
		</p>
	</DocsSection>
</DocsShell>
