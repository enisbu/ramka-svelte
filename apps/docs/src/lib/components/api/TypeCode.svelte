<script lang="ts">
	import { typeTokens } from './type-tokens.js';

	let { code, class: className }: { code: string; class?: string } = $props();
</script>

<code class={['font-mono text-[13px] leading-snug', className]}
	>{#each typeTokens(code) as token, i (i)}<span class={token.class}>{token.value}</span>{/each}</code
>
