<template>
	<div class="mi-dialog" v-on:click.self="$emit('close')">
		<div class="content">
			<!-- 使用slot标签作为占位符，提供可复用的底层插件 -->
			<div class="header">
				<slot v-bind:num='100'></slot>
			</div>
			<slot name="footer"></slot>
		</div>
	</div>
</template>

<script>
	export default {
	        name: 'MiDialog'
	};
</script>

<style scoped>
	.mi-dialog {
		position: fixed;
		top: 0;
		left: 0;
		height: 100%;
		width: 100%;
		background-color: rgba(0,0,0,.5);
	}
	.content {
		position: absolute;
		top: 50%;
		left: 50%;
		transform: translate(-50%, -50%);
		background-color: #fff;
		padding: 20px 30px;
		display: flex;
		flex-direction: column;
		justify-content: space-around;
		align-items: center;
	}
</style>