<script lang="ts">
	import '../app.css';
	import { page } from '$app/state';
	import MobileNav from '#lib/components/MobileNav.svelte';
	import Sidebar from '#lib/components/Sidebar.svelte';
	import type { LayoutProps } from './$types';

	let { children }: LayoutProps = $props();
	const docsShell = $derived(/^\/(docs|presets|examples)(\/|$)/.test(page.url.pathname));
</script>

{#if docsShell}
	<div class="isolate flex min-h-screen">
		<Sidebar />
		<div class="flex min-w-0 flex-1 flex-col">
			<MobileNav />
			<main class="min-w-0 flex-1">{@render children()}</main>
		</div>
	</div>
{:else}
	{@render children()}
{/if}
