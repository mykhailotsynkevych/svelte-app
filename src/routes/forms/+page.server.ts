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
			errors.name = 'Имя должно содержать от 2 до 40 символов.';
		}

		if (!message) {
			errors.message = 'Введите сообщение.';
		} else if (message.length > 280) {
			errors.message = 'Сообщение не должно превышать 280 символов.';
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
