import { fail } from '@sveltejs/kit';
import type { Actions } from './$types';

export const actions = {
	validate: async ({ request }) => {
		const formData = await request.formData();
		const nameValue = formData.get('name');
		const messageValue = formData.get('message');

		const values = {
			name: typeof nameValue === 'string' ? nameValue : '',
			message: typeof messageValue === 'string' ? messageValue : ''
		};
		const errors: { name?: string; message?: string } = {};
		const name = values.name.trim();
		const message = values.message.trim();

		if (name.length < 2 || name.length > 40) {
			errors.name = 'Der Name muss zwischen 2 und 40 Zeichen lang sein.';
		}

		if (!message) {
			errors.message = 'Bitte gib eine Nachricht ein.';
		} else if (message.length > 280) {
			errors.message = 'Die Nachricht darf höchstens 280 Zeichen lang sein.';
		}

		if (Object.keys(errors).length > 0) {
			return fail(400, { values, errors });
		}

		return {
			values,
			errors: { name: undefined, message: undefined },
			success: true
		};
	}
} satisfies Actions;
