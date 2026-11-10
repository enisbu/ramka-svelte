import { clamp, haptic, isPerceptibleSnapback, panRange, rubberBand, scaleZoom, tween } from './gestures.js';

type Point = { x: number; y: number };

export interface ZoomOptions {
	min: number;
	max: number;
	step: number;
	scrollToZoom: boolean;
	wheelSensitivity: number;
	doubleClickDelay: number;
	panDistance: number;
	panViewport(): HTMLElement;
}

export interface ZoomEvents {
	onchange(scale: number): void;
	ondrag(dragging: boolean): void;
	onpinch(pinching: boolean): void;
}

const DOUBLE_TAP_DISTANCE = 50;
const TAP_MOVE = 10;
const WHEEL_IDLE = 150;

/** Pinch, pan, double tap, ctrl+wheel and discrete zoom for one media box. */
export class ZoomController {
	scale: number;
	x = 0;
	y = 0;
	#pointers = new Map<number, Point>();
	#gesture: { scale: number; x: number; y: number; mid: Point; distance: number } | null = null;
	#velocity: Point & { t: number } = { x: 0, y: 0, t: 0 };
	#lastTap = { t: 0, x: 0, y: 0 };
	#downAt: Point = { x: 0, y: 0 };
	#cancel = () => {};
	#pointerType = '';
	#dragging = false;
	#pinched = false;
	#wheelTimer = 0;
	viewport: HTMLElement;
	content: HTMLElement;
	options: () => ZoomOptions;
	events: ZoomEvents;

	constructor(viewport: HTMLElement, content: HTMLElement, options: () => ZoomOptions, events: ZoomEvents) {
		this.viewport = viewport;
		this.content = content;
		this.options = options;
		this.events = events;
		this.scale = options().min;
	}

	get panDistance() {
		return this.options().panDistance;
	}

	#local(e: { clientX: number; clientY: number }): Point {
		const r = this.viewport.getBoundingClientRect();
		return { x: e.clientX - r.left - r.width / 2, y: e.clientY - r.top - r.height / 2 };
	}

	#view() {
		return this.options().panViewport().getBoundingClientRect();
	}

	#bounds(scale = this.scale) {
		const v = this.#view();
		const z = this.viewport.getBoundingClientRect();
		return {
			x: panRange(this.content.offsetWidth * scale, z.left + z.width / 2, v.left, v.right),
			y: panRange(this.content.offsetHeight * scale, z.top + z.height / 2, v.top, v.bottom)
		};
	}

	#render() {
		this.content.style.transform = `translate3d(${this.x}px, ${this.y}px, 0) scale(${this.scale})`;
		this.events.onchange(this.scale);
	}

	#set(scale: number, x: number, y: number) {
		[this.scale, this.x, this.y] = [scale, x, y];
		this.#render();
	}

	#clamped(scale: number, x: number, y: number) {
		const { min, max } = this.options();
		const s = clamp(scale, min, max);
		const b = this.#bounds(s);
		return [s, clamp(x, ...b.x), clamp(y, ...b.y)] as const;
	}

	#drag(on: boolean) {
		if (this.#dragging !== on) this.events.ondrag((this.#dragging = on));
	}

	#pinch(on: boolean) {
		if (this.#pinched !== on) this.events.onpinch((this.#pinched = on));
	}

	animateTo(scale: number, x: number, y: number, duration = 300) {
		this.#cancel();
		const [s, tx, ty] = this.#clamped(scale, x, y);
		const from = { s: this.scale, x: this.x, y: this.y };
		this.#cancel = tween(duration, (p) =>
			this.#set(from.s + (s - from.s) * p, from.x + (tx - from.x) * p, from.y + (ty - from.y) * p)
		);
	}

	zoomAt(scale: number, focal: Point = { x: 0, y: 0 }, duration?: number) {
		const { min, max } = this.options();
		const s = clamp(scale, min, max);
		const ratio = s / this.scale;
		this.animateTo(s, focal.x - (focal.x - this.x) * ratio, focal.y - (focal.y - this.y) * ratio, duration);
	}

	zoomIn = () => this.zoomAt(this.scale * this.options().step);
	zoomOut = () => this.zoomAt(this.scale / this.options().step);
	zoomTo = (target: number, { rapid = false, dx = 0, dy = 0 } = {}) =>
		this.zoomAt(target, { x: dx, y: dy }, rapid ? 0 : undefined);
	reset = (rapid = false) => this.animateTo(this.options().min, 0, 0, rapid ? 0 : 300);
	pan = (dx: number, dy: number) => this.animateTo(this.scale, this.x + dx, this.y + dy, 200);

	#startGesture() {
		const [a, b] = [...this.#pointers.values()];
		this.#gesture = {
			scale: this.scale,
			x: this.x,
			y: this.y,
			mid: b ? { x: (a.x + b.x) / 2, y: (a.y + b.y) / 2 } : a,
			distance: b ? Math.hypot(a.x - b.x, a.y - b.y) : 0
		};
	}

	onpointerdown = (e: PointerEvent) => {
		const { min } = this.options();
		this.#pointerType = e.pointerType;
		if (e.isPrimary) this.#pointers.clear();
		if (e.pointerType === 'mouse' && (e.button !== 0 || this.scale <= min)) return;
		this.#pointers.set(e.pointerId, this.#local(e));
		if (this.#pointers.size > 2) return;
		if (this.#pointers.size === 2 || this.scale > min) {
			e.stopPropagation();
			this.viewport.setPointerCapture(e.pointerId);
		}
		if (this.#pointers.size === 2) this.#pinch(true);
		this.#cancel();
		this.#downAt = this.#local(e);
		this.#velocity = { x: 0, y: 0, t: e.timeStamp };
		this.#startGesture();
	};

	onpointermove = (e: PointerEvent) => {
		if (!this.#pointers.has(e.pointerId) || !this.#gesture) return;
		this.#pointers.set(e.pointerId, this.#local(e));
		const { min, max } = this.options();
		const g = this.#gesture;
		const [a, b] = [...this.#pointers.values()];
		if (b) {
			e.stopPropagation();
			const mid = { x: (a.x + b.x) / 2, y: (a.y + b.y) / 2 };
			const raw = (g.scale * Math.hypot(a.x - b.x, a.y - b.y)) / (g.distance || 1);
			const scale = raw < min ? min - rubberBand(min - raw, min) : raw > max ? max + rubberBand(raw - max, max) : raw;
			const ratio = scale / g.scale;
			this.#set(scale, mid.x - (g.mid.x - g.x) * ratio, mid.y - (g.mid.y - g.y) * ratio);
			return;
		}
		if (this.scale <= min) return;
		e.stopPropagation();
		this.#drag(true);
		const v = this.#view();
		const bounds = this.#bounds();
		const tx = g.x + a.x - g.mid.x;
		const ty = g.y + a.y - g.mid.y;
		const dt = Math.max(e.timeStamp - this.#velocity.t, 1);
		this.#velocity = { x: ((tx - this.x) / dt) * 1000, y: ((ty - this.y) / dt) * 1000, t: e.timeStamp };
		const soft = (value: number, [lo, hi]: readonly [number, number], dim: number) =>
			value < lo ? lo + rubberBand(value - lo, dim) : value > hi ? hi + rubberBand(value - hi, dim) : value;
		this.#set(this.scale, soft(tx, bounds.x, v.width), soft(ty, bounds.y, v.height));
	};

	onpointerup = (e: PointerEvent) => {
		if (!this.#pointers.delete(e.pointerId)) return;
		const point = this.#local(e);
		if (this.#pointers.size === 1) return this.#startGesture();
		const { min, max } = this.options();
		const pinched = this.#pinched;
		this.#gesture = null;
		this.#drag(false);
		this.#pinch(false);
		if (pinched && isPerceptibleSnapback(this.scale, min, max)) haptic();
		if (this.scale === min && this.x === 0 && this.y === 0) return;
		const moved = Math.hypot(point.x - this.#downAt.x, point.y - this.#downAt.y) > TAP_MOVE;
		if (e.pointerType !== 'mouse' && !moved && e.type === 'pointerup') return this.#tap(e, point);
		const fresh = e.timeStamp - this.#velocity.t < 100;
		const vx = fresh ? this.#velocity.x : 0;
		const vy = fresh ? this.#velocity.y : 0;
		this.animateTo(this.scale, this.x + vx * 0.25, this.y + vy * 0.25, 400);
	};

	#tap(e: PointerEvent, point: Point) {
		const { min, max, doubleClickDelay } = this.options();
		const last = this.#lastTap;
		const double =
			e.timeStamp - last.t < doubleClickDelay && Math.hypot(point.x - last.x, point.y - last.y) < DOUBLE_TAP_DISTANCE;
		this.#lastTap = double ? { t: 0, x: 0, y: 0 } : { t: e.timeStamp, ...point };
		if (double) this.toggle(point);
		else if (this.scale !== clamp(this.scale, min, max)) this.animateTo(this.scale, this.x, this.y);
	}

	/** Double tap: zoom to one step at `point`, or back to rest when already zoomed. */
	toggle(point: Point) {
		const { min, max, step } = this.options();
		if (this.scale > min + 0.01) this.reset();
		else this.zoomAt(Math.min(step, max), point);
	}

	ondblclick = (e: MouseEvent) => {
		if (this.#pointerType === 'mouse') this.toggle(this.#local(e));
	};

	onwheel = (e: WheelEvent) => {
		const { min, max, scrollToZoom, wheelSensitivity } = this.options();
		if (!e.ctrlKey && !e.metaKey && !scrollToZoom) return;
		e.preventDefault();
		e.stopPropagation();
		this.#cancel();
		this.#pinch(true);
		clearTimeout(this.#wheelTimer);
		this.#wheelTimer = window.setTimeout(() => this.#pinch(false), WHEEL_IDLE);
		const focal = this.#local(e);
		const scale = clamp(scaleZoom(this.scale, -e.deltaY, wheelSensitivity), min, max);
		const ratio = scale / this.scale;
		const [s, x, y] = this.#clamped(scale, focal.x - (focal.x - this.x) * ratio, focal.y - (focal.y - this.y) * ratio);
		this.#set(s, x, y);
	};

	destroy() {
		this.#cancel();
		clearTimeout(this.#wheelTimer);
		this.#drag(false);
		this.#pinch(false);
	}
}
