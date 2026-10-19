<script lang="ts">
	type Message = { id: number; text: string };
	type Chat = { id: string; title: string; messages: Message[] };

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
	let canSend = $derived(draft.trim().length > 0 && activeChat !== undefined);

	// Derived state for the total message count across all chats
	let totalMessageCount = $derived(chats.reduce((sum, chat) => sum + chat.messages.length, 0));

	function selectChat(id: string) {
		activeChatId = id;
		draft = '';
	}

	function sendMessage(event: SubmitEvent) {
		event.preventDefault();
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
		<nav aria-label="Chats">
			{#each chats as chat (chat.id)}
				<button
					class:active={chat.id === activeChatId}
					aria-current={chat.id === activeChatId ? 'true' : undefined}
					onclick={() => selectChat(chat.id)}
				>
					<span>{chat.title}</span>
					<span class="badge" aria-label={`${chat.messages.length} messages`}>
						{chat.messages.length}
					</span>
				</button>
			{/each}
		</nav>
		<p class="local-note">Local demo. No AI, no API, no persistence. Reloading resets all messages.</p>
		<p class="total-message-count">Total messages: {totalMessageCount}</p>
	</aside>

	<main>
		<header>
			<p class="eyebrow">Lesson 01 / Reactivity</p>
			<h1>{activeChat?.title ?? 'Select a chat'}</h1>
			<p class="message-count" aria-live="polite">
				{messageCount} {messageCount === 1 ? 'message' : 'messages'}
			</p>
		</header>

		<section class="conversation" aria-label="Messages">
			{#each activeChat?.messages ?? [] as message (message.id)}
				<article class="message">
					<p class="author">You</p>
					<p class="message-text">{message.text}</p>
				</article>
			{:else}
				<div class="empty-state">
					<h2>A fresh conversation</h2>
					<p>Send your first message and watch the counters update.</p>
				</div>
			{/each}
		</section>

		<form onsubmit={sendMessage}>
			<label for="message">Your message</label>
			<div class="composer">
				<input
					id="message"
					name="message"
					bind:value={draft}
					placeholder="Ask a question about Svelte..."
					autocomplete="off"
					required
				/>
				<button class="send-button" type="submit" disabled={!canSend}>Send</button>
			</div>
			<p class="hint">Press Enter to send. Whitespace-only messages are disabled.</p>
		</form>
	</main>

	<aside class="lesson" aria-labelledby="lesson-title" lang="ru">
		<p class="eyebrow">Сравниваем с React</p>
		<h2 id="lesson-title">Те же идеи.<br />Другие механизмы.</h2>
		<dl>
			<dt><code>$state</code></dt>
			<dd>Как useState, но без setter: присваивай значение напрямую. Обычные объекты и массивы глубоко реактивны.</dd>
			<dt><code>$derived</code></dt>
			<dd>Вычисляемое значение с автоматическим отслеживанием зависимостей. Аналог вычисления при рендере React, а не useEffect.</dd>
			<dt><code>bind:value</code></dt>
			<dd>Двусторонняя привязка: ввод обновляет draft, а изменение draft обновляет поле. Не нужно вручную писать value + onChange.</dd>
			<dt><code>onclick / onsubmit</code></dt>
			<dd>Свойства обработчиков событий: аналог onClick / onSubmit, но в нижнем регистре. В Svelte 5 директива on:click не нужна.</dd>
			<dt><code>{'{#each items as item (item.id)}'}</code></dt>
			<dd>Список со стабильными ключами: аналог items.map с key в React.</dd>
		</dl>
		<div class="exercise">
			<h3>Проверь себя</h3>
			<p>Отправь сообщение, переключись на другой чат и вернись. Сообщение сохранится до перезагрузки страницы.</p>
			<p>Общий счётчик уже добавлен через $derived. Проверь: отправка в любой чат увеличивает его на 1, а переключение чата не меняет.</p>
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
	nav { display: grid; gap: 8px; }
	nav button {
		display: flex; align-items: center; justify-content: space-between; gap: 12px;
		width: 100%; padding: 12px; border: 1px solid transparent; border-radius: 10px;
		background: transparent; color: #e1e5ef; text-align: left; font-size: 14px;
	}
	nav button:hover { background: #30374d; }
	nav button.active { background: #3c355d; border-color: #8273bc; color: white; }
	.badge { min-width: 24px; padding: 2px 6px; border-radius: 6px; background: #ffffff15; text-align: center; }
	.local-note { margin-top: 36px; color: #b6bfd4; font-size: 12px; }
	main { display: flex; flex-direction: column; min-width: 0; padding: 36px; }
	header .eyebrow, .lesson .eyebrow { color: #6550bb; }
	h1 { margin: 8px 0; font-size: clamp(24px, 3vw, 34px); line-height: 1.2; }
	.message-count { color: #60697b; font-size: 14px; }
	.conversation { flex: 1; padding: 24px 0 40px; }
	.message { margin-bottom: 16px; padding: 18px 22px; border: 1px solid #e0e3ed; border-radius: 14px; background: white; }
	.author { margin: 0 0 8px; color: #6550bb; font-size: 12px; font-weight: 700; }
	.message-text { margin: 0; overflow-wrap: anywhere; white-space: pre-wrap; }
	.empty-state { padding: 48px 0; color: #60697b; }
	.empty-state h2 { color: #202435; font-size: 22px; }
	label { display: block; margin-bottom: 8px; font-size: 14px; font-weight: 600; }
	.composer { display: flex; gap: 10px; }
	input { min-width: 0; width: 100%; padding: 14px; border: 1px solid #9ba4b9; border-radius: 10px; background: white; color: inherit; }
	.send-button { padding: 12px 22px; border: 0; border-radius: 10px; background: #6550bb; color: white; font-weight: 600; }
	.send-button:hover:not(:disabled) { background: #503c9f; }
	.send-button:disabled { background: #dfe2eb; color: #596175; }
	.hint { color: #60697b; font-size: 12px; }
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
