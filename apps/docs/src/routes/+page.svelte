<script lang="ts">
	import GitHubIcon from '#lib/components/GitHubIcon.svelte';
	import InstallCommand from '#lib/components/InstallCommand.svelte';
	import SiteFooter from '#lib/components/SiteFooter.svelte';
	import SiteHeader from '#lib/components/SiteHeader.svelte';
	import { githubUrl, upstream } from '#lib/content/site.js';
	import ApplesToApples from '#lib/home/ApplesToApples.svelte';
	import FeaturesBento from '#lib/home/FeaturesBento.svelte';
	import FramedTestimonial from '#lib/home/FramedTestimonial.svelte';
	import LandingDemo from '#lib/home/LandingDemo.svelte';

	const description =
		'Headless Svelte lightbox with View Transitions morph animations, pinch to zoom, swipe navigation, and pull to dismiss. A Svelte 5 port of ramka by Artur Bień.';
	const credit =
		'text-neutral-500 underline decoration-neutral-300 underline-offset-2 transition hover:text-neutral-900 dark:text-neutral-400 dark:decoration-neutral-700 dark:hover:text-neutral-100';
</script>

<svelte:head>
	<title>ramka for Svelte, the lightbox for Svelte</title>
	<meta name="description" content={description} />
	<meta property="og:title" content="ramka for Svelte" />
	<meta property="og:description" content={description} />
	<meta property="og:image" content="/og.png" />
</svelte:head>

<div class="isolate flex min-h-screen flex-col">
	<SiteHeader />
	<main class="flex-1">
		<section class="mx-auto w-full max-w-3xl px-6 pt-16 text-center md:pt-24">
			<h1
				class="text-5xl font-semibold tracking-tight text-balance text-neutral-950 md:text-7xl dark:text-neutral-50"
			>
				The lightbox for&nbsp;Svelte.
			</h1>
			<p
				class="mx-auto mt-6 max-w-xl text-lg leading-relaxed text-pretty text-neutral-500 md:text-xl dark:text-neutral-400"
			>
				Unstyled, accessible primitives built on native scrolling and view transitions. Morph,
				swipe, zoom, and pull-to-dismiss, all out of the box.
			</p>
			<div class="mt-10 flex flex-wrap items-center justify-center gap-3">
				<a
					href="/docs"
					class="inline-flex h-11 items-center rounded-full bg-neutral-900 px-4 text-sm font-medium text-white transition hover:bg-neutral-700 dark:bg-neutral-50 dark:text-neutral-900 dark:hover:bg-neutral-300"
				>
					Documentation
				</a>
				<a
					href={githubUrl}
					target="_blank"
					rel="noreferrer"
					class="inline-flex h-11 items-center gap-2 rounded-full border border-neutral-200 px-4 text-sm font-medium text-neutral-900 transition hover:bg-neutral-100 dark:border-neutral-800 dark:text-neutral-50 dark:hover:bg-neutral-900"
				>
					<GitHubIcon class="h-4 w-4" />
					GitHub
				</a>
			</div>
			<div class="mt-5"><InstallCommand /></div>
		</section>

		<section class="mx-auto w-full max-w-5xl px-6 pt-16 pb-24 md:pt-24">
			<p class="mb-6 text-center text-sm text-neutral-400 dark:text-neutral-600">
				Click any image. Swipe, pinch to zoom, pull to dismiss.
			</p>
			<LandingDemo />
			<p
				class="mx-auto mt-14 max-w-xl text-center text-sm leading-6 text-pretty text-neutral-400 md:mt-20 dark:text-neutral-500"
			>
				A Svelte 5 port of <a href={upstream.site} target="_blank" rel="noreferrer" class={credit}
					>ramka</a
				>, the React lightbox by
				<a href={upstream.authorUrl} target="_blank" rel="noreferrer" class={credit}
					>{upstream.author}</a
				>, ported with his blessing. Using React? Install
				<a href={upstream.npm} target="_blank" rel="noreferrer" class={credit}>@ramka/react</a>.
			</p>
		</section>

		<FeaturesBento />
		<FramedTestimonial />
		<ApplesToApples />
	</main>
	<SiteFooter />
</div>
