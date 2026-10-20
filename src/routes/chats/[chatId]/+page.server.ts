import { error } from '@sveltejs/kit';
import { createChats } from '#lib/chats.js';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = ({ params }) => {
	const chats = createChats();
	const chat = chats.find((item) => item.id === params.chatId);

	if (!chat) {
		error(404, 'Чат не найден');
	}

	return { chatId: chat.id };
};
