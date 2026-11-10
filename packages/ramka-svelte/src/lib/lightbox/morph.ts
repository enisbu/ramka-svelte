export type MorphPreset = 'default' | 'snappy' | 'relaxed' | 'spring';

export const PRESETS: Record<MorphPreset, { duration: number; easing: string }> = {
	default: { duration: 360, easing: 'cubic-bezier(0.44, 0.58, 0, 1)' },
	snappy: { duration: 340, easing: 'cubic-bezier(0.38, 0.66, 0, 1)' },
	relaxed: { duration: 400, easing: 'cubic-bezier(0.48, 0.5, 0, 1)' },
	spring: { duration: 450, easing: 'cubic-bezier(0.22, 1, 0.36, 1)' }
};

const NAME = 'lightbox-morph';
const ROOT_EASING = 'cubic-bezier(0.16, 1, 0.3, 1)';
const CLOSE_EASING = 'cubic-bezier(0.22, 0, 0.35, 1)';

/** True when the browser can run the morph and the user allows motion. */
export function canMorph() {
	return (
		typeof document !== 'undefined' &&
		'startViewTransition' in document &&
		!matchMedia('(prefers-reduced-motion: reduce)').matches
	);
}

/** The element whose pixels bridge the morph inside a trigger or item. */
export function morphSource(el: HTMLElement) {
	return el.querySelector<HTMLElement>('[data-ramka-morph], [data-ramka-media], img, video') ?? el;
}

interface MorphOptions {
	phase: 'opening' | 'closing';
	preset: MorphPreset;
	crossfade: boolean;
	from: HTMLElement;
	update: () => HTMLElement | null | Promise<HTMLElement | null>;
}

/** Runs one shared-element view transition from `from` to whatever `update` returns. */
export async function morph({ phase, preset, crossfade, from, update }: MorphOptions) {
	const html = document.documentElement;
	const [triggerVar, itemVar] =
		phase === 'opening'
			? ['--lightbox-morph-radius-trigger', '--lightbox-morph-radius-item']
			: ['--lightbox-morph-radius-item', '--lightbox-morph-radius-trigger'];
	let to: HTMLElement | null = null;

	html.setAttribute('data-ramka-view-transition', phase);
	html.setAttribute('data-ramka-vt-preset', preset);
	html.toggleAttribute('data-ramka-crossfade', crossfade);
	html.style.setProperty(triggerVar, getComputedStyle(from).borderRadius);
	from.style.setProperty('view-transition-name', NAME);

	const transition = document.startViewTransition(async () => {
		from.style.removeProperty('view-transition-name');
		to = await update();
		if (!to) return;
		html.style.setProperty(itemVar, getComputedStyle(to).borderRadius);
		to.style.setProperty('view-transition-name', NAME);
	});

	try {
		await transition.finished;
	} finally {
		(to as HTMLElement | null)?.style.removeProperty('view-transition-name');
		html.removeAttribute('data-ramka-view-transition');
		html.removeAttribute('data-ramka-vt-preset');
		html.removeAttribute('data-ramka-crossfade');
		html.style.removeProperty(triggerVar);
		html.style.removeProperty(itemVar);
	}
}

/** Resolves once the image inside `el` is decoded, capped at `cap` ms. */
export function decoded(el: HTMLElement, cap = 200) {
	const img = el instanceof HTMLImageElement ? el : el.querySelector('img');
	if (!img || img.complete) return Promise.resolve();
	return Promise.race([img.decode().catch(() => {}), new Promise((r) => setTimeout(r, cap))]);
}

const presetRules = Object.entries(PRESETS)
	.map(
		([name, p]) => `:root[data-ramka-vt-preset="${name}"]::view-transition {
  --lightbox-vt-duration: ${p.duration}ms;
  --lightbox-vt-easing: ${p.easing};
}`
	)
	.join('\n');

const duration = `var(--lightbox-vt-duration, ${PRESETS.default.duration}ms)`;
const easing = `var(--lightbox-vt-easing, ${PRESETS.default.easing})`;

const CSS = `
${presetRules}
:root[data-ramka-view-transition="opening"]::view-transition {
  --lightbox-morph-new-opacity: 1;
  --lightbox-morph-border-radius-from: var(--lightbox-morph-radius-trigger, 0px);
  --lightbox-morph-border-radius-to: var(--lightbox-morph-radius-item, 0px);
}
:root[data-ramka-view-transition="closing"]::view-transition {
  --lightbox-morph-new-opacity: 0;
  --lightbox-morph-border-radius-from: var(--lightbox-morph-radius-item, 0px);
  --lightbox-morph-border-radius-to: var(--lightbox-morph-radius-trigger, 0px);
}
[data-ramka-morph-source] { transition: opacity 200ms; }
[data-ramka-morph-source][data-morph-target] { opacity: 0; }
:root[data-ramka-view-transition] [data-ramka-morph-source] { transition: none; }

@media (prefers-reduced-motion: no-preference) {
  :root[data-ramka-view-transition]::view-transition-old(root),
  :root[data-ramka-view-transition]::view-transition-new(root) {
    animation-duration: ${duration};
    animation-timing-function: ${ROOT_EASING};
  }
  @keyframes ramka-morph-radius {
    to { border-radius: var(--lightbox-morph-border-radius-to, 0px); }
  }
  ::view-transition-group(${NAME}) {
    overflow: hidden;
    border-radius: var(--lightbox-morph-border-radius-from, 0px);
    animation-name: -ua-view-transition-group-anim-${NAME}, ramka-morph-radius;
    animation-duration: ${duration};
    animation-timing-function: ${easing};
    animation-fill-mode: both;
    z-index: 2;
  }
  ::view-transition-old(${NAME}),
  ::view-transition-new(${NAME}) {
    object-fit: cover;
    width: 100%;
    height: 100%;
    animation: none !important;
    mix-blend-mode: normal;
  }
  ::view-transition-old(${NAME}) { opacity: 1; }
  ::view-transition-new(${NAME}) { opacity: var(--lightbox-morph-new-opacity, 0); }
  :root[data-ramka-crossfade]::view-transition-old(${NAME}),
  :root[data-ramka-crossfade]::view-transition-new(${NAME}) {
    object-fit: fill;
    mix-blend-mode: plus-lighter;
    animation: revert !important;
    animation-duration: calc(${duration} * 0.48) !important;
    animation-timing-function: ${easing} !important;
    animation-fill-mode: both !important;
    opacity: revert;
  }
  :root[data-ramka-view-transition="closing"][data-ramka-crossfade]::view-transition-old(${NAME}),
  :root[data-ramka-view-transition="closing"][data-ramka-crossfade]::view-transition-new(${NAME}) {
    animation-timing-function: ${CLOSE_EASING} !important;
  }
}

:where([data-ramka-slides]) {
  position: relative;
  display: flex;
  overflow-x: auto;
  overflow-y: hidden;
  scroll-snap-type: x mandatory;
  scrollbar-width: none;
  overscroll-behavior: contain;
  touch-action: pan-x;
  container-type: size;
}
:where([data-ramka-slides])::-webkit-scrollbar { display: none; }
:where([data-ramka-slides][data-locked]) { overflow-x: hidden; }
:where([data-ramka-slide]) {
  flex: 0 0 100%;
  min-width: 100%;
  scroll-snap-align: center;
  scroll-snap-stop: always;
}
:where([data-ramka-thumbnail-strip]) { position: relative; overflow: clip; }
:where([data-ramka-thumbnail-strip-track]) { position: relative; display: flex; width: max-content; will-change: transform; }
:where([data-ramka-item]) { position: relative; width: 100%; height: 100%; container-type: size; }
:where([data-ramka-zoom]) {
  width: 100%;
  height: 100%;
  display: grid;
  place-items: center;
  container-type: size;
}
:where([data-ramka-zoom][data-zoomed]) { touch-action: none; cursor: grab; }
:where([data-ramka-zoom-content]) { display: grid; transform-origin: center; }
:where([data-ramka-zoom][data-zoomed] > [data-ramka-zoom-content]) { will-change: transform; }
:where([data-ramka-media]) { display: grid; max-width: 100cqw; max-height: 100cqh; }
:where([data-ramka-media][data-sized]) {
  width: min(100cqw, 100cqh * var(--ramka-ratio));
  aspect-ratio: var(--ramka-ratio);
}
:where([data-ramka-media]) > :where(img, video) {
  grid-area: 1 / 1;
  max-width: 100cqw;
  max-height: 100cqh;
  user-select: none;
  -webkit-user-drag: none;
}
:where([data-ramka-media][data-sized]) > :where(img, video) {
  width: 100%;
  height: 100%;
  object-fit: cover;
}
`;

/** Inserts the structural and morph stylesheet once, ahead of consumer CSS. */
export function ensureStyles() {
	if (typeof document === 'undefined' || document.querySelector('style[data-ramka]')) return;
	const style = document.createElement('style');
	style.setAttribute('data-ramka', '');
	style.textContent = CSS;
	document.head.prepend(style);
}
