<script lang="ts">
	import { page } from '$app/state';
</script>

<svelte:head>
	<title>{page.status} | Svelte Lab</title>
</svelte:head>

<main class="error-page">
	<p class="status">{page.status}</p>
	<h1>{page.error?.message ?? 'Произошла ошибка'}</h1>
	<p>Не удалось открыть эту страницу.</p>
	<a href="/">Вернуться к чатам</a>
</main>

<style>
	.error-page { max-width: 640px; margin: 0 auto; padding: 72px 24px; }
	.status { margin: 0; color: #6550bb; font-size: 14px; font-weight: 700; }
	h1 { margin: 8px 0; font-size: clamp(24px, 4vw, 36px); }
	.error-page > p:not(.status) { color: #60697b; }
	a { color: #6550bb; text-underline-offset: 4px; }
</style>
