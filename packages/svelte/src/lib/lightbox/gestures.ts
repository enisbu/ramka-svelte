export const DISMISS_DISTANCE = 100;
export const DISMISS_VELOCITY = 400;
export const DIRECTION_LOCK_DISTANCE = 6;
export const SNAP_DURATION = 270;
const MIN_SCALE = 0.85;

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
