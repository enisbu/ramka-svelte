<script lang="ts">
	import ExampleShell from '#lib/presets/shell/ExampleShell.svelte';
	import TextMessage from '#lib/examples/text-message/TextMessage.svelte';
</script>

<svelte:head>
	<title>Text message example</title>
	<meta
		name="description"
		content="An iMessage-style chat in Svelte where photo attachments open in a morphing lightbox from a single morphTo=&quot;origin&quot; trigger, built with ramka."
	/>
</svelte:head>

<ExampleShell title="Text message">
	{#snippet description()}
		A single <code>Lightbox.Trigger</code> wraps an entire stack of attachments. Paired with
		<code>morphTo="origin"</code>, the close animation always returns to the stack no matter which
		attachment is active.
	{/snippet}
	<TextMessage />
</ExampleShell>

<style>
	code {
		font-family:
			ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono', 'Courier New',
			monospace;
		line-height: 1rem;
		border-radius: 0.25rem;
		background-color: #f5f5f5;
		padding: 0.125rem 0.25rem;
	}
	:global(:is(.dark, [data-theme='dark'])) code {
		background-color: #262626;
	}
</style>
