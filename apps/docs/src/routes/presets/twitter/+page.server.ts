import { highlight } from '#lib/presets/shell/highlight.server.js';
import index from '#lib/presets/twitter/index.ts?raw';
import gallery from '#lib/presets/twitter/Gallery.svelte?raw';
import threadPanel from '#lib/presets/twitter/ThreadPanel.svelte?raw';
import trigger from '#lib/presets/twitter/Trigger.svelte?raw';
import icon from '#lib/presets/twitter/Icon.svelte?raw';
import css from '#lib/presets/twitter/lightbox.css?raw';
import demo from '#lib/presets/twitter/Demo.svelte?raw';

export const prerender = true;

export async function load() {
	return {
		files: await highlight([
			{ name: 'index.ts', code: index, group: 'package' },
			{ name: 'Gallery.svelte', code: gallery, group: 'package' },
			{ name: 'ThreadPanel.svelte', code: threadPanel, group: 'package' },
			{ name: 'Trigger.svelte', code: trigger, group: 'package' },
			{ name: 'Icon.svelte', code: icon, group: 'package' },
			{ name: 'lightbox.css', code: css, group: 'package' },
			{
				name: 'Demo.svelte',
				code: demo,
				group: 'example',
				note: 'App composition for the preview, with its own scoped styles. Not part of the package; swap them for your own tokens/CSS.'
			}
		])
	};
}
