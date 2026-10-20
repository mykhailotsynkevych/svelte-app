<script lang="ts">
	import { navigating } from '$app/state';
	import favicon from '#lib/assets/favicon.svg';
	import type { LayoutProps } from './$types';

	let { children }: LayoutProps = $props();
</script>

<svelte:head>
	<link rel="icon" href={favicon} />
</svelte:head>

<header class="site-header">
	<a class="site-brand" href="/">Svelte Lab</a>
	<nav aria-label="Основная навигация">
		<a href="/">Workspace</a>
		<a href="/forms">Forms</a>
		<a href="/about">About Project</a>
	</nav>
</header>

{#if navigating.to}
	<div class="navigation-progress" role="status" aria-live="polite">
		<span class="visually-hidden">Переход на другую страницу</span>
	</div>
{/if}

{@render children()}

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

	.site-header {
		display: flex; flex-wrap: wrap; align-items: center; justify-content: space-between;
		gap: 16px; min-height: 72px; padding: 16px 24px;
		border-bottom: 1px solid #e0e3ed; background: white;
	}
	.site-brand { color: #202435; font-size: 20px; font-weight: 800; text-decoration: none; }
	nav { display: flex; flex-wrap: wrap; gap: 20px; }
	nav a { color: #6550bb; text-underline-offset: 4px; }
	.navigation-progress {
		position: fixed; z-index: 10; inset: 0 0 auto; height: 3px;
		overflow: hidden; background: #e5e0fa;
	}
	.navigation-progress::after {
		display: block; width: 35%; height: 100%; background: #6550bb;
		content: ''; transform-origin: left; animation: progress 1s ease-in-out infinite alternate;
	}
	.visually-hidden {
		position: absolute; width: 1px; height: 1px; padding: 0; margin: -1px;
		overflow: hidden; clip: rect(0, 0, 0, 0); white-space: nowrap; border: 0;
	}
	@keyframes progress { from { transform: translateX(0) scaleX(0.5); } to { transform: translateX(190%) scaleX(1); } }
	@media (prefers-reduced-motion: reduce) {
		.navigation-progress::after { width: 100%; animation: none; }
	}
</style>
