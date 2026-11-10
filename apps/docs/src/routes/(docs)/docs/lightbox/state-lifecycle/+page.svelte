<script lang="ts">
	import { docsLink } from '#lib/components/docs-link.js';
	import DocsDemo from '#lib/components/DocsDemo.svelte';
	import DocsSection from '#lib/components/DocsSection.svelte';
	import DocsShell from '#lib/components/DocsShell.svelte';
	import { apiHref, docsPages } from '#lib/content/nav.js';
	import ControlledDemo from '#lib/docs/state/ControlledDemo.svelte';
	import HandleDemo from '#lib/docs/state/HandleDemo.svelte';
	import LifecycleDemo from '#lib/docs/state/LifecycleDemo.svelte';
	import controlled from '#lib/excerpts/ControlledState.svelte?highlight';
	import handle from '#lib/excerpts/CreateHandle.svelte?highlight';
	import lifecycle from '#lib/excerpts/LifecycleCallbacks.svelte?highlight';

	const toc = [
		{ id: 'controlled', title: 'Controlled state' },
		{ id: 'imperative', title: 'Imperative API' },
		{ id: 'lifecycle', title: 'Lifecycle callbacks' },
		{ id: 'before-open', title: 'onBeforeOpen' },
		{ id: 'before-close', title: 'onBeforeClose' }
	];
</script>

<svelte:head>
	<title>State and lifecycle · ramka for Svelte</title>
	<meta
		name="description"
		content="Controlled and uncontrolled lightbox state in Svelte: bind:open and bind:index, imperative handles with createHandle, and lifecycle callbacks like onBeforeOpen."
	/>
</svelte:head>

<DocsShell title="State & lifecycle" {toc}>
	{#snippet description()}
		Control open state and the active index with bindings, <code class="text-xs">createHandle()</code>, or both, and
		know when callbacks fire. Part of <a href={docsPages.overview.href} class={docsLink}>Lightbox</a>.
	{/snippet}

	<DocsSection id="controlled" title="Controlled state">
		<p>
			Bind <code class="text-xs">open</code> and <code class="text-xs">index</code> on
			<a href={apiHref.root} class={docsLink}>Root</a> to drive the lightbox from URL params, a store, or sibling UI.
			Leave them unbound and Root keeps its own state, starting closed at index 0.
		</p>
		<p>
			The React version splits this into <code class="text-xs">open</code>/<code class="text-xs">onOpenChange</code>,
			<code class="text-xs">value</code>/<code class="text-xs">onValueChange</code>, and
			<code class="text-xs">defaultOpen</code>/<code class="text-xs">defaultValue</code>. In Svelte,
			<code class="text-xs">bind:</code> covers all three: pass a plain value for the initial state, bind it to control
			it.
		</p>
		<DocsDemo code={controlled} title="Gallery.svelte"><ControlledDemo /></DocsDemo>
	</DocsSection>

	<DocsSection id="imperative" title="Imperative API">
		<p>
			<a href={apiHref.root} class={docsLink}>Lightbox.createHandle()</a> lets Triggers and Root live apart: pass the
			same handle to both. Call <code class="text-xs">open(index, {'{ triggerId }'})</code> from any button so the open
			still morphs from the matching <a href={apiHref.trigger} class={docsLink}>Trigger</a>. The handle also has
			<code class="text-xs">close()</code>, <code class="text-xs">goTo(index)</code>, and a reactive
			<code class="text-xs">isOpen</code>.
		</p>
		<DocsDemo code={handle} title="Gallery.svelte"><HandleDemo /></DocsDemo>
		<p>
			Inside one component you can skip the handle: <code class="text-xs">bind:this</code> on Root exposes
			<code class="text-xs">show(index)</code> and <code class="text-xs">close()</code>.
		</p>
	</DocsSection>

	<DocsSection id="lifecycle" title="Lifecycle callbacks">
		<p>
			<code class="text-xs">onOpenChange</code> fires immediately when open flips: use it to sync the URL or external
			state. <code class="text-xs">onOpenChangeComplete</code> fires after enter and exit motion settles: use it for
			cleanup and focus. <code class="text-xs">onValueChange</code> reports the new index plus a
			<a href={apiHref.types} class={docsLink}>NavigationSource</a> (including
			<code class="text-xs">imperative</code> for handle navigation).
		</p>
		<DocsDemo code={lifecycle} title="Gallery.svelte"><LifecycleDemo /></DocsDemo>
	</DocsSection>

	<DocsSection id="before-open" title="onBeforeOpen">
		<p>
			When View Transitions are on, open is <em>prepare → optional image decode → optional onBeforeOpen → morph</em>. Use
			<a href={apiHref.root} class={docsLink}>Root</a>’s <code class="text-xs">onBeforeOpen</code> to delay the morph
			until custom media is ready (iframe <code class="text-xs">load</code>, video, WebGL). It runs after the lightbox is
			mounted hidden, so destination nodes exist, and before <code class="text-xs">startViewTransition</code>.
		</p>
		<p>
			Keep <code class="text-xs">awaitImageDecode</code> for photos (default <code class="text-xs">true</code>). For
			non-image destinations, pass <code class="text-xs">awaitImageDecode={'{false}'}</code> and wait in
			<code class="text-xs">onBeforeOpen</code>. Bound your own timeout; <code class="text-xs">ctx.signal</code> aborts
			if a newer open or close wins. See <a href="/examples/lightbox/3d-models" class={docsLink}>3D models</a>.
		</p>
	</DocsSection>

	<DocsSection id="before-close" title="onBeforeClose">
		<p>
			<code class="text-xs">onBeforeClose</code> fires synchronously when close begins and, with View Transitions,
			<em>before</em> the old snapshot is captured. Use it to freeze custom media (<code class="text-xs">video.pause()</code>,
			stop a rAF loop) so the close morph isn’t a mid-frame. Unlike <code class="text-xs">onBeforeOpen</code>, it cannot
			delay close. <code class="text-xs">onOpenChange(false)</code> is too late for this: it runs inside the transition
			callback, after the snapshot.
		</p>
	</DocsSection>
</DocsShell>
