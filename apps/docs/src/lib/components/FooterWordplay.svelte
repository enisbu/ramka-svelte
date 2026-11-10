<script lang="ts">
	const ramka = 'ramka - Polish for “frame”.';
	const teases = ['kamra - almost a camera.', 'marka - Polish for “brand”.'];
	let tease = $state<string | null>(null);
	let next = 0;

	function showNext() {
		tease = teases[next++ % teases.length];
	}
</script>

<!-- svelte-ignore a11y_click_events_have_key_events, a11y_no_noninteractive_element_interactions -->
<p
	class="max-w-full min-w-0 cursor-default text-neutral-400 select-none dark:text-neutral-600"
	onmouseenter={showNext}
	onmouseleave={() => (tease = null)}
	onclick={() => (tease === null ? showNext() : (tease = null))}
>
	{#key tease}
		<span class="inline-block animate-[wordplay_400ms_cubic-bezier(0.41,1.03,0.6,1.03)]"
			>{tease ?? ramka}</span
		>
	{/key}
</p>

<style>
	@keyframes -global-wordplay {
		from {
			opacity: 0;
			filter: blur(2px);
			transform: translateY(2px);
		}
	}
</style>
