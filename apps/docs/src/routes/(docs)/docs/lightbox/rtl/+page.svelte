<script lang="ts">
	import CodeBlock from '#lib/components/CodeBlock.svelte';
	import DataTable from '#lib/components/DataTable.svelte';
	import { docsLink } from '#lib/components/docs-link.js';
	import DocsDemo from '#lib/components/DocsDemo.svelte';
	import DocsSection from '#lib/components/DocsSection.svelte';
	import DocsShell from '#lib/components/DocsShell.svelte';
	import { apiHref, docsPages } from '#lib/content/nav.js';
	import RtlHandleDemo from '#lib/docs/rtl/RtlHandleDemo.svelte';
	import i18nCopy from '#lib/excerpts/I18nCopy.svelte?highlight';
	import rtlHandle from '#lib/excerpts/RtlHandle.svelte?highlight';
	import rtlSetup from '#lib/excerpts/RtlSetup.svelte?highlight';

	const toc = [
		{ id: 'setup', title: 'Setting the direction' },
		{ id: 'scoped', title: 'Already-RTL apps' },
		{ id: 'mirrors', title: 'What mirrors' },
		{ id: 'imperative', title: 'Indices never mirror' },
		{ id: 'styling', title: 'Styling for RTL' },
		{ id: 'copy', title: 'Copy is yours' }
	];
	const mirrors = [
		[
			'Slide order & scroll',
			'Mirrored',
			'Index 0 sits at the inline-start (right) edge; the scroller runs right to left.'
		],
		[
			'Horizontal arrow keys',
			'Mirrored',
			'ArrowLeft advances, ArrowRight goes back: travel follows reading order.'
		],
		[
			'Home / End',
			'Not mirrored',
			'Home is always the first item, End the last. They address indices, not sides.'
		],
		[
			'Thumbnail strip',
			'Mirrored',
			'Track, padding, and the active-thumb indicator all run on the inline axis.'
		],
		[
			'Previous / Next',
			'Mirrored position',
			'Previous is the item nearer index 0, so it belongs on the inline-start side.'
		],
		[
			'Zoomed panning',
			'Not mirrored',
			'Direct manipulation of a surface: ArrowRight pans right, as on a map.'
		],
		[
			'Pull-to-dismiss',
			'Not mirrored',
			'The sheet follows your finger, which has no reading direction.'
		],
		[
			'Morph / view transitions',
			'Mirrored',
			'The morph measures the trigger and the slide, so it follows whatever they do.'
		]
	];
</script>

<svelte:head>
	<title>RTL support · ramka for Svelte</title>
	<meta
		name="description"
		content="Right-to-left lightbox support in Svelte: one dir=&quot;rtl&quot; on Root mirrors slide order, arrow keys, thumbnails, and the morph geometry."
	/>
</svelte:head>

<DocsShell title="RTL support" {toc}>
	{#snippet description()}
		Run the lightbox in a right-to-left reading direction: Arabic, Hebrew, Persian, Urdu. Part of
		<a href={docsPages.overview.href} class={docsLink}>Lightbox</a>.
	{/snippet}

	<DocsSection id="setup" title="Setting the direction">
		<p>
			One prop. <code class="text-xs">dir="rtl"</code> on
			<a href={apiHref.root} class={docsLink}>Root</a>
			mirrors the lightbox’s behavior (scroll geometry, arrow keys, thumbnail-strip travel) and is written
			to the
			<a href={apiHref.portal} class={docsLink}>Portal</a> host as a
			<code class="text-xs">dir</code>
			attribute, so CSS direction follows it too. That matters because the host mounts on
			<code class="text-xs">document.body</code>: a
			<code class="text-xs">dir</code> on your own layout wrapper would style the page and never reach
			the viewer.
		</p>
		<p>
			Because the prop crosses the portal boundary on its own, it is also all you need to run a
			single RTL lightbox inside an otherwise LTR page: no wrapper element, no portal <code
				class="text-xs">container</code
			>. The demo further down this page does exactly that, since these docs are LTR.
		</p>
		<DocsDemo code={rtlSetup} title="Gallery.svelte">
			<p class="text-sm text-neutral-600 dark:text-neutral-400">
				Behavior and layout both follow the prop. See the live gallery below.
			</p>
		</DocsDemo>
	</DocsSection>

	<DocsSection id="scoped" title="Already-RTL apps">
		<p>
			If the whole app is RTL (<code class="text-xs">dir="rtl"</code> on
			<code class="text-xs">&lt;html&gt;</code>), you can omit the prop and the lightbox will still
			<em>look</em> right: nothing is written to the portal host when the prop is absent, so it inherits
			the document’s direction. Layout mirrors, and the page keeps control of it.
		</p>
		<p>
			Pass the prop anyway. Behavior does not read your CSS, so it stays on its <code
				class="text-xs">'ltr'</code
			>
			default, and RTL layout with LTR behavior is the one misconfiguration with no visible symptom. The
			carousel still renders and still scrolls; it just resolves the wrong index for a scroll position,
			so the active marker and the visible slide drift apart. In development the library compares the
			two when Slides mounts and warns.
		</p>
	</DocsSection>

	<DocsSection id="mirrors" title="What mirrors">
		<p>
			Not everything flips, and the split is not arbitrary. Moving through an ordered list follows
			reading order, so it mirrors. Manipulating a surface directly (panning a zoomed photo,
			dragging a sheet away) does not: a drag follows your hand, and mirroring it would fight the
			gesture. The arrow keys serve both, which is why they mirror while navigating and stay
			physical while zoomed.
		</p>
		<DataTable columns={['Surface', 'Under RTL', 'Why']} rows={mirrors} />
	</DocsSection>

	<DocsSection id="imperative" title="Indices never mirror">
		<p>
			The imperative API is index-based, and indices are not sides.
			<a href={apiHref.createHandle} class={docsLink}>createHandle()</a>’s
			<code class="text-xs">open(3)</code>
			and
			<code class="text-xs">goTo(3)</code> land on the fourth item in either direction; what changes
			is that RTL renders it further left and the track travels the other way to reach it. The same
			holds for
			<code class="text-xs">bind:index</code> / <code class="text-xs">onValueChange</code> and for
			<a href={apiHref.trigger} class={docsLink}>Trigger</a>’s <code class="text-xs">index</code>.
		</p>
		<p>
			The buttons inside the viewer below jump by index. Open it, then watch the strip: the photo
			you land on is the same one an LTR gallery would show.
		</p>
		<DocsDemo code={rtlHandle} title="Gallery.svelte"><RtlHandleDemo /></DocsDemo>
	</DocsSection>

	<DocsSection id="styling" title="Styling for RTL">
		<p>
			The library ships no styles, so mirroring your own chrome is your job, and logical properties
			do nearly all of it. Reach for <code class="text-xs">inset-inline-start</code> /
			<code class="text-xs">inset-inline-end</code>
			over
			<code class="text-xs">left</code> / <code class="text-xs">right</code>,
			<code class="text-xs">padding-inline</code>
			over <code class="text-xs">padding-left</code>, and
			<code class="text-xs">border-inline-start</code>
			for a divider beside a panel that changes sides. In Tailwind those are
			<code class="text-xs">start-*</code>,
			<code class="text-xs">end-*</code>, <code class="text-xs">ps-*</code>,
			<code class="text-xs">pe-*</code>,
			<code class="text-xs">ms-*</code>, and <code class="text-xs">text-start</code>. Every preset
			in this documentation is written this way.
		</p>
		<p>
			Three things logical properties will not fix. Directional glyphs need flipping:
			<code class="text-xs">.nav:dir(rtl) svg &#123; transform: scaleX(-1); &#125;</code> turns a
			chevron around, since mirroring only the button’s position leaves it pointing the wrong way.
			Safe-area insets are physical, so pairing
			<code class="text-xs">inset-inline-start</code> with
			<code class="text-xs">env(safe-area-inset-left)</code>
			clears the notch on the wrong side; map them to the inline axis through a custom property that you
			swap under
			<code class="text-xs">:dir(rtl)</code>. And a counter like <code class="text-xs">1 / 7</code>
			is two digit runs around a neutral separator with nothing to anchor them, so an RTL base direction
			reorders it into
			<code class="text-xs">7 / 1</code>. Give
			<a href={apiHref.counter} class={docsLink}>Counter</a>
			<code class="text-xs">direction: ltr; unicode-bidi: isolate;</code>.
		</p>
	</DocsSection>

	<DocsSection id="copy" title="Copy is yours">
		<p>
			Direction is only half of internationalization. The other half is words, and the library ships
			none of them: not a label, not a role description, not a slide name. A headless library cannot
			know your language, and a string baked into a primitive is copy you never approved: an English
			“carousel” announced inside Hebrew speech is worse than no announcement at all.
		</p>
		<p>
			So every string a screen reader reads comes from you. Two of them are easy to miss because
			they are not visible on screen: <code class="text-xs">aria-roledescription</code> on
			<a href={apiHref.slides} class={docsLink}>Slides</a> and
			<a href={apiHref.item} class={docsLink}>Item</a>, which replaces the word for the role, and
			the slide’s <code class="text-xs">aria-label</code>, which is where the
			<a
				href="https://www.w3.org/WAI/ARIA/apg/patterns/carousel/"
				target="_blank"
				rel="noreferrer"
				class={docsLink}>APG carousel pattern</a
			>
			puts the position, because a <code class="text-xs">group</code> cannot carry
			<code class="text-xs">aria-posinset</code>. A slide’s caption does not name it either, so a
			captioned slide with no label is still nameless. In development the library says so rather
			than letting it ship silently.
		</p>
		<p>
			Add a thumbnail strip and the naming moves: each item becomes a <code class="text-xs"
				>tabpanel</code
			> named by its thumbnail tab, so label the thumbnails and leave the items to inherit it.
		</p>
		<CodeBlock code={i18nCopy} title="Viewer.svelte" />
	</DocsSection>
</DocsShell>
