<script lang="ts">
	import { Lightbox } from '@ramka/svelte';
	import { triggerFocus } from '#lib/gallery/chrome.js';
	import LightboxGallery from '#lib/gallery/LightboxGallery.svelte';
	import { photo } from '#lib/gallery/items.js';

	const tiles = [
		{
			...photo(
				'ramka-a',
				'Person standing in a sunlit meadow at golden hour',
				'Golden hour in the meadow'
			),
			tile: 'aspect-[3/2]',
			split: ''
		},
		{
			...photo('ramka-b', 'Seashells scattered along the shoreline', 'Seashells on the shore'),
			tile: 'aspect-[4/5]',
			split: ''
		},
		{
			...photo('ramka-j', 'Father carrying a child along a sandy beach', 'Beach walk, kid in tow'),
			tile: 'aspect-[12/7]',
			split: ''
		},
		{
			...photo(
				'ramka-c',
				'Curved building facade in black and white',
				'Curved facade, in monochrome'
			),
			tile: 'aspect-square',
			split: 'md:break-before-column'
		},
		{
			...photo(
				'ramka-d',
				'Airplane crossing a purple sky above the clouds',
				'Above the clouds at dusk'
			),
			tile: 'aspect-video',
			split: 'break-before-column md:break-before-auto'
		},
		{
			...photo(
				'ramka-k',
				'Brutalist concrete tower against a pale sky',
				'Concrete against a pale sky'
			),
			tile: 'aspect-square md:aspect-[16/15]',
			split: ''
		},
		{
			...photo('ramka-e', 'Fog rolling over dark hills', 'Fog rolling over the valley'),
			tile: 'aspect-[16/11] md:aspect-[5/3]',
			split: 'md:break-before-column'
		},
		{
			...photo(
				'ramka-f',
				'Aerial view of a road entering twin forest tunnels',
				'Twin tunnels from above'
			),
			tile: 'aspect-[4/5] md:aspect-[5/6]',
			split: ''
		},
		{
			...photo(
				'ramka-g',
				'Bride seen through the windows of a vintage car',
				'Through the wedding car window'
			),
			tile: 'aspect-[4/3] md:aspect-[10/7]',
			split: 'break-before-column md:break-before-auto'
		},
		{
			...photo('ramka-l', 'Out-of-focus city lights glowing at dusk', 'City lights, out of focus'),
			tile: 'aspect-video',
			split: 'md:break-before-column'
		},
		{
			...photo(
				'ramka-n',
				'Husky dog in a harness looking into the distance',
				'Husky on the lookout'
			),
			tile: 'aspect-[4/5]',
			split: ''
		},
		{
			...photo(
				'ramka-h',
				'Sandstone hoodoos under a summer sky',
				'Hoodoos under a summer sky, Bryce Canyon'
			),
			tile: 'aspect-[16/15] md:aspect-[16/11]',
			split: ''
		}
	];
	const hidden = [
		photo('ramka-m', 'Patches of snow on a mossy forest floor', 'First snow in the forest'),
		photo('ramka-i', 'The Leaning Tower of Pisa at dusk', 'The leaning arches of Pisa')
	];
	const items = [...tiles, ...hidden];
	const last = tiles.length - 1;
</script>

<Lightbox.Root morphTo="closest">
	<div class="columns-3 gap-2 md:columns-4 md:gap-3">
		{#each tiles as tile, i (tile.src)}
			<Lightbox.Trigger
				index={i}
				crossfade={i === last ? 'both' : undefined}
				aria-label={i === last ? `Show ${hidden.length} more photos` : undefined}
				class="mb-2 block w-full scroll-my-12 break-inside-avoid overflow-hidden rounded-lg bg-neutral-100 p-0 {triggerFocus} md:mb-3 md:rounded-xl dark:bg-neutral-900 {tile.split}"
			>
				<span
					class="grid rounded-[inherit] after:pointer-events-none after:z-20 after:col-start-1 after:row-start-1 after:rounded-[inherit] after:shadow-[inset_0_0_0_0.5px_rgba(0,0,0,0.1)] after:content-[''] dark:after:shadow-[inset_0_0_0_0.5px_rgba(255,255,255,0.12)]"
				>
					<img
						src={tile.thumb}
						alt={tile.alt}
						width={tile.width}
						height={tile.height}
						loading="eager"
						draggable="false"
						class="col-start-1 row-start-1 block h-full w-full object-cover select-none {tile.tile}"
					/>
					{#if i === last}
						<span
							aria-hidden="true"
							class="z-10 col-start-1 row-start-1 flex items-center justify-center bg-black/35 text-3xl font-semibold tracking-tight text-white [text-shadow:0_1px_12px_rgba(0,0,0,0.45)] md:text-4xl"
						>
							+{hidden.length}
						</span>
					{/if}
				</span>
			</Lightbox.Trigger>
		{/each}
	</div>
	<LightboxGallery
		{items}
		ariaLabel="ramka demo gallery"
		backdrop="solid"
		slidesLayout="snug"
		layoutToggle
	/>
</Lightbox.Root>
