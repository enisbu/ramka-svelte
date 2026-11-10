<script lang="ts">
	import type { Snippet } from 'svelte';
	import type { HTMLButtonAttributes } from 'svelte/elements';
	import { morphSource } from './morph.js';
	import { getLightbox, type Crossfade } from './state.svelte.js';

	interface Props extends HTMLButtonAttributes {
		index: number;
		crossfade?: Crossfade;
		children?: Snippet;
	}

	let { index, crossfade, children, ...rest }: Props = $props();
	const lb = getLightbox();

	function register(el: HTMLElement) {
		const entry = { el, crossfade };
		const source = morphSource(el);
		lb.triggers.set(index, entry);
		source.setAttribute('data-ramka-morph-source', '');
		return () => {
			if (lb.triggers.get(index) === entry) lb.triggers.delete(index);
			source.removeAttribute('data-ramka-morph-source');
		};
	}
</script>

<button
	type="button"
	aria-haspopup="dialog"
	data-ramka-trigger
	{...rest}
	onclick={(e) => {
		rest.onclick?.(e);
		if (!e.defaultPrevented) lb.show(index);
	}}
	{@attach register}
>
	{@render children?.()}
</button>
