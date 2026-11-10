import { error } from '@sveltejs/kit';
import { interceptedPhotos } from '#lib/examples/intercepted-routes/photos.js';
import type { EntryGenerator, PageLoad } from './$types';

export const entries: EntryGenerator = () => interceptedPhotos.map((photo) => ({ id: photo.id }));

export const load: PageLoad = ({ params }) => {
	const photo = interceptedPhotos.find((p) => p.id === params.id);
	if (!photo) error(404, 'Photo not found');
	return { photo };
};
