import { error } from '@sveltejs/kit';
import type { RequestHandler } from './$types';

export const prerender = false;

/** Redirects to a local photo after a delay so the morph handoff to a late image is visible. */
export const GET: RequestHandler = async ({ url }) => {
	const src = url.searchParams.get('url') ?? '';
	if (!src.startsWith('/photos/')) error(400, 'Only local photos');
	const ms = Math.min(Number(url.searchParams.get('ms')) || 500, 3000);
	await new Promise((resolve) => setTimeout(resolve, ms));
	return new Response(null, {
		status: 307,
		headers: { location: src, 'cache-control': 'no-store' }
	});
};
