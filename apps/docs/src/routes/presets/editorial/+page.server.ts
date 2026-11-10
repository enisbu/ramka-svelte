import { highlight } from '#lib/presets/shell/highlight.server.js';
import index from '#lib/presets/editorial/index.ts?raw';
import gallery from '#lib/presets/editorial/Gallery.svelte?raw';
import trigger from '#lib/presets/editorial/Trigger.svelte?raw';
import portal from '#lib/presets/editorial/Portal.svelte?raw';
import backdrop from '#lib/presets/editorial/Backdrop.svelte?raw';
import content from '#lib/presets/editorial/Content.svelte?raw';
import close from '#lib/presets/editorial/Close.svelte?raw';
import slides from '#lib/presets/editorial/Slides.svelte?raw';
import slide from '#lib/presets/editorial/Slide.svelte?raw';
import item from '#lib/presets/editorial/Item.svelte?raw';
import media from '#lib/presets/editorial/Media.svelte?raw';
import counter from '#lib/presets/editorial/Counter.svelte?raw';
import caption from '#lib/presets/editorial/Caption.svelte?raw';
import previous from '#lib/presets/editorial/Previous.svelte?raw';
import next from '#lib/presets/editorial/Next.svelte?raw';
import css from '#lib/presets/editorial/lightbox.css?raw';
import demo from '#lib/presets/editorial/Demo.svelte?raw';

export const prerender = true;

export async function load() {
	return {
		files: await highlight([
			{ name: 'index.ts', code: index, group: 'package' },
			{ name: 'Gallery.svelte', code: gallery, group: 'package' },
			{ name: 'Trigger.svelte', code: trigger, group: 'package' },
			{ name: 'Portal.svelte', code: portal, group: 'package' },
			{ name: 'Backdrop.svelte', code: backdrop, group: 'package' },
			{ name: 'Content.svelte', code: content, group: 'package' },
			{ name: 'Slides.svelte', code: slides, group: 'package' },
			{ name: 'Slide.svelte', code: slide, group: 'package' },
			{ name: 'Item.svelte', code: item, group: 'package' },
			{ name: 'Media.svelte', code: media, group: 'package' },
			{ name: 'Counter.svelte', code: counter, group: 'package' },
			{ name: 'Caption.svelte', code: caption, group: 'package' },
			{ name: 'Close.svelte', code: close, group: 'package' },
			{ name: 'Previous.svelte', code: previous, group: 'package' },
			{ name: 'Next.svelte', code: next, group: 'package' },
			{ name: 'lightbox.css', code: css, group: 'package' },
			{
				name: 'Demo.svelte',
				code: demo,
				group: 'example',
				note: 'App composition for the preview. Not part of the package; import the styled Lightbox from ./index.js and swap the scoped styles for your own tokens.'
			}
		])
	};
}
