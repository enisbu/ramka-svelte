import { createContext, flushSync, getContext, setContext } from 'svelte';
import { SvelteMap } from 'svelte/reactivity';
import { canMorph, decoded, morph, morphSource, type MorphPreset } from './morph.js';

export type MorphTo = 'active' | 'origin' | 'closest';
export type Crossfade = 'open' | 'close' | 'both';

export interface ZoomApi {
	zoomIn(): void;
	zoomOut(): void;
	reset(): void;
	pan(dx: number, dy: number): void;
}

interface RootProps {
	open: boolean;
	index: number;
	loop: boolean;
	viewTransition: boolean | MorphPreset;
	morphTo: MorphTo;
	onOpenChange?: (open: boolean) => void;
}

interface Trigger {
	el: HTMLElement;
	crossfade?: Crossfade;
}

/** Shared state of one lightbox: open/index, registries, gesture flags and the morph flows. */
export class LightboxState {
	#props: RootProps;
	present = $state(false);
	preload = $state(1);
	zoomScale = $state(1);
	scrolling = $state(false);
	pulling = $state(false);
	pullDismissing = $state(false);
	items = new SvelteMap<number, { el: HTMLElement; caption?: string }>();
	count = $derived(this.items.size);
	zoomed = $derived(this.zoomScale > 1.01);
	media = new Map<number, HTMLElement>();
	triggers = new Map<number, Trigger>();
	zooms = new Map<number, ZoomApi>();
	portal: HTMLElement | null = null;
	slidesEl = $state<HTMLElement>();
	instant = false;
	origin = -1;
	#busy = false;

	constructor(props: RootProps) {
		this.#props = props;
	}

	get open() {
		return this.#props.open;
	}

	get index() {
		return this.#props.index;
	}

	set index(i: number) {
		this.#props.index = i;
	}

	get caption() {
		return this.items.get(this.index)?.caption;
	}

	get preset(): MorphPreset {
		const vt = this.#props.viewTransition;
		return typeof vt === 'string' ? vt : 'default';
	}

	get canPrev() {
		return this.#props.loop || this.index > 0;
	}

	get canNext() {
		return this.#props.loop || this.index < this.count - 1;
	}

	get activeZoom() {
		return this.zooms.get(this.index);
	}

	/** Moves to slide `i`; `instant` skips the smooth scroll (used inside a crossfade). */
	go(i: number, instant = false) {
		if (!this.count || this.scrolling) return;
		this.instant = instant;
		this.index = this.#props.loop ? (i + this.count) % this.count : Math.min(Math.max(i, 0), this.count - 1);
	}

	/** Trigger that receives the close morph, picked by `morphTo`. */
	closeTarget(): Trigger | undefined {
		const { morphTo } = this.#props;
		if (morphTo === 'origin') return this.triggers.get(this.origin);
		const active = this.triggers.get(this.index);
		if (active || morphTo === 'active') return active;
		let best: Trigger | undefined;
		let distance = Infinity;
		for (const [i, t] of this.triggers) {
			if (Math.abs(i - this.index) < distance) [best, distance] = [t, Math.abs(i - this.index)];
		}
		return best;
	}

	#morphs(trigger?: Trigger) {
		return !!trigger && this.#props.viewTransition !== false && canMorph();
	}

	#crossfades(trigger: Trigger | undefined, phase: 'open' | 'close') {
		return trigger?.crossfade === 'both' || trigger?.crossfade === phase;
	}

	async show(index: number) {
		if (this.open || this.#busy) return;
		const trigger = this.triggers.get(index);
		const commit = () =>
			flushSync(() => {
				this.origin = index;
				this.index = index;
				this.#props.open = true;
				this.present = true;
			});
		if (!this.#morphs(trigger)) {
			commit();
			this.#props.onOpenChange?.(true);
			return;
		}
		this.#busy = true;
		this.#props.onOpenChange?.(true);
		await morph({
			phase: 'opening',
			preset: this.preset,
			crossfade: this.#crossfades(trigger, 'open'),
			from: morphSource(trigger!.el),
			update: async () => {
				commit();
				const to = this.media.get(index) ?? this.items.get(index)?.el ?? null;
				if (to) await decoded(to);
				return to;
			}
		}).finally(() => (this.#busy = false));
	}

	async close() {
		if (!this.open || this.#busy) return;
		const trigger = this.closeTarget();
		const from = this.media.get(this.index) ?? this.items.get(this.index)?.el;
		this.#props.onOpenChange?.(false);
		if (!from || !this.#morphs(trigger)) {
			this.#props.open = false;
			this.pullDismissing = false;
			return;
		}
		const to = morphSource(trigger!.el);
		to.scrollIntoView({ block: 'nearest', inline: 'nearest', behavior: 'instant' });
		this.#busy = true;
		await morph({
			phase: 'closing',
			preset: this.preset,
			crossfade: this.#crossfades(trigger, 'close'),
			from,
			update: () => {
				flushSync(() => {
					this.#props.open = false;
					this.present = false;
				});
				return to;
			}
		}).finally(() => {
			this.#busy = false;
			this.pullDismissing = false;
		});
	}
}

export const [getLightbox, setLightbox] = createContext<LightboxState>();

export interface ItemContext {
	readonly index: number;
	setMedia(el: HTMLElement | null): void;
}

export const [getItem, setItem] = createContext<ItemContext>();

/** Thumbnail strip API: selecting a thumb scrubs the strip and crossfades the slides. */
export interface StripContext {
	select(index: number): void;
}

const STRIP = Symbol('ramka-strip');
export const setStrip = (strip: StripContext) => setContext(STRIP, strip);
export const getStrip = () => getContext<StripContext | undefined>(STRIP);
