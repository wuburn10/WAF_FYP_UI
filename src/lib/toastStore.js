// @ts-nocheck
import { writable } from 'svelte/store';

export const toast = writable({
	message: '',
	type: '',
	visible: false
});

export function showToast(message, type = 'success') {
	toast.set({ message, type, visible: true });
	setTimeout(() => {
		toast.set({ message: '', type: '', visible: false });
	}, 3000); // Toast duration
}
