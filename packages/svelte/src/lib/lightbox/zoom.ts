import { clamp, rubberBand, tween } from './gestures.js';

type Point = { x: number; y: number };

const STEP = 1.6;
const DOUBLE_TAP_MS = 300;
const DOUBLE_TAP_DISTANCE = 50;
const TAP_MOVE = 10;

/** Pinch, pan, double tap, ctrl+wheel and discrete zoom for one media box. */
export class ZoomController {
	scale = 1;
	x = 0;
	y = 0;
	#pointers = new Map<number, Point>();
	#gesture: { scale: number; x: number; y: number; mid: Point; distance: number } | null = null;
	#velocity: Point & { t: number } = { x: 0, y: 0, t: 0 };
	#lastTap = { t: 0, x: 0, y: 0 };
	#downAt: Point = { x: 0, y: 0 };
	#cancel = () => {};
	#pointerType = '';
	viewport: HTMLElement;
	content: HTMLElement;
	max: () => number;
	onchange: (scale: number) => void;

	constructor(viewport: HTMLElement, content: HTMLElement, max: () => number, onchange: (scale: number) => void) {
		this.viewport = viewport;
		this.content = content;
		this.max = max;
		this.onchange = onchange;
	}

	#local(e: { clientX: number; clientY: number }): Point {
		const r = this.viewport.getBoundingClientRect();
		return { x: e.clientX - r.left - r.width / 2, y: e.clientY - r.top - r.height / 2 };
	}

	#bounds(scale = this.scale) {
		const w = this.content.offsetWidth * scale;
		const h = this.content.offsetHeight * scale;
		return {
			x: Math.max(0, (w - this.viewport.clientWidth) / 2),
			y: Math.max(0, (h - this.viewport.clientHeight) / 2)
		};
	}

	#render() {
		this.content.style.transform = `translate3d(${this.x}px, ${this.y}px, 0) scale(${this.scale})`;
		this.onchange(this.scale);
	}

	#set(scale: number, x: number, y: number) {
		[this.scale, this.x, this.y] = [scale, x, y];
		this.#render();
	}

	#clamped(scale: number, x: number, y: number) {
		const s = clamp(scale, 1, this.max());
		const b = this.#bounds(s);
		return [s, clamp(x, -b.x, b.x), clamp(y, -b.y, b.y)] as const;
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
		const s = clamp(scale, 1, this.max());
		const ratio = s / this.scale;
		this.animateTo(s, focal.x - (focal.x - this.x) * ratio, focal.y - (focal.y - this.y) * ratio, duration);
	}

	zoomIn = () => this.zoomAt(this.scale * STEP);
	zoomOut = () => this.zoomAt(this.scale / STEP);
	reset = (duration?: number) => this.animateTo(1, 0, 0, duration);
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
		this.#pointerType = e.pointerType;
		if (e.isPrimary) this.#pointers.clear();
		if (e.pointerType === 'mouse' && (e.button !== 0 || this.scale <= 1)) return;
		this.#pointers.set(e.pointerId, this.#local(e));
		if (this.#pointers.size > 2) return;
		if (this.#pointers.size === 2 || this.scale > 1) {
			e.stopPropagation();
			this.viewport.setPointerCapture(e.pointerId);
		}
		this.#cancel();
		this.#downAt = this.#local(e);
		this.#velocity = { x: 0, y: 0, t: e.timeStamp };
		this.#startGesture();
	};

	onpointermove = (e: PointerEvent) => {
		if (!this.#pointers.has(e.pointerId) || !this.#gesture) return;
		this.#pointers.set(e.pointerId, this.#local(e));
		const g = this.#gesture;
		const [a, b] = [...this.#pointers.values()];
		if (b) {
			e.stopPropagation();
			const mid = { x: (a.x + b.x) / 2, y: (a.y + b.y) / 2 };
			const raw = (g.scale * Math.hypot(a.x - b.x, a.y - b.y)) / (g.distance || 1);
			const max = this.max();
			const scale = raw < 1 ? 1 - rubberBand(1 - raw, 1) : raw > max ? max + rubberBand(raw - max, max) : raw;
			const ratio = scale / g.scale;
			this.#set(scale, mid.x - (g.mid.x - g.x) * ratio, mid.y - (g.mid.y - g.y) * ratio);
			return;
		}
		if (this.scale <= 1) return;
		e.stopPropagation();
		const b0 = this.#bounds();
		const tx = g.x + a.x - g.mid.x;
		const ty = g.y + a.y - g.mid.y;
		const dt = Math.max(e.timeStamp - this.#velocity.t, 1);
		this.#velocity = { x: ((tx - this.x) / dt) * 1000, y: ((ty - this.y) / dt) * 1000, t: e.timeStamp };
		const soft = (v: number, bound: number, dim: number) =>
			Math.abs(v) > bound ? Math.sign(v) * bound + rubberBand(v - Math.sign(v) * bound, dim) : v;
		this.#set(this.scale, soft(tx, b0.x, this.viewport.clientWidth), soft(ty, b0.y, this.viewport.clientHeight));
	};

	onpointerup = (e: PointerEvent) => {
		if (!this.#pointers.delete(e.pointerId)) return;
		const point = this.#local(e);
		if (this.#pointers.size === 1) return this.#startGesture();
		this.#gesture = null;
		if (this.scale === 1 && this.x === 0 && this.y === 0) return;
		const moved = Math.hypot(point.x - this.#downAt.x, point.y - this.#downAt.y) > TAP_MOVE;
		if (e.pointerType !== 'mouse' && !moved && e.type === 'pointerup') return this.#tap(e, point);
		const fresh = e.timeStamp - this.#velocity.t < 100;
		const vx = fresh ? this.#velocity.x : 0;
		const vy = fresh ? this.#velocity.y : 0;
		this.animateTo(this.scale, this.x + vx * 0.25, this.y + vy * 0.25, 400);
	};

	#tap(e: PointerEvent, point: Point) {
		const last = this.#lastTap;
		const double =
			e.timeStamp - last.t < DOUBLE_TAP_MS && Math.hypot(point.x - last.x, point.y - last.y) < DOUBLE_TAP_DISTANCE;
		this.#lastTap = double ? { t: 0, x: 0, y: 0 } : { t: e.timeStamp, ...point };
		if (double) this.toggle(point);
		else if (this.scale !== clamp(this.scale, 1, this.max())) this.animateTo(this.scale, this.x, this.y);
	}

	toggle(point: Point) {
		if (this.scale > 1.01) this.reset();
		else this.zoomAt(Math.min(2.5, this.max()), point);
	}

	ondblclick = (e: MouseEvent) => {
		if (this.#pointerType === 'mouse') this.toggle(this.#local(e));
	};

	onwheel = (e: WheelEvent) => {
		if (!e.ctrlKey && !e.metaKey) return;
		e.preventDefault();
		e.stopPropagation();
		this.#cancel();
		const focal = this.#local(e);
		const scale = clamp(this.scale * Math.exp(-e.deltaY * 0.01), 1, this.max());
		const ratio = scale / this.scale;
		const [s, x, y] = this.#clamped(scale, focal.x - (focal.x - this.x) * ratio, focal.y - (focal.y - this.y) * ratio);
		this.#set(s, x, y);
	};

	destroy() {
		this.#cancel();
	}
}
