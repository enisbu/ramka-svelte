<script lang="ts">
	import type { Snippet } from 'svelte';
	import type { HTMLAttributes } from 'svelte/elements';
	import { getItem } from './state.svelte.js';

	interface Props extends HTMLAttributes<HTMLDivElement> {
		width?: number;
		height?: number;
		children?: Snippet;
	}

	let { width, height, children, ...rest }: Props = $props();
	const item = getItem();
	let intrinsic = $state<number>();
	const ratio = $derived(width && height ? width / height : intrinsic);

	function media(el: HTMLElement) {
		item.setMedia(el);
		const img = el.querySelector('img, video') as HTMLImageElement | HTMLVideoElement | null;
		const read = () => {
			const w = img instanceof HTMLImageElement ? img.naturalWidth || img.width : img?.videoWidth;
			const h = img instanceof HTMLImageElement ? img.naturalHeight || img.height : img?.videoHeight;
			if (w && h) intrinsic = w / h;
		};
		read();
		img?.addEventListener('load', read);
		img?.addEventListener('loadedmetadata', read);
		return () => {
			item.setMedia(null);
			img?.removeEventListener('load', read);
			img?.removeEventListener('loadedmetadata', read);
		};
	}
</script>

<div data-ramka-media data-sized={ratio ? '' : undefined} style:--ramka-ratio={ratio} {...rest} {@attach media}>
	{@render children?.()}
</div>
