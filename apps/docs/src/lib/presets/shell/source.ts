/** One file in a preset or example source card; `html` is Shiki output. */
export interface SourceFile {
	name: string;
	code: string;
	html: string;
	group?: 'package' | 'example';
	note?: string;
}
