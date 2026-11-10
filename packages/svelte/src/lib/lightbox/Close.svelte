<script lang="ts">
	import type { HTMLButtonAttributes } from 'svelte/elements';
	import { getLightbox } from './state.svelte.js';

	let { children, ...rest }: HTMLButtonAttributes = $props();
	const lb = getLightbox();
</script>

<button
	type="button"
	{...rest}
	onclick={(e) => {
		rest.onclick?.(e);
		if (!e.defaultPrevented) lb.close();
	}}
>
	{@render children?.()}
</button>
