<script lang="ts">
	import { enhance } from '$app/forms';
	import type { PageProps } from './$types';

	let { form }: PageProps = $props();
	let values = $derived(form?.values ?? { name: '', message: '' });
</script>

<svelte:head>
	<title>Formular und serverseitige Validierung | Svelte Lab</title>
	<meta
		name="description"
		content="Ein Lernformular mit serverseitiger Validierung über SvelteKit Form Actions."
	/>
</svelte:head>

<main class="form-page" lang="de">
	<a href="/chats/svelte">← Zurück zum Chat</a>
	<p class="eyebrow">SvelteKit · form actions</p>
	<h1>Formular mit serverseitiger Validierung</h1>
	<p class="intro">
		Das Formular sendet eine normale POST-Anfrage. Der Server überprüft Name und Nachricht und
		gibt entweder Fehlermeldungen oder eine Bestätigung zurück. Die Daten werden weder gespeichert
		noch versendet.
	</p>

	{#if form?.success}
		<p class="success" role="status">
			Der Server hat das Formular geprüft: Es gibt keine Fehler. Die Beispieldaten wurden nicht gespeichert.
		</p>
	{/if}

	<form method="POST" action="?/validate" use:enhance>
		<label for="name">Name</label>
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

		<label for="message">Nachricht</label>
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

		<button type="submit">Auf dem Server prüfen</button>
	</form>

	<section class="concepts" aria-labelledby="concepts-title">
		<h2 id="concepts-title">Was passiert?</h2>
		<ol>
			<li>Das HTML-Formular sendet seine Felder per POST an die Action <code>validate</code>.</li>
			<li><code>request.formData()</code> liest die übermittelten Werte auf dem Server aus.</li>
			<li><code>fail(400, ...)</code> gibt die Werte und Fehler zurück; die Seite zeigt sie erneut neben den Feldern an.</li>
			<li>Bei Erfolg gibt die Action <code>success: true</code> zurück. <code>use:enhance</code> ermöglicht das Absenden ohne Neuladen; das HTML-Formular funktioniert aber auch ohne JavaScript.</li>
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
