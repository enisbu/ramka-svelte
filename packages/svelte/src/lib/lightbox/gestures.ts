export const DISMISS_DISTANCE = 100;
const DISMISS_VELOCITY = 400;
export const DIRECTION_LOCK_DISTANCE = 6;
export const SNAP_DURATION = 270;
const MIN_SCALE = 0.85;
const SNAPBACK_HAPTIC_OVERSHOOT = 0.01;

export type TextDirection = 'ltr' | 'rtl';

export const clamp = (v: number, min: number, max: number) => Math.min(Math.max(v, min), max);

/** Damped pull offset and scale for a raw drag delta (ported from ramka's pull-math). */
export function pullTransform(dx: number, dy: number) {
	const absY = Math.abs(dy);
	const maxY = DISMISS_DISTANCE * 1.2;
	const dampedY = maxY * (1 - Math.exp(-absY / maxY));
	const factor = absY > 0 ? dampedY / absY : 1;
	const maxX = DISMISS_DISTANCE * 0.5;
	const x = Math.sign(dx) * maxX * (1 - Math.exp(-(Math.abs(dx) * factor) / maxX));
	const progress = Math.min(absY / DISMISS_DISTANCE, 1);
	return { x, y: Math.sign(dy) * dampedY, scale: 1 - progress * (1 - MIN_SCALE), progress };
}

/** True when a released pull went far or fast enough in its own direction. */
export function shouldDismiss(dy: number, velocity: number) {
	const same = Math.sign(dy) === Math.sign(velocity) && velocity !== 0;
	return Math.abs(dy) >= DISMISS_DISTANCE || (Math.abs(velocity) >= DISMISS_VELOCITY && same);
}

/** Critically damped spring sampled into a CSS linear() easing. */
export function springEasing(velocity = 0, settle = 7.5, samples = 40) {
	const s = (p: number) => Math.exp(-settle * p) * (1 + (velocity + settle) * p);
	const points = Array.from({ length: samples }, (_, i) =>
		i === samples - 1 ? '1' : String(Math.min(Math.round((1 - s(i / (samples - 1))) * 1e4) / 1e4, 1))
	);
	return `linear(${points.join(', ')})`;
}

/** iOS-style rubber band for an overflow past a bound. */
export function rubberBand(overflow: number, dimension: number) {
	if (dimension <= 0) return 0;
	return Math.sign(overflow) * (1 - 1 / ((Math.abs(overflow) * 0.55) / dimension + 1)) * dimension;
}

/** Wheel delta to zoom factor, capped at 2x per event (ramka's scaleZoom). */
export function scaleZoom(zoom: number, delta: number, sensitivity: number) {
	return zoom * Math.min(1 + Math.abs(delta / sensitivity), 2) ** Math.sign(delta);
}

/** Auto max zoom: the image at its natural pixel size, but at least one step above `min`. */
export function computeMaxZoom(imageW: number, imageH: number, boxW: number, boxH: number, min: number, fallback: number) {
	if (!imageW || !imageH || !boxW || !boxH) return fallback;
	return Math.max(imageW / boxW, imageH / boxH, min + 1);
}

/** 0 at `min`, 1 once zoom rose one step above `min`; drives `--lightbox-zoom-progress`. */
export function zoomProgress(scale: number, min: number, max: number) {
	const range = Math.max(0.01, Math.min(max, min + 1) - min);
	return clamp((scale - min) / range, 0, 1);
}

/** True when a released zoom overshot its bounds enough that the snap back is felt. */
export function isPerceptibleSnapback(zoom: number, min: number, max: number) {
	const bound = clamp(zoom, min, max);
	return Math.abs(zoom - bound) > bound * SNAPBACK_HAPTIC_OVERSHOOT;
}

/** Pan range on one axis that keeps a scaled box covering the viewport, or pinned when it is smaller. */
export function panRange(size: number, center: number, viewStart: number, viewEnd: number) {
	const toStart = viewStart - center + size / 2;
	const toEnd = viewEnd - center - size / 2;
	if (size <= viewEnd - viewStart) {
		const pinned = clamp(0, toStart, toEnd);
		return [pinned, pinned] as const;
	}
	return [toEnd, toStart] as const;
}

/** Slide index step for an arrow key, mirrored horizontally in RTL. */
export function arrowKeyDelta(key: string, dir: TextDirection) {
	const rtl = dir === 'rtl' ? -1 : 1;
	return ({ ArrowRight: rtl, ArrowLeft: -rtl, ArrowDown: 1, ArrowUp: -1 } as Record<string, number>)[key] ?? 0;
}

/** Clamps or wraps an index into `[0, count)`. */
export function resolveIndex(i: number, count: number, loop: boolean) {
	return loop ? ((i % count) + count) % count : clamp(i, 0, count - 1);
}

/** Short vibration on devices that support it. */
export function haptic() {
	try {
		navigator.vibrate?.(10);
	} catch {}
}

/** rAF tween from 0 to 1 with ease-out cubic; returns a cancel function. */
export function tween(duration: number, step: (t: number) => void, done?: () => void) {
	const start = performance.now();
	let frame = requestAnimationFrame(function tick(now) {
		const p = duration > 0 ? Math.min((now - start) / duration, 1) : 1;
		step(1 - Math.pow(1 - p, 3));
		if (p < 1) frame = requestAnimationFrame(tick);
		else done?.();
	});
	return () => cancelAnimationFrame(frame);
}
