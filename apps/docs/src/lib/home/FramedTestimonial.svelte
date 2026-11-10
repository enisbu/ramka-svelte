<script lang="ts">
	import { upstream } from '#lib/content/site.js';
</script>

<section class="mx-auto w-full max-w-5xl px-6 pb-24 md:pb-32">
	<div class="mx-auto max-w-3xl">
		<div
			class="relative border-16 bg-[#1a1915] shadow-[0_2px_6px_rgba(0,0,0,0.25),0_32px_64px_-16px_rgba(0,0,0,0.4)] [border-image:url(/frame.svg)_40] md:aspect-4/3 md:border-28"
		>
			<div
				aria-hidden="true"
				class="pointer-events-none absolute -inset-4 bg-[url(/noise.svg)] opacity-40 mix-blend-soft-light md:-inset-7"
			></div>
			<div
				class="bg-[#1a1915] px-5 py-9 text-center shadow-[inset_0_2px_6px_rgba(0,0,0,0.6),inset_0_0_0_1px_rgba(255,255,255,0.05)] md:flex md:h-full md:flex-col md:items-center md:justify-center md:px-8 md:py-14"
			>
				<img
					src="https://github.com/arturbien.png?size=192"
					alt="Artur Bień, creator of ramka"
					width="96"
					height="96"
					loading="lazy"
					class="mx-auto mb-5 size-16 rounded-full ring-1 ring-white/15 md:mb-7 md:size-24"
				/>
				<h2 class="text-2xl font-semibold tracking-tight text-balance text-[#f5f3ec] md:text-4xl">
					&ldquo;I&rsquo;d rather eat glass than build this again.&rdquo;
				</h2>
				<p class="mt-3 text-xs text-[#7c7a70] md:mt-4 md:text-sm">{upstream.author} &middot; creator of ramka</p>
				<p class="mx-auto mt-6 max-w-xl text-sm text-pretty text-[#a8a69d] md:mt-10 md:text-base">
					Exhibit A: what building a lightbox does to a person. <span class="font-medium text-[#e9e7de]">ramka</span> exists
					so it never has to happen to you, now in Svelte too.
				</p>
				<div class="mt-6 flex flex-wrap items-center justify-center gap-2.5 md:mt-8 md:gap-3">
					<a
						href="/docs"
						class="inline-flex h-10 items-center rounded-full bg-[#f5f3ec] px-4 text-sm font-medium text-neutral-900 transition hover:bg-[#dedcd2] md:h-11"
					>
						Use ramka instead
					</a>
					<a
						href={upstream.x}
						target="_blank"
						rel="noreferrer"
						class="inline-flex h-10 items-center gap-2 rounded-full border border-white/20 pr-4 pl-3 text-sm font-medium text-[#f5f3ec] transition hover:bg-white/10 md:h-11 md:pl-3.5"
					>
						<svg aria-hidden="true" viewBox="0 0 24 24" fill="currentColor" class="size-4">
							<path
								d="M18.901 1.153h3.68l-8.04 9.19L24 22.846h-7.406l-5.8-7.584-6.638 7.584H.474l8.6-9.83L0 1.154h7.594l5.243 6.932ZM17.61 20.644h2.039L6.486 3.24H4.298Z"
							/>
						</svg>
						Follow Artur
					</a>
				</div>
			</div>
		</div>
	</div>
</section>
