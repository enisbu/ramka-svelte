<script lang="ts">
	import { page } from '$app/state';
	import { navSections, type NavLink } from '#lib/content/nav.js';

	let { onnavigate }: { onnavigate?: () => void } = $props();

	function isActive(link: NavLink) {
		const path = page.url.pathname;
		return link.match === 'prefix' ? path === link.href || path.startsWith(`${link.href}/`) : path === link.href;
	}
</script>

<nav class="space-y-6">
	{#each navSections as section (section.title)}
		<div>
			<div class="px-2.5 pb-1.5 text-[11px] font-semibold text-neutral-400 dark:text-neutral-500">{section.title}</div>
			<ul class="flex flex-col gap-0.5">
				{#each section.links as link (link.href)}
					{@const active = isActive(link)}
					<li>
						<a
							href={link.href}
							onclick={onnavigate}
							aria-current={active ? 'page' : undefined}
							class={[
								'block rounded-lg px-2.5 py-[5px] text-[13px] leading-6 transition-colors',
								active
									? 'bg-white font-medium text-neutral-900 shadow-[0_0.5px_1px_rgba(0,0,0,0.08),0_1px_3px_rgba(0,0,0,0.06)] dark:bg-neutral-800 dark:text-neutral-50 dark:shadow-[0_0.5px_1px_rgba(0,0,0,0.4),inset_0_0.5px_0_rgba(255,255,255,0.08)]'
									: 'text-neutral-600 hover:bg-black/[0.04] hover:text-neutral-900 dark:text-neutral-400 dark:hover:bg-white/[0.06] dark:hover:text-neutral-100'
							]}
						>
							{link.title}
						</a>
					</li>
				{/each}
			</ul>
		</div>
	{/each}
</nav>
