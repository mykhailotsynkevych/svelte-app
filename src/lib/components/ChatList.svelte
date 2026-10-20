<script lang="ts">
	import type { Chat } from '#lib/types.js';

	type Props = {
		title?: string;
		chats: Chat[];
		activeChatId: string;
	};

	let { title = 'Chats', chats, activeChatId }: Props = $props();
</script>

<nav aria-label="Chats">
	{#if title}
		<h2>{title}</h2>
	{/if}
	{#each chats as chat (chat.id)}
		<a
			href={`/chats/${encodeURIComponent(chat.id)}`}
			class:active={chat.id === activeChatId}
			aria-current={chat.id === activeChatId ? 'page' : undefined}
		>
			<span>{chat.title}</span>
			<span class="badge" aria-label={`${chat.messages.length} messages`}>
				{chat.messages.length}
			</span>
		</a>
	{/each}
</nav>

<style>
	nav { display: grid; gap: 8px; }
	a {
		display: flex; align-items: center; justify-content: space-between; gap: 12px;
		width: 100%; padding: 12px; border: 1px solid transparent; border-radius: 10px;
		background: transparent; color: #e1e5ef; text-align: left; font-size: 14px; text-decoration: none;
	}
	a:hover { background: #30374d; }
	a.active { background: #3c355d; border-color: #8273bc; color: white; }
	.badge { min-width: 24px; padding: 2px 6px; border-radius: 6px; background: #ffffff15; text-align: center; }
</style>
