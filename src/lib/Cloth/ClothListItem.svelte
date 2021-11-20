<script>
	import { goto } from '$app/navigation';

	export let cloth;
</script>

<div class="clothListItemContainer clickArea" on:click={() => goto(`/cloth/${cloth.id}`)}>
	<div class="clothListItemImg">
		<img src="" alt="" />
	</div>
	<div class="clothListItemInfo">
		<div class="clothListItemInfoTop">Brown T.H. Hoodie</div>
		<div class="clothListItemInfoMiddle">
			<div class="clothListItemInfoMiddleLeft">Stat 1: x</div>
			<div class="clothListItemInfoMiddleRight">Stat 2: y</div>
		</div>
		<div class="clothListItemInfoBottom">
			<div class="clothListItemInfoBottomProgressbar">ProgressBar</div>
		</div>
	</div>
</div>

<style>
	.clothListItemContainer {
		display: flex;
		flex-direction: row;
		padding: 0.25rem;
		margin: 0.5rem;
		border-radius: 10px;
		box-shadow: 0px 0px 10px rgb(161, 161, 161);
	}
	.clothListItemImg {
		width: 30%;
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
		display: flex;
		flex-direction: row;
		align-items: center;
	}
</style>
