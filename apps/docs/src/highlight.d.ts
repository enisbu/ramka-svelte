declare module '*?highlight' {
	const excerpt: import('#lib/components/CodeBlock.svelte').Highlighted;
	export default excerpt;
}

declare module '*?snippets' {
	const snippets: Record<string, import('#lib/components/CodeBlock.svelte').Highlighted>;
	export default snippets;
}
