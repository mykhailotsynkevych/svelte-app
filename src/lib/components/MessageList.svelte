<script lang="ts">
	import type { Snippet } from 'svelte';
	import type { Message } from '#lib/types.js';

	type Props = {
		messages: Message[];
		item: Snippet<[Message, number]>;
		children: Snippet;
	};

	let { messages, item, children }: Props = $props();
</script>

<section class="conversation" aria-label="Messages">
	{#each messages as message, index (message.id)}
		<article class="message">
			{@render item(message, index)}
		</article>
	{:else}
		{@render children()}
	{/each}
</section>

<style>
	.conversation { flex: 1; padding: 24px 0 40px; }
	.message { margin-bottom: 16px; padding: 18px 22px; border: 1px solid #e0e3ed; border-radius: 14px; background: white; }
</style>
