import { highlight } from '#lib/presets/shell/highlight.server.js';
import index from '#lib/presets/default/index.ts?raw';
import gallery from '#lib/presets/default/Gallery.svelte?raw';
import trigger from '#lib/presets/default/Trigger.svelte?raw';
import css from '#lib/presets/default/lightbox.css?raw';
import demo from '#lib/presets/default/Demo.svelte?raw';

export const prerender = true;

export async function load() {
	return {
		files: await highlight([
			{ name: 'index.ts', code: index, group: 'package' },
			{ name: 'Gallery.svelte', code: gallery, group: 'package' },
			{ name: 'Trigger.svelte', code: trigger, group: 'package' },
			{ name: 'lightbox.css', code: css, group: 'package' },
			{
				name: 'Demo.svelte',
				code: demo,
				group: 'example',
				note: 'App composition for the preview. Not part of the package; import the styled Lightbox from ./index.js and compose triggers like this.'
			}
		])
	};
}
