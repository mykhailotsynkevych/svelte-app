<script lang="ts">
	import ChatList from '#lib/components/ChatList.svelte';
	import MessageComposer from '#lib/components/MessageComposer.svelte';
	import MessageList from '#lib/components/MessageList.svelte';
	import type { Chat } from '#lib/types.js';

	let chats = $state<Chat[]>([
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
	]);
	let activeChatId = $state('svelte');
	let draft = $state('');
	let nextMessageId = 2;

	let activeChat = $derived(chats.find((chat) => chat.id === activeChatId));
	let messageCount = $derived(activeChat?.messages.length ?? 0);

	// Derived state for the total message count across all chats
	let totalMessageCount = $derived(chats.reduce((sum, chat) => sum + chat.messages.length, 0));

	function selectChat(id: string) {
		activeChatId = id;
		draft = '';
	}

	function sendMessage() {
		if (!activeChat || !draft.trim()) return;

		activeChat.messages.push({ id: nextMessageId++, text: draft.trim() });
		draft = '';
	}
</script>

<svelte:head>
	<title>Svelte Lab | Workspace</title>
	<meta
		name="description"
		content="A local learning workspace for exploring Svelte 5 from a React background."
	/>
</svelte:head>

<div class="workspace">
	<aside class="sidebar">
		<a class="brand" href="/">Svelte<span>Lab</span></a>
		<p class="eyebrow">Your learning workspace</p>
		<ChatList title="My Chats" {chats} {activeChatId} onSelect={selectChat} />
		<p class="local-note">Local demo. No AI, no API, no persistence. Reloading resets all messages.</p>
		<p class="total-message-count">Total messages: {totalMessageCount}</p>
	</aside>

	<main>
		<header>
			<p class="eyebrow">Lesson 05 / Named snippets</p>
			<h1>{activeChat?.title ?? 'Select a chat'}</h1>
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
				{#if activeChat?.title}
					<h2>{activeChat.title}</h2>
				{/if}
				<h2>A fresh conversation</h2>
				<p>Send your first message and watch the counters update.</p>
			</div>
		</MessageList>

		<MessageComposer bind:draft disabled={!activeChat} onSend={sendMessage} />
	</main>

	<aside class="lesson" aria-labelledby="lesson-title" lang="ru">
		<p class="eyebrow">Сравниваем с React</p>
		<h2 id="lesson-title">Именованные<br />snippets</h2>
		<dl>
			<dt><code>{'{#snippet item(message)}'}</code></dt>
			<dd>Именованный фрагмент шаблона с параметром. Объявлен внутри MessageList на странице и автоматически передаётся как prop item.</dd>
			<dt><code>Snippet&lt;[Message]&gt;</code></dt>
			<dd>Тип snippet, принимающего один аргумент Message. Квадратные скобки описывают кортеж аргументов, а не массив сообщений.</dd>
			<dt><code>{'{@render item(message)}'}</code></dt>
			<dd>MessageList передаёт текущее сообщение в шаблон страницы. Список отвечает за перебор и ключи, страница — за содержимое карточки.</dd>
			<dt><code>Render props в React</code></dt>
			<dd>Похожий API: {'renderItem={(message) => <p>{message.text}</p>}'}. В Svelte вместо функции с JSX используется snippet.</dd>
			<dt><code>item и children</code></dt>
			<dd>Именованный item выводит каждое сообщение. Остальная вложенная разметка по-прежнему становится children для пустого состояния.</dd>
		</dl>
		<div class="exercise">
			<h3>Проверь себя</h3>
			<p>Проследи путь данных: MessageList берёт message из массива → передаёт в item(message) → шаблон страницы выводит message.text.</p>
			<p>Твоё упражнение: добавь второй параметр index. Обнови тип snippet и вызов в списке, затем выведи на странице «You · #1», «You · #2» и так далее.</p>
		</div>
	</aside>
</div>

<style>
	:global(body) {
		margin: 0;
		background: #f5f6fa;
		color: #202435;
		font-family: system-ui, sans-serif;
		line-height: 1.5;
	}

	:global(*) { box-sizing: border-box; }
	:global(button), :global(input) { font: inherit; }
	:global(button) { cursor: pointer; }
	:global(button:disabled) { cursor: not-allowed; }
	:global(:focus-visible) { outline: 3px solid #6954d9; outline-offset: 4px; }

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
	.exercise { margin-top: 32px; padding: 16px; border-radius: 12px; background: #f0edf9; font-size: 13px; }
	.exercise h3 { margin-top: 0; }
	.exercise p:last-child { margin-bottom: 0; }

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
