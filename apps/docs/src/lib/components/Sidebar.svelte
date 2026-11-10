<script lang="ts">
	import { githubUrl } from '#lib/content/site.js';
	import GitHubIcon from './GitHubIcon.svelte';
	import SidebarNav from './SidebarNav.svelte';
	import ThemeToggle from './ThemeToggle.svelte';
</script>

<aside class="sticky top-0 hidden h-screen w-[17rem] shrink-0 p-2.5 md:block">
	<div
		class="flex h-full flex-col overflow-hidden rounded-xl border border-black/[0.07] bg-neutral-100 shadow-[inset_0_0.5px_0_rgba(255,255,255,0.6),0_1px_2px_rgba(0,0,0,0.04),0_12px_32px_-16px_rgba(0,0,0,0.12)] dark:border-white/[0.08] dark:bg-neutral-900 dark:shadow-[inset_0_0.5px_0_rgba(255,255,255,0.07),0_1px_2px_rgba(0,0,0,0.4),0_12px_32px_-16px_rgba(0,0,0,0.6)]"
	>
		<div class="px-[18px] pt-4 pb-3">
			<div class="flex items-center justify-between gap-3">
				<a
					href="/"
					class="text-[15px] font-semibold tracking-tight text-neutral-900 transition-colors hover:text-neutral-600 dark:text-neutral-50 dark:hover:text-neutral-300"
				>
					ramka
				</a>
				<div class="flex items-center gap-0.5">
					<a
						href={githubUrl}
						target="_blank"
						rel="noreferrer"
						aria-label="ramka for Svelte on GitHub"
						class="inline-flex h-7 w-7 items-center justify-center rounded-full text-neutral-500 transition hover:bg-black/[0.05] hover:text-neutral-900 dark:text-neutral-400 dark:hover:bg-white/[0.08] dark:hover:text-neutral-100"
					>
						<GitHubIcon class="h-4 w-4" />
					</a>
					<ThemeToggle variant="ghost" />
				</div>
			</div>
			<p class="mt-1.5 text-[13px] leading-relaxed text-pretty text-neutral-500 dark:text-neutral-400">The lightbox for Svelte.</p>
		</div>
		<div class="scrollbar-thin min-h-0 flex-1 overflow-y-auto px-2.5 pt-1 pb-5">
			<SidebarNav />
		</div>
	</div>
</aside>
