<script lang="ts">
	import { docsLink } from './docs-link.js';

	let {
		partHref,
		part,
		prop,
		sectionId
	}: { partHref: string; part: string; prop: string; sectionId: string } = $props();
</script>

<a href={partHref} class={docsLink}>{part}</a>
<a href="#{sectionId}" class="hover:underline">{prop}</a>
