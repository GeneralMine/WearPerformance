<script>
	import { goto } from '$app/navigation';

	export let text = null;
	export let url;
	export let alternative = false;
	export let round = false;
	export let disabled = false;
	import { createEventDispatcher } from 'svelte';

	const dispatch = createEventDispatcher();
</script>

<button
	href={url}
	class:alternative
	class:round
	{disabled}
	on:click={() => {
		if (url) {
			goto(url);
		} else {
			dispatch('click');
		}
	}}
>
	{#if text}
		{text}
	{:else}
		<slot />
	{/if}
</button>

<style>
	button {
		background-color: var(--primary-color);
		color: white;
		border: none;
		padding: 10px 22px;
		text-align: center;
		text-decoration: none;
		display: inline-block;
		font-size: 16px;
		font-weight: 600;
		margin: 4px 2px;
		transition-duration: 0.2s;
		cursor: pointer;
		border-radius: 0.5rem;
	}

	button:hover:not(:disabled) {
		color: var(--primary-color);
		background-color: var(--background-color);
		-webkit-box-shadow: inset 0px 0px 0px 2px var(--primary-color);
		-moz-box-shadow: inset 0px 0px 0px 2px var(--primary-color);
		box-shadow: inset 0px 0px 0px 2px var(--primary-color);
	}

	button:disabled {
		background-color: #444444;
		cursor: default;
	}

	.alternative {
		background-color: var(--background-color);
		color: var(--primary-color);
	}

	.round {
		border-radius: 100%;
		width: 3rem;
		height: 3rem;
		display: flex;
		align-items: center;
		justify-content: center;
		padding: 0;
		font-size: 3rem;
		margin: 2px;
	}
</style>
