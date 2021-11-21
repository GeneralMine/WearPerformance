<script>
	import { goto } from '$app/navigation';
	import ProgressBar from '$lib/Common/ProgressBar.svelte';

	export let cloth;
	export let log = false;
</script>

<div class="clothListItemContainer clickArea" on:click={() => goto(`/cloth/${cloth.id}`)}>
	<div class="clothListItemImg">
		<img src={cloth.img} alt="" />
	</div>
	<div class="clothListItemInfo">
		<div class="clothListItemInfoTop">{cloth.name}</div>
		<div class="clothListItemInfoMiddle">
			<div class="clothListItemInfoMiddleLeft">Stat 1: x</div>
			<div class="clothListItemInfoMiddleRight">Stat 2: y</div>
		</div>
		<div class="clothListItemInfoBottom">
			<ProgressBar small={true} min="0" max="100" value={Math.random() * 100} />
		</div>
	</div>
	<img src="/icons/loop-arrow.png" class="loopArrow" class:log alt="" />
</div>

<style>
	.clothListItemContainer {
		display: flex;
		flex-direction: row;
		height: 6rem;
		padding: 0.25rem;
		padding-bottom: 0.4rem;
		margin: 0.5rem;
		border-radius: 10px;
		box-shadow: 0px 0px 10px rgb(161, 161, 161);
	}
	img {
		width: 100%;
		height: 100%;
		object-fit: scale-down;
	}
	.log {
		visibility: hidden;
	}
	.loopArrow {
		width: 2rem;
		height: 2rem;
		border-left: rgb(161, 161, 161) solid 1px;
		margin-left: 1rem;
		display: flex;
		align-items: center;
		justify-content: center;
		padding-left: 0.25rem;
		height: 100%;
		visibility: hidden;
	}
	.clothListItemImg {
		width: 30%;
		padding: 0.3rem;
	}
	.clothListItemInfo {
		height: 100%;
		width: 60%;
		display: flex;
		flex-direction: column;
	}
	.clothListItemInfoTop {
		display: flex;
		flex-direction: row;
		align-items: center;
		width: 100%;
	}
	.clothListItemInfoMiddle {
		width: 100%;
		display: flex;
		flex-direction: row;
		justify-content: space-between;
		align-items: center;
	}
	.clothListItemInfoBottom {
		width: 100%;
	}
</style>
