/** Scroll position of every slide when it sits centered in the track, keyed by item index. */
export function slideOffsets(track: HTMLElement) {
	return [...track.querySelectorAll<HTMLElement>(':scope > [data-ramka-slide]')].map((slide) => ({
		slide,
		index: Number(slide.querySelector<HTMLElement>('[data-ramka-item]')?.dataset.index ?? -1),
		offset: slide.offsetLeft - (track.clientWidth - slide.offsetWidth) / 2
	}));
}

/** Fractional slide index for the current scroll position, 1.5 = halfway between slide 1 and 2. */
export function scrollProgress(track: HTMLElement) {
	const slides = slideOffsets(track);
	const x = track.scrollLeft;
	if (!slides.length) return 0;
	if (x <= slides[0].offset) return slides[0].index;
	for (let k = 0; k < slides.length - 1; k++) {
		const a = slides[k];
		const b = slides[k + 1];
		if (x <= b.offset) return a.index + ((x - a.offset) / (b.offset - a.offset || 1)) * (b.index - a.index);
	}
	return slides[slides.length - 1].index;
}
