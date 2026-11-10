<script lang="ts">
	import CodeBlock from '#lib/components/CodeBlock.svelte';
	import { docsLink } from '#lib/components/docs-link.js';
	import DocsSection from '#lib/components/DocsSection.svelte';
	import DocsShell from '#lib/components/DocsShell.svelte';
	import { apiHref, docsPages } from '#lib/content/nav.js';
	import snippets from '#lib/excerpts/csp.txt?snippets';

	const toc = [
		{ id: 'injects', title: 'What the library injects' },
		{ id: 'nonce', title: 'Passing a nonce' },
		{ id: 'server', title: 'Server rendering' },
		{ id: 'attributes', title: 'Inline style attributes' },
		{ id: 'hashes', title: 'Hash-based policies' }
	];
</script>

<svelte:head>
	<title>Content Security Policy · ramka for Svelte</title>
	<meta
		name="description"
		content="Running the ramka Svelte lightbox under a strict style-src: what it injects, passing a nonce through CSPProvider in SvelteKit, and hash-based policies."
	/>
</svelte:head>

<DocsShell title="Content Security Policy" {toc}>
	{#snippet description()}
		Running the lightbox on pages with a strict <code class="text-xs">style-src</code>. Part of
		<a href={docsPages.overview.href} class={docsLink}>Lightbox</a>.
	{/snippet}

	<DocsSection id="injects" title="What the library injects">
		<p>
			The library is headless (your chrome, your CSS), but its structural rules have to come from somewhere. They live
			in one stylesheet with constant text. When the first Root or Trigger mounts, the library prepends it to
			<code class="text-xs">&lt;head&gt;</code> as a <code class="text-xs">&lt;style data-ramka&gt;</code> tag, so
			your own CSS still wins on equal specificity.
		</p>
		<p>
			If a strict <code class="text-xs">style-src</code> refuses that tag, the library notices and delivers the same
			rules through a
			<a
				href="https://developer.mozilla.org/en-US/docs/Web/API/CSSStyleSheet"
				target="_blank"
				rel="noreferrer"
				class={docsLink}>constructed stylesheet</a
			>
			instead, which CSP does not police at all. Everything keeps working with no configuration. The only thing a
			strict policy can cost is the first paint of a page that server-renders an <em>open</em> lightbox: that page
			carries the same tag inline so media fits, the active trigger hides, and the initial slide sits in place before
			any code runs. Refused, those first-paint details wait for hydration.
		</p>
		<p>
			This differs from <code class="text-xs">@ramka/react</code>, which splits the rules across three tags and relies
			on React’s style hoisting. The Svelte port keeps one tag and one fallback.
		</p>
	</DocsSection>

	<DocsSection id="nonce" title="Passing a nonce">
		<p>
			The standard way to allow specific inline styles is a
			<a
				href="https://developer.mozilla.org/en-US/docs/Web/HTTP/Reference/Headers/Content-Security-Policy/style-src#unsafe_inline_styles"
				target="_blank"
				rel="noreferrer"
				class={docsLink}>nonce</a
			>: the server generates a random value per request, puts it in the header, and any
			<code class="text-xs">&lt;style&gt;</code> carrying the same value is allowed. Wrap
			<a href={apiHref.cspProvider} class={docsLink}>CSPProvider</a> around everything that renders lightbox parts and
			pass it that value; the library stamps it on the tag it inserts.
		</p>
		<p>
			In SvelteKit, mint the nonce in <code class="text-xs">handle</code>, keep it on
			<code class="text-xs">event.locals</code> (declare <code class="text-xs">nonce: string</code> on
			<code class="text-xs">App.Locals</code>), and hand it to the root layout through a server load:
		</p>
		<CodeBlock code={snippets.hooks} title="src/hooks.server.ts" />
		<CodeBlock code={snippets.load} title="src/routes/+layout.server.ts" />
		<CodeBlock code={snippets.layout} title="src/routes/+layout.svelte" />
		<p>
			Put it above the <em>whole</em> app, not around one gallery. A detached
			<a href={apiHref.trigger} class={docsLink}>Trigger</a> living outside any Root reads the context too, and whichever
			part mounts first inserts the tag, so an uncovered Trigger would insert it without the nonce.
		</p>
		<p>
			SvelteKit’s own <code class="text-xs">csp</code> option (with <code class="text-xs">mode: 'nonce'</code>) covers
			the scripts and styles Kit renders, but it does not hand its nonce to components. If you use it, either let your
			<code class="text-xs">handle</code> own the style directive as above, or rely on the constructed-stylesheet
			fallback.
		</p>
	</DocsSection>

	<DocsSection id="server" title="Server rendering">
		<p>
			A Root that renders open on the server writes its tag straight into the HTML, nonce included, because Svelte
			components render their own markup. There is no framework call to thread the nonce through, so deep-linked pages
			that server-render an open viewer keep their first-paint styling under a strict policy. React needs the nonce
			passed to the render call as well, and Next.js does not forward it yet; that limit does not apply here.
		</p>
		<p>
			Prerendered pages have no request to mint a nonce for. Use a hash-based policy for those (see below).
		</p>
	</DocsSection>

	<DocsSection id="attributes" title="Inline style attributes">
		<p>
			Separate from <code class="text-xs">&lt;style&gt;</code> elements, CSP also governs
			<code class="text-xs">style="…"</code> attributes, and nonces cannot be applied to attributes at all. The library’s
			structural styles ride on inline attributes, which only matters for markup parsed from server HTML: styles set from
			JavaScript after hydration are not policed. If you server-render lightbox pages under a policy stricter than
			<code class="text-xs">style-src</code> alone, split the directives and keep
			<code class="text-xs">'unsafe-inline'</code> on the attribute half:
		</p>
		<CodeBlock code={snippets.header} title="CSP header" />
		<p>
			This is the industry-standard shape: Base UI and Material UI document the same split. Style
			<em>attributes</em> cannot exfiltrate data or execute code the way style elements can, so allowing them is a far
			smaller concession than <code class="text-xs">'unsafe-inline'</code> on elements.
		</p>
	</DocsSection>

	<DocsSection id="hashes" title="Hash-based policies">
		<p>
			Statically hosted sites have no server to mint a per-request nonce. CSP’s alternative is a hash source: allow
			exactly this style block by its SHA-256. That is normally impractical for component libraries, but the library’s
			tag has <em>constant</em> text by design, so its hash is stable for a given release. The quickest way to collect it
			is the browser itself: load a page with the policy enforced and copy the
			<code class="text-xs">sha256-…</code> value Chrome prints in the console violation message into
			<code class="text-xs">style-src</code>. Collect it again when you upgrade the package, because the rule text can
			change between releases.
		</p>
	</DocsSection>
</DocsShell>
