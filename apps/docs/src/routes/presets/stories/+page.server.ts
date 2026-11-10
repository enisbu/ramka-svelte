import { highlight } from '#lib/presets/shell/highlight.server.js';
import index from '#lib/presets/stories/index.ts?raw';
import root from '#lib/presets/stories/Root.svelte?raw';
import trigger from '#lib/presets/stories/Trigger.svelte?raw';
import gallery from '#lib/presets/stories/Gallery.svelte?raw';
import video from '#lib/presets/stories/StoryVideo.svelte?raw';
import css from '#lib/presets/stories/lightbox.css?raw';
import demo from '#lib/presets/stories/Demo.svelte?raw';

export const prerender = true;

export async function load() {
	return {
		files: await highlight([
			{ name: 'index.ts', code: index, group: 'package' },
			{ name: 'Root.svelte', code: root, group: 'package' },
			{ name: 'Trigger.svelte', code: trigger, group: 'package' },
			{ name: 'Gallery.svelte', code: gallery, group: 'package' },
			{ name: 'StoryVideo.svelte', code: video, group: 'package' },
			{ name: 'lightbox.css', code: css, group: 'package' },
			{
				name: 'Demo.svelte',
				code: demo,
				group: 'example',
				note: 'App composition for the preview, with scoped styles. Not part of the package; swap the styles for your own tokens/CSS.'
			}
		])
	};
}
