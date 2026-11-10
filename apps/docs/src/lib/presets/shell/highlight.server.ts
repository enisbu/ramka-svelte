import { createHighlighter } from 'shiki';
import type { SourceFile } from './source.js';

const langs = {
	svelte: 'svelte',
	ts: 'typescript',
	js: 'javascript',
	css: 'css',
	html: 'html'
} as const;
const highlighter = createHighlighter({
	themes: ['github-light', 'github-dark'],
	langs: Object.values(langs)
});

/** Highlights raw source files with Shiki (github-light/dark as CSS variables) for a source card. */
export async function highlight(files: Omit<SourceFile, 'html'>[]): Promise<SourceFile[]> {
	const shiki = await highlighter;
	return files.map((file) => {
		const code = file.code.replace(/\n+$/, '');
		const lang = langs[file.name.split('.').pop() as keyof typeof langs] ?? 'text';
		const html = shiki.codeToHtml(code, {
			lang,
			themes: { light: 'github-light', dark: 'github-dark' },
			defaultColor: false
		});
		return { ...file, code, html };
	});
}
