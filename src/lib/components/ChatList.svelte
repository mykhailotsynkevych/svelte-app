<script lang="ts">
	import type { Chat } from '#lib/types.js';

	type Props = {
		title?: string;
		chats: Chat[];
		activeChatId: string;
		onSelect: (id: string) => void;
	};

	let { title = 'Chats', chats, activeChatId, onSelect }: Props = $props();
</script>

<nav aria-label="Chats">
	{#if title}
		<h2>{title}</h2>
	{/if}
	{#each chats as chat (chat.id)}
		<button
			class:active={chat.id === activeChatId}
			aria-current={chat.id === activeChatId ? 'true' : undefined}
			onclick={() => onSelect(chat.id)}
		>
			<span>{chat.title}</span>
			<span class="badge" aria-label={`${chat.messages.length} messages`}>
				{chat.messages.length}
			</span>
		</button>
	{/each}
</nav>

<style>
	nav { display: grid; gap: 8px; }
	button {
		display: flex; align-items: center; justify-content: space-between; gap: 12px;
		width: 100%; padding: 12px; border: 1px solid transparent; border-radius: 10px;
		background: transparent; color: #e1e5ef; text-align: left; font-size: 14px;
	}
	button:hover { background: #30374d; }
	button.active { background: #3c355d; border-color: #8273bc; color: white; }
	.badge { min-width: 24px; padding: 2px 6px; border-radius: 6px; background: #ffffff15; text-align: center; }
</style>
