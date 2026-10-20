import { redirect } from '@sveltejs/kit';
import type { PageLoad } from './$types';

export const load: PageLoad = () => {
	redirect(307, '/chats/svelte');	// 307 — временное HTTP-перенаправление (Для поисковиков код сообщает, что перенаправление временное, а не постоянное)
};
