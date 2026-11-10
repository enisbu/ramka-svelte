const keywords = new Set([
	'boolean', 'string', 'number', 'bigint', 'symbol', 'object', 'void', 'null', 'undefined', 'never', 'any', 'unknown',
	'true', 'false', 'readonly', 'const', 'keyof', 'infer', 'extends', 'typeof', 'in', 'as', 'is'
]);

const tokenClass = {
	keyword: 'text-blue-600 dark:text-blue-400',
	string: 'text-emerald-700 dark:text-emerald-400',
	number: 'text-amber-700 dark:text-amber-400',
	type: 'text-violet-700 dark:text-violet-300',
	punctuation: 'text-neutral-500 dark:text-neutral-400',
	plain: 'text-neutral-800 dark:text-neutral-200'
};

const pattern = /('(?:\\.|[^'])*'|"(?:\\.|[^"])*"|`(?:\\.|[^`])*`)|(\d+(?:\.\d+)?)|([A-Za-z_$][\w$]*)|([{}()<>[\]|&?:,.;=+\-*/!~%]+)|(\s+|.)/g;

/** Splits a TypeScript type string into spans with a color class each. */
export function typeTokens(code: string) {
	return Array.from(code.matchAll(pattern), ([value, str, num, ident, punct]) => {
		const kind = str
			? 'string'
			: num
				? 'number'
				: ident
					? keywords.has(ident)
						? 'keyword'
						: /^[A-Z]/.test(ident)
							? 'type'
							: 'plain'
					: punct
						? 'punctuation'
						: 'plain';
		return { value, class: tokenClass[kind] };
	});
}

/** Collapses function types to `function` and long types to 40 characters for the table row. */
export function shortType(type: string) {
	const t = type.trim();
	if (!t) return 'n/a';
	if (t.includes('=>') || t.startsWith('(')) return 'function';
	return t.length > 40 ? `${t.slice(0, 37)}…` : t;
}
