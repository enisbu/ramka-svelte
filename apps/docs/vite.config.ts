import { readFile } from 'node:fs/promises';
import adapter from '@sveltejs/adapter-node';
import { sveltekit } from '@sveltejs/kit/vite';
import tailwindcss from '@tailwindcss/vite';
import { createHighlighter, type BundledLanguage } from 'shiki';
import { defineConfig, type Plugin } from 'vite';

const languages: Record<string, BundledLanguage> = {
	svelte: 'svelte',
	ts: 'typescript',
	js: 'javascript',
	css: 'css',
	html: 'html',
	sh: 'bash'
};

/**
 * Highlights source files with Shiki at build time.
 * `file.ext?highlight` exports `{ code, lines }` (tokens per line); `file.txt?snippets` splits on `==> name.ext` lines and exports a record of them.
 */
function highlight(): Plugin {
	const prefix = '\0highlight:';
	const suffixes = ['?highlight', '?snippets'];
	const highlighter = createHighlighter({
		themes: ['github-light', 'github-dark'],
		langs: Object.values(languages)
	});
	const render = async (code: string, ext: string) => ({
		code,
		lines: (await highlighter)
			.codeToTokens(code, {
				lang: languages[ext] ?? 'text',
				themes: { light: 'github-light', dark: 'github-dark' },
				defaultColor: false
			})
			.tokens.map((line) =>
				line.map((token) => ({
					content: token.content,
					style: Object.entries(token.htmlStyle ?? {})
						.map(([key, value]) => `${key}:${value}`)
						.join(';')
				}))
			)
	});
	return {
		name: 'docs-highlight',
		enforce: 'pre',
		async resolveId(source, importer) {
			const suffix = suffixes.find((s) => source.endsWith(s));
			if (!suffix) return;
			const resolved = await this.resolve(source.slice(0, -suffix.length), importer, { skipSelf: true });
			return resolved && `${prefix}${resolved.id}::${suffix.slice(1)}`;
		},
		async load(id) {
			if (!id.startsWith(prefix)) return;
			const [file, kind] = id.slice(prefix.length).split('::');
			this.addWatchFile(file);
			const text = await readFile(file, 'utf8');
			if (kind === 'highlight') {
				return `export default ${JSON.stringify(await render(text.replace(/\n+$/, ''), file.split('.').pop() ?? ''))};`;
			}
			const entries = await Promise.all(
				text
					.split(/^==> /m)
					.slice(1)
					.map(async (part: string) => {
						const [head, ...body] = part.split('\n');
						const [name, ext] = head.trim().split('.');
						return [name, await render(body.join('\n').replace(/^\n+|\n+$/g, ''), ext)] as const;
					})
			);
			return `export default ${JSON.stringify(Object.fromEntries(entries))};`;
		}
	};
}

export default defineConfig({
	plugins: [
		highlight(),
		tailwindcss(),
		sveltekit({
			compilerOptions: {
				runes: ({ filename }) => (filename.split(/[/\\]/).includes('node_modules') ? undefined : true)
			},
			adapter: adapter()
		})
	]
});
