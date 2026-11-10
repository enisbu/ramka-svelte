<script lang="ts">
	import type { ComponentProps } from 'svelte';
	import Kbd from './kbd.svelte';

	let { label, children, ...restProps }: ComponentProps<typeof Kbd> & { label: string } = $props();
</script>

<Kbd {...restProps}>
	<span aria-hidden="true" class="contents">{@render children?.()}</span>
	<span class="sr-only">{label}</span>
</Kbd>
