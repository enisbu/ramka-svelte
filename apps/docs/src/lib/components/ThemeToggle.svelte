<script lang="ts">
	import Moon from '@lucide/svelte/icons/moon';
	import Sun from '@lucide/svelte/icons/sun';

	let { variant = 'outline' }: { variant?: 'outline' | 'ghost' } = $props();
	function toggle() {
		const root = document.documentElement;
		const next = root.classList.contains('dark') ? 'light' : 'dark';
		root.classList.remove('light', 'dark');
		root.classList.add(next);
		root.style.colorScheme = next;
		try {
			localStorage.setItem('theme', next);
		} catch {}
	}
</script>

<button
	type="button"
	aria-label="Toggle theme"
	onclick={toggle}
	class={variant === 'ghost'
		? 'inline-flex h-7 w-7 items-center justify-center rounded-full text-neutral-500 transition hover:bg-black/[0.05] hover:text-neutral-900 dark:text-neutral-400 dark:hover:bg-white/[0.08] dark:hover:text-neutral-100'
		: 'inline-flex h-8 w-8 items-center justify-center rounded-md border border-neutral-200 bg-white text-neutral-700 transition hover:bg-neutral-100 dark:border-neutral-800 dark:bg-neutral-900 dark:text-neutral-300 dark:hover:bg-neutral-800'}
>
	<Sun class="hidden h-4 w-4 dark:block" />
	<Moon class="h-4 w-4 dark:hidden" />
</button>
