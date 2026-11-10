import { error } from '@sveltejs/kit';
import { galleryPhotos } from '#lib/examples/url-synced-state/photos.js';
import type { EntryGenerator, PageLoad } from './$types';

export const entries: EntryGenerator = () => [{ id: '' }, ...galleryPhotos.map((photo) => ({ id: photo.id }))];

export const load: PageLoad = ({ params }) => {
	const photo = params.id ? galleryPhotos.find((p) => p.id === params.id) : undefined;
	if (params.id && !photo) error(404, 'Photo not found');
	return { photo };
};
