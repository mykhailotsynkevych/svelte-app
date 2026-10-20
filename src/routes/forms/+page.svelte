<script lang="ts">
	import { enhance } from '$app/forms';
	import type { PageProps } from './$types';

	let { form }: PageProps = $props();
	let values = $derived(form?.values ?? { name: '', message: '' });
</script>

<svelte:head>
	<title>Форма и серверная валидация | Svelte Lab</title>
	<meta
		name="description"
		content="Учебная форма с серверной валидацией через SvelteKit form actions."
	/>
</svelte:head>

<main class="form-page" lang="ru">
	<a href="/chats/svelte">← Вернуться к чату</a>
	<p class="eyebrow">SvelteKit · form actions</p>
	<h1>Форма с серверной валидацией</h1>
	<p class="intro">
		Форма отправляет обычный POST-запрос. Сервер проверяет имя и сообщение, затем возвращает
		ошибки или подтверждение. Данные не сохраняются и не отправляются.
	</p>

	{#if form?.success}
		<p class="success" role="status">
			Сервер проверил форму: ошибок нет. Данные демонстрационные и не сохранены.
		</p>
	{/if}

	<form method="POST" action="?/validate" use:enhance>
		<label for="name">Имя</label>
		<input
			id="name"
			name="name"
			value={values.name}
			minlength="2"
			maxlength="40"
			autocomplete="name"
			required
			aria-invalid={form?.errors.name ? 'true' : undefined}
			aria-describedby={form?.errors.name ? 'name-error' : undefined}
		/>
		{#if form?.errors.name}
			<p class="error" id="name-error">{form.errors.name}</p>
		{/if}

		<label for="message">Сообщение</label>
		<textarea
			id="message"
			name="message"
			value={values.message}
			maxlength="280"
			rows="5"
			required
			aria-invalid={form?.errors.message ? 'true' : undefined}
			aria-describedby={form?.errors.message ? 'message-error' : undefined}
		></textarea>
		{#if form?.errors.message}
			<p class="error" id="message-error">{form.errors.message}</p>
		{/if}

		<button type="submit">Проверить на сервере</button>
	</form>

	<section class="concepts" aria-labelledby="concepts-title">
		<h2 id="concepts-title">Что происходит</h2>
		<ol>
			<li>HTML отправляет поля формы методом POST в action <code>validate</code>.</li>
			<li><code>request.formData()</code> читает входные значения на сервере.</li>
			<li><code>fail(400, ...)</code> возвращает значения и ошибки; страница снова показывает их рядом с полями.</li>
			<li>При успехе action возвращает <code>success: true</code>. <code>use:enhance</code> улучшает отправку без перезагрузки, но HTML-форма работает и без JavaScript.</li>
		</ol>
	</section>
</main>

<style>
	.form-page { max-width: 720px; margin: 0 auto; padding: 40px 24px 64px; }
	.form-page > a { color: #6550bb; text-underline-offset: 4px; }
	.eyebrow { margin: 28px 0 4px; color: #6550bb; font-size: 12px; font-weight: 700; letter-spacing: 0.1em; text-transform: uppercase; }
	h1 { margin: 8px 0; font-size: clamp(26px, 4vw, 38px); line-height: 1.2; }
	.intro, .concepts { color: #60697b; }
	form { display: grid; gap: 10px; margin-top: 28px; padding: 24px; border: 1px solid #e0e3ed; border-radius: 14px; background: white; }
	label { margin-top: 8px; color: #202435; font-weight: 600; }
	input, textarea { width: 100%; padding: 12px; border: 1px solid #9ba4b9; border-radius: 8px; background: white; color: #202435; font: inherit; }
	textarea { resize: vertical; }
	[aria-invalid='true'] { border-color: #b42318; }
	.error { margin: -4px 0 4px; color: #b42318; font-size: 14px; }
	button { justify-self: start; margin-top: 12px; padding: 12px 18px; border: 0; border-radius: 8px; background: #6550bb; color: white; font: inherit; font-weight: 600; cursor: pointer; }
	button:hover { background: #503c9f; }
	.success { margin-top: 24px; padding: 14px; border: 1px solid #8ac6a5; border-radius: 8px; background: #edf8f0; color: #205c38; }
	.concepts { margin-top: 36px; }
	.concepts h2 { color: #202435; font-size: 20px; }
	.concepts li { margin: 10px 0; padding-left: 4px; }
	code { color: #503c9f; }
</style>
