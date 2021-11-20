<script>
	export let selected = false;
</script>

<span class:selected><slot /></span>

<style>
	.selected {
		color: var(--primary-color);
		font-weight: 900;
	}
</style>
