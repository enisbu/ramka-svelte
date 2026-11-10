import { expect, test } from 'vitest';
import { page, userEvent } from 'vitest/browser';
import { render } from 'vitest-browser-svelte';
import Gallery from './Gallery.svelte';

const counter = () => document.querySelector('[data-ramka-counter]')?.textContent?.trim();

test('opens from a trigger, navigates, and returns focus on Escape', async () => {
	render(Gallery);
	const trigger = page.getByRole('button', { name: 'Open Zwei' });
	await trigger.click();
	const dialog = page.getByRole('dialog', { name: 'Viewer' });
	await expect.element(dialog).toHaveAttribute('data-open');
	await expect.element(trigger).toHaveAttribute('aria-expanded', 'true');
	await expect.poll(counter).toBe('2 / 3');
	await expect.element(page.getByText('Zwei', { exact: true }).first()).toBeInTheDocument();
	expect(document.querySelector('[data-ramka-caption]')?.hasAttribute('data-has-caption')).toBe(true);

	await page.getByRole('button', { name: 'Next' }).click();
	await expect.poll(counter).toBe('3 / 3');
	await expect.element(page.getByRole('button', { name: 'Next' })).toHaveAttribute('data-disabled');

	await userEvent.keyboard('{Escape}');
	await expect.poll(() => document.querySelector('[data-ramka-content]')).toBeNull();
	await expect.poll(() => document.activeElement?.getAttribute('aria-label')).toBe('Open Zwei');
});

test('wires thumbnails as tabs controlling item panels', async () => {
	render(Gallery);
	await page.getByRole('button', { name: 'Open Eins' }).click();
	const tab = page.getByRole('tab', { name: 'Drei' });
	await expect.element(page.getByRole('tab', { name: 'Eins' })).toHaveAttribute('aria-selected', 'true');
	const panelId = tab.element().getAttribute('aria-controls')!;
	expect(document.getElementById(panelId)?.getAttribute('role')).toBe('tabpanel');
	await tab.click();
	await expect.poll(counter).toBe('3 / 3');
	await userEvent.keyboard('{Home}');
	await expect.poll(counter).toBe('1 / 3');
	await expect.element(page.getByRole('tab', { name: 'Eins' })).toHaveFocus();
});

test('mirrors arrow keys in RTL', async () => {
	render(Gallery, { dir: 'rtl' });
	await page.getByRole('button', { name: 'Open Eins' }).click();
	await expect.element(page.getByRole('dialog')).toHaveAttribute('data-open');
	await userEvent.keyboard('{ArrowLeft}');
	await expect.poll(counter).toBe('2 / 3');
	expect(document.querySelector('[data-ramka-content]')?.closest('[dir]')?.getAttribute('dir')).toBe('rtl');
});

test('zoom buttons step and report their bounds', async () => {
	render(Gallery);
	await page.getByRole('button', { name: 'Open Eins' }).click();
	const zoomOut = page.getByRole('button', { name: 'Zoom out' });
	await expect.element(zoomOut).toBeDisabled();
	await page.getByRole('button', { name: 'Zoom in' }).click();
	await expect.poll(() => document.querySelector('[data-ramka-content]')?.hasAttribute('data-zoomed')).toBe(true);
	await expect.element(zoomOut).toBeEnabled();
	await userEvent.keyboard('0');
	await expect.poll(() => document.querySelector('[data-ramka-content]')?.hasAttribute('data-zoomed')).toBe(false);
});
