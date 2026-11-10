<script lang="ts">
	import type { HTMLAttributes } from 'svelte/elements';
	import { getLightbox } from './state.svelte.js';

	let props: HTMLAttributes<HTMLDivElement> = $props();
	const lb = getLightbox();
</script>

<div
	aria-hidden="true"
	data-ramka-backdrop
	data-open={lb.open || undefined}
	data-closed={!lb.open || undefined}
	data-pulling={lb.pulling || undefined}
	{...props}
></div>
