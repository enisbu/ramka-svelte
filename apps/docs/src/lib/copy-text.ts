/** Copies text synchronously so Mobile Safari keeps the user activation. */
export function copyText(text: string): boolean {
	const textarea = document.createElement('textarea');
	textarea.value = text;
	textarea.setAttribute('readonly', '');
	textarea.style.cssText =
		'position:fixed;top:0;left:0;width:1px;height:1px;padding:0;border:none;outline:none;box-shadow:none;background:transparent;opacity:0;font-size:12pt;';
	const selection = document.getSelection();
	const previous = selection && selection.rangeCount > 0 ? selection.getRangeAt(0) : null;
	document.body.append(textarea);
	textarea.focus();
	textarea.select();
	textarea.setSelectionRange(0, text.length);
	let ok = false;
	try {
		ok = document.execCommand('copy');
	} catch {
		ok = false;
	}
	textarea.remove();
	if (previous && selection) {
		selection.removeAllRanges();
		selection.addRange(previous);
	}
	return ok;
}
