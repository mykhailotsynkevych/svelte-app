<script lang="ts">
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
		<a href="/about">About Project</a>
	</nav>
</header>

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
</style>
