<script lang="ts">
	type Props = {
		draft: string;
		disabled?: boolean;
		onSend: () => void;
	};

	let { draft = $bindable(), disabled = false, onSend }: Props = $props();

	let canSend = $derived(!disabled && draft.trim().length > 0);

	function handleSubmit(event: SubmitEvent) {
		event.preventDefault();
		if (!canSend) return;
		onSend();
	}
</script>

<form onsubmit={handleSubmit}>
	<label for="message">Your message</label>
	<div class="composer">
		<input
			id="message"
			name="message"
			bind:value={draft}
			{disabled}
			placeholder="Ask a question about Svelte..."
			autocomplete="off"
			required
		/>
		<button class="clear-button" type="button" onclick={() => draft = ''} disabled={draft.length === 0}>Clear</button>
		<button class="send-button" type="submit" disabled={!canSend}>Send</button>
	</div>
	<p class="hint">Press Enter to send. Whitespace-only messages are disabled.</p>
</form>

<style>
	label { display: block; margin-bottom: 8px; font-size: 14px; font-weight: 600; }
	.composer { display: flex; gap: 10px; }
	input { min-width: 0; width: 100%; padding: 14px; border: 1px solid #9ba4b9; border-radius: 10px; background: white; color: inherit; }
	.clear-button, .send-button { padding: 12px 22px; border: 0; border-radius: 10px; font-weight: 600; }
	.clear-button { background: #dfe2eb; color: #596175; }
	.clear-button:hover:not(:disabled) { background: #c5cbd6; }
	.clear-button:disabled { background: #f0f0f0; color: #a0a0a0; }
	.send-button { background: #6550bb; color: white; }
	.send-button:hover:not(:disabled) { background: #503c9f; }
	.send-button:disabled { background: #dfe2eb; color: #596175; }
	.hint { color: #60697b; font-size: 12px; }
</style>
