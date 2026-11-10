<script lang="ts">
	import Menu from '@lucide/svelte/icons/menu';
	import { githubUrl } from '#lib/content/site.js';
	import Drawer from './Drawer.svelte';
	import GitHubIcon from './GitHubIcon.svelte';
	import SidebarNav from './SidebarNav.svelte';
	import ThemeToggle from './ThemeToggle.svelte';

	let open = $state(false);
	const button =
		'inline-flex h-8 w-8 items-center justify-center rounded-md border border-neutral-200 bg-white text-neutral-700 transition hover:bg-neutral-100 dark:border-neutral-800 dark:bg-neutral-900 dark:text-neutral-300 dark:hover:bg-neutral-800';
</script>

<header
	class="sticky top-0 z-40 border-b border-neutral-200 bg-white md:hidden dark:border-neutral-800 dark:bg-black"
>
	<div class="relative flex h-14 items-center justify-between gap-2 px-6">
		<a
			href="/"
			class="text-sm font-semibold tracking-tight text-neutral-900 hover:text-neutral-600 dark:text-neutral-50 dark:hover:text-neutral-300"
		>
			ramka
		</a>
		<div class="flex items-center gap-2">
			<a
				href={githubUrl}
				target="_blank"
				rel="noreferrer"
				aria-label="ramka for Svelte on GitHub"
				class={button}
			>
				<GitHubIcon class="h-4 w-4" />
			</a>
			<ThemeToggle />
			<button
				type="button"
				aria-label="Open navigation"
				aria-expanded={open}
				class={button}
				onclick={() => (open = true)}
			>
				<Menu class="h-4 w-4" />
			</button>
		</div>
	</div>
</header>

<Drawer bind:open title="ramka" description="The lightbox for Svelte.">
	<div class="min-h-0 flex-1 overflow-y-auto px-4 pt-2 pb-6">
		<SidebarNav onnavigate={() => (open = false)} />
	</div>
</Drawer>
