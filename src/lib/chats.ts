import type { Chat } from '#lib/types.js';

export function createChats(): Chat[] {
	return [
		{
			id: 'svelte',
			title: 'Learning Svelte 5',
			messages: [{ id: 1, text: 'What is the difference between $state and useState?' }]
		},
		{
			id: 'interview',
			title: 'Interview preparation',
			messages: []
		}
	];
}
