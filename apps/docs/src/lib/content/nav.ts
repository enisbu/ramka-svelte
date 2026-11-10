export interface NavLink {
	href: string;
	title: string;
	description?: string;
	match?: 'exact' | 'prefix';
}

export interface NavSection {
	title: string;
	links: NavLink[];
}

/** Lightbox guide pages, in sidebar and pager order. */
export const docsPages = {
	overview: { href: '/docs/lightbox', title: 'Overview' },
	stateLifecycle: { href: '/docs/lightbox/state-lifecycle', title: 'State & lifecycle' },
	composition: { href: '/docs/lightbox/composition', title: 'Composition' },
	images: { href: '/docs/lightbox/sveltekit-images', title: 'SvelteKit images' },
	viewTransitions: { href: '/docs/lightbox/view-transitions', title: 'View transitions' },
	gestures: { href: '/docs/lightbox/gestures', title: 'Gestures' },
	zoom: { href: '/docs/lightbox/zoom', title: 'Zoom & a11y' },
	rtl: { href: '/docs/lightbox/rtl', title: 'RTL support' },
	csp: { href: '/docs/lightbox/csp', title: 'Content Security Policy' },
	api: { href: '/docs/lightbox/api', title: 'API reference' }
} satisfies Record<string, NavLink>;

/** Ordered pager trail for the lightbox guides. */
export const pagerOrder: NavLink[] = Object.values(docsPages);

/** Previous and next guide for a page path. */
export function pagerFor(href: string) {
	const i = pagerOrder.findIndex((page) => page.href === href);
	return { prev: pagerOrder[i - 1], next: pagerOrder[i + 1] };
}

const api = docsPages.api.href;

/** Deep links into API reference sections. */
export const apiHref = {
	root: `${api}#api-root`,
	trigger: `${api}#api-trigger`,
	portal: `${api}#api-portal`,
	backdrop: `${api}#api-backdrop`,
	content: `${api}#api-content`,
	stage: `${api}#api-stage`,
	slides: `${api}#api-slides`,
	slide: `${api}#api-slide`,
	item: `${api}#api-item`,
	zoom: `${api}#api-zoom`,
	media: `${api}#api-media`,
	close: `${api}#api-close`,
	previous: `${api}#api-previous`,
	next: `${api}#api-next`,
	zoomIn: `${api}#api-zoom-in`,
	zoomOut: `${api}#api-zoom-out`,
	counter: `${api}#api-counter`,
	caption: `${api}#api-caption`,
	thumbnailGroup: `${api}#api-thumbnail-group`,
	thumbnail: `${api}#api-thumbnail`,
	thumbnailStrip: `${api}#api-thumbnail-strip`,
	thumbnailStripTrack: `${api}#api-thumbnail-strip-track`,
	cspProvider: `${api}#api-csp-provider`,
	createHandle: `${api}#api-create-handle`,
	zoomRef: `${api}#api-zoom-ref`,
	documentVt: `${api}#api-view-transition-document`,
	context: `${api}#context`,
	types: `${api}#types`
};

/** Preset demos built by the presets pages. */
export const presets: NavLink[] = [
	{ href: '/presets/default', title: 'Default', description: 'Docs-demo chrome as a copy-paste design-system Lightbox' },
	{ href: '/presets/twitter', title: 'Twitter', description: 'Split media + thread sidebar with translucent backdrop and edge nav' },
	{ href: '/presets/store', title: 'Store', description: 'Commerce viewer: thumbnail rail + buy panel with price, highlights, and CTA' },
	{ href: '/presets/editorial', title: 'Editorial', description: 'Newsroom article-figure viewer: near-black surface, caption + credit block' },
	{ href: '/presets/stories', title: 'Stories', description: 'Avatar tray that crossfades into 9:16 video with a scroll-driven 3D page-turn' }
];

/** Example pages, same slugs as ramka.dev. */
export const examples: NavLink[] = [
	['photos-app', 'Photos app'],
	['photos-app-rtl', 'Photos app (RTL)'],
	['infinite-scroll', 'Infinite scroll'],
	['url-synced-state', 'URL-synced state'],
	['intercepted-routes', 'Intercepted routes'],
	['text-message', 'Text message'],
	['film-trailers', 'Film trailers'],
	['3d-models', '3D models']
].map(([slug, title]) => ({ href: `/examples/lightbox/${slug}`, title, match: 'prefix' as const }));

/** Sidebar sections. */
export const navSections: NavSection[] = [
	{ title: 'Getting started', links: [{ href: '/docs', title: 'Installation' }] },
	{ title: 'Lightbox', links: pagerOrder },
	{ title: 'Presets', links: presets },
	{ title: 'Examples', links: examples }
];
