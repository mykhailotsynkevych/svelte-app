<script lang="ts">
	import { afterNavigate } from '$app/navigation';
	import ChatList from '#lib/components/ChatList.svelte';
	import MessageComposer from '#lib/components/MessageComposer.svelte';
	import MessageList from '#lib/components/MessageList.svelte';
	import { createChats } from '#lib/chats.js';
	import type { PageProps } from './$types';

	let { data }: PageProps = $props();

	let chats = $state(createChats());
	let activeChatId = $derived(data.chatId);
	let draft = $state('');
	let nextMessageId = 2;

	let activeChat = $derived(chats.find((chat) => chat.id === activeChatId));
	let messageCount = $derived(activeChat?.messages.length ?? 0);

	// Derived state for the total message count across all chats
	let totalMessageCount = $derived(chats.reduce((sum, chat) => sum + chat.messages.length, 0));

	afterNavigate(() => {
		draft = '';
	});

	function sendMessage() {
		if (!activeChat || !draft.trim()) return;

		activeChat.messages.push({ id: nextMessageId++, text: draft.trim() });
		draft = '';
	}
</script>

<svelte:head>
	<title>{data.title} | Svelte Lab</title>
	<meta
		name="description"
		content="A local learning workspace for exploring Svelte 5 from a React background."
	/>
</svelte:head>

<div class="workspace">
	<aside class="sidebar">
		<a class="brand" href="/">Svelte<span>Lab</span></a>
		<p class="eyebrow">Your learning workspace</p>
		<ChatList title="My Chats" {chats} {activeChatId} />
		<p class="local-note">Local demo. No AI, no API, no persistence. Reloading resets all messages.</p>
		<p class="total-message-count">Total messages: {totalMessageCount}</p>
	</aside>

	<main>
		<header>
			<p class="eyebrow">Загрузка и ошибки</p>
			<h1>{data.title}</h1>
			<p class="message-count" aria-live="polite">
				{messageCount} {messageCount === 1 ? 'message' : 'messages'}
			</p>
		</header>

		<MessageList messages={activeChat?.messages ?? []}>
			{#snippet item(message, index)}
				<p class="author">You · #{index + 1}</p>
				<p class="message-text">{message.text}</p>
			{/snippet}

			<div class="empty-state">
				<h2>{data.title}</h2>
				<h2>A fresh conversation</h2>
				<p>Send your first message and watch the counters update.</p>
			</div>
		</MessageList>

		<MessageComposer bind:draft disabled={!activeChat} onSend={sendMessage} />
	</main>

	<aside class="lesson" aria-labelledby="lesson-title" lang="ru">
		<p class="eyebrow">Сравниваем с React</p>
		<h2 id="lesson-title">Серверная загрузка</h2>
		<dl>
			<dt><code>+page.server.ts</code></dt>
			<dd>load выполняется только на сервере: находит чат по chatId и передаёт заголовок странице.</dd>
			<dt><code>PageServerLoad</code></dt>
			<dd>Типизированная load получает params из URL. Возвращённые chatId и title приходят в страницу через data.</dd>
			<dt><code>error(404, ...)</code></dt>
			<dd>Неизвестный ID даёт HTTP 404, а не пустой список.</dd>
			<dt><code>+error.svelte</code></dt>
			<dd>Общая страница ошибки показывает статус и сообщение. Открой /chats/unknown, чтобы увидеть 404.</dd>
			<dt><code>$app/state → navigating</code></dt>
			<dd>В layout показывает, что клиентский переход ещё выполняется. При полной первой загрузке это не индикатор SSR.</dd>
			<dt><code>Почему полоса может мелькнуть?</code></dt>
			<dd>Локальная load очень быстрая и синхронная. Не добавляем искусственную задержку; на медленной сети индикатор будет заметнее.</dd>
		</dl>
	</aside>
</div>

<style>
	.workspace { display: grid; grid-template-columns: 260px minmax(0, 1fr) 300px; min-height: 100dvh; }
	.sidebar { padding: 32px 20px; background: #202435; color: #f5f6fa; }
	.brand { color: inherit; text-decoration: none; font-size: 26px; font-weight: 800; }
	.brand span { color: #c5bcff; }
	.eyebrow { font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.12em; }
	.sidebar .eyebrow { color: #b6bfd4; margin: 24px 0 16px; }
	.local-note { margin-top: 36px; color: #b6bfd4; font-size: 12px; }
	main { display: flex; flex-direction: column; min-width: 0; padding: 36px; }
	header .eyebrow, .lesson .eyebrow { color: #6550bb; }
	h1 { margin: 8px 0; font-size: clamp(24px, 3vw, 34px); line-height: 1.2; }
	.message-count { color: #60697b; font-size: 14px; }
	.author { margin: 0 0 8px; color: #6550bb; font-size: 12px; font-weight: 700; }
	.message-text { margin: 0; overflow-wrap: anywhere; white-space: pre-wrap; }
	.empty-state { padding: 48px 0; color: #60697b; }
	.empty-state h2 { color: #202435; font-size: 22px; }
	.lesson { padding: 36px 24px; border-left: 1px solid #e0e3ed; background: white; }
	.lesson h2 { font-size: 23px; line-height: 1.3; }
	dt { margin-top: 24px; font-size: 13px; color: #6550bb; overflow-wrap: anywhere; }
	dd { margin: 6px 0 0; color: #60697b; font-size: 13px; }

	@media (min-width: 1600px) {
		.workspace { max-width: 1600px; margin: 0 auto; }
	}

	@media (max-width: 1100px) {
		.workspace { grid-template-columns: 240px minmax(0, 1fr); }
		.lesson { grid-column: 1 / -1; border-top: 1px solid #e0e3ed; border-left: 0; }
	}

	@media (max-width: 640px) {
		.workspace { grid-template-columns: minmax(0, 1fr); }
		.sidebar, main, .lesson { padding: 24px 20px; }
		.local-note { margin-top: 16px; }
		.lesson { grid-column: auto; }
	}
</style>
