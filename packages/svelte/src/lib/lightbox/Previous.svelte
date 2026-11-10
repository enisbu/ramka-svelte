<script lang="ts">
	import type { HTMLButtonAttributes } from 'svelte/elements';
	import { warnUnnamed } from './dom.js';
	import { getLightbox } from './state.svelte.js';

	let { children, ...rest }: HTMLButtonAttributes = $props();
	const lb = getLightbox();
</script>

<button
	type="button"
	disabled={!lb.canPrev}
	data-ramka-previous
	data-disabled={!lb.canPrev || undefined}
	{...rest}
	onclick={(e) => {
		rest.onclick?.(e);
		if (!e.defaultPrevented) lb.go(lb.index - 1, 'button');
	}}
	{@attach warnUnnamed('Lightbox.Previous')}
>
	{@render children?.()}
</button>
