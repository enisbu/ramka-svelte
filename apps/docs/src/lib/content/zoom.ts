/** How mainstream desktop viewers map zoom and pan: app, bare scroll, modifier, double click, drag. */
export const desktopApps = [
	['macOS Preview', 'Pan / scroll', 'Zoom (pinch)', 'Smart-zoom toggle', 'Pan'],
	['Apple Photos (Mac)', 'n/a', 'Zoom (pinch)', 'Toggle 1×↔zoom', 'Pan'],
	['Windows Photos', 'Navigate', 'Zoom (Ctrl+wheel)', 'Toggle', 'Pan'],
	['Google Photos (web)', 'Zoom to cursor', 'Zoom', 'Toggle', 'Pan'],
	['Google Maps', 'Zoom to cursor', 'Zoom', 'Zoom-in step', 'Pan'],
	['PhotoSwipe v5', 'Opt-in (wheelToZoom)', 'Zoom (pinch)', 'Toggle', 'Pan'],
	['OpenSeadragon', 'Zoom to cursor', 'Zoom', 'Zoom-in step', 'Pan'],
	['Lightroom', 'Zoom', 'Zoom', 'Toggle 1:1', 'Pan'],
	['Figma / Miro (canvas)', 'Pan', 'Zoom to cursor', 'n/a', 'Pan (space)']
];

/** ramka for Svelte against the desktop consensus: interaction, ramka, consensus, verdict. */
export const desktopRamka = [
	[
		'Trackpad pinch',
		'Zooms to cursor through ctrlKey+wheel; hard-clamped at min/max. Safari GestureEvent is only blocked from page zoom, not read',
		'Zoom to cursor',
		'Match, without rubber-band (port gap)'
	],
	['Ctrl / ⌘ + wheel', 'Zooms, focal at cursor; hard-clamped at min/max', 'Zoom to cursor', 'Match'],
	[
		'Bare scroll wheel',
		'Off by default (scrollToZoom=false): no-op inside Zoom',
		'Split: media viewers zoom, canvas apps pan',
		'Defensible default; opt-in covers the other'
	],
	['Double-click', 'Toggles zoom, focal at cursor', 'Toggle, focal', 'Match'],
	['Drag to pan', 'Yes: grab / grabbing cursor, elastic plus momentum', 'Universal', 'Match'],
	['Wheel to pan (zoomed)', 'Not yet: a bare wheel does not pan', 'Common', 'Port gap'],
	['Zoom buttons', 'ZoomIn / ZoomOut, zoomStep ×2', 'Common', 'Zooms about center, not cursor'],
	['Keyboard zoom', '+ = − _ and 0 to reset (⌘/Ctrl combos stay browser page zoom)', 'Expected', 'Match'],
	['Keyboard pan', 'Arrows pan (keyboardPanDistance, 50px) when zoomed', 'Expected', 'Match'],
	['Max zoom', "Auto-capped to the image's native resolution (fallback 4×)", 'Best practice (avoids blur)', 'Better than many'],
	['Cursor at 1×', 'No zoom-in affordance (consumer CSS)', 'Some apps show a zoom-in cursor', 'Minor discoverability gap']
];

/** How mainstream touch viewers behave: app, pinch, double tap, pan, momentum, swipe down. */
export const mobileApps = [
	['iOS Photos', 'Focal, rubber-band', 'Toggle at tap', '1-finger drag', 'Yes + overscroll', 'Dismiss'],
	['Android Google Photos', 'Focal, rubber-band', 'Toggle at tap', '1-finger drag', 'Yes', 'Dismiss'],
	['Instagram', 'Focal (peek), snaps back', 'Like (not zoom)', 'While pinched', 'No', 'Dismiss'],
	['Mobile Safari (page)', 'Focal', 'Toggle (smart)', '1-finger drag', 'Yes', 'n/a'],
	['PhotoSwipe (mobile)', 'Focal, rubber-band', 'Toggle at tap', '1-finger drag', 'Yes', 'Dismiss'],
	['Telegram / WhatsApp', 'Focal', 'Toggle at tap', '1-finger drag', 'Yes', 'Dismiss']
];

/** ramka for Svelte against the touch consensus: interaction, ramka, consensus, verdict. */
export const mobileRamka = [
	[
		'Pinch to zoom',
		'Focal at pinch midpoint; image follows the centroid (pinch and pan together); elastic past bounds, snaps back with a haptic tick',
		'Focal + rubber-band',
		'Match'
	],
	['Double-tap', 'Toggles zoom, focal at tap; commit waits for pointerup so a flick never misfires', 'Toggle at tap', 'Match'],
	['1-finger pan (zoomed)', 'Elastic drag; velocity tracked', 'Universal', 'Match'],
	[
		'2-finger pan (zoomed)',
		'Centroid pans and scale follows finger distance from the first move (no recognizer slop)',
		'iOS Photos / pinch-pan',
		'Close; small jitter can nudge zoom'
	],
	['Release with velocity', 'Momentum pan (decelerates, clamps to bounds)', 'iOS/Android inertia', 'Match'],
	['Swipe left / right', 'Navigates via Slides snap carousel (only at 1×)', 'Navigate photos', 'Match'],
	['Swipe down', 'Pull-to-dismiss; blocked while zoomed > 1×', 'Dismiss', 'Match'],
	['touch-action', 'none when zoomed; pan-x at 1× (lets Slides and the page own the swipe)', 'Guard native gestures', 'Correct'],
	['Native page pinch-zoom', 'Suppressed while Content is open so it never fights Lightbox.Zoom', 'Prevent conflict', 'Match'],
	['Haptics', 'Light tick on snap-back (navigator.vibrate, Android only)', 'iOS rubber-band feel', 'Better than many']
];

/** WCAG 2.2 criteria that govern zoom and pan. */
export const wcag = [
	{
		sc: '2.5.1 Pointer Gestures',
		href: 'https://www.w3.org/WAI/WCAG22/Understanding/pointer-gestures.html',
		level: 'A',
		applies: 'Pinch (touch and trackpad) is a multipoint gesture and needs a single-pointer alternative.',
		verdict: 'Pass.',
		status: 'Double-tap / double-click and the ZoomIn / ZoomOut buttons are all single-pointer.'
	},
	{
		sc: '2.5.7 Dragging Movements',
		href: 'https://www.w3.org/WAI/WCAG22/Understanding/dragging-movements.html',
		level: 'AA',
		applies: 'Pan is drag-based and ramka implements its own pan, so the author-content clause applies.',
		verdict: 'Partial.',
		status: 'Keyboard arrows pan, but a strict single-pointer, non-drag pan alternative (such as pan controls) is not built in. See the note below.'
	},
	{
		sc: '2.1.1 Keyboard',
		href: 'https://www.w3.org/WAI/WCAG22/Understanding/keyboard.html',
		level: 'A',
		applies: 'All zoom and pan must be reachable by keyboard.',
		verdict: 'Pass.',
		status: '+/−/0 and arrows route through the active-zoom bridge in Content.'
	},
	{
		sc: '2.5.8 Target Size (Minimum)',
		href: 'https://www.w3.org/WAI/WCAG22/Understanding/target-size-minimum.html',
		level: 'AA',
		applies: 'Zoom and close controls should be at least 24×24 CSS px (44 px is the touch norm).',
		verdict: 'Consumer.',
		status: 'Sizing is your CSS in a headless library: a guidance item, not a library defect.'
	}
];
