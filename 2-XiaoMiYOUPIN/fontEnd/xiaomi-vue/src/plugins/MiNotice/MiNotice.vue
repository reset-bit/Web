<template>
	<p class="mi-notice" v-text="text"></p>
</template>

<script>
	export default {
	        name: 'MiNotice',
		data() {
	                return {
	                        text: ''
	                };
		},
		mounted() {
	                setTimeout(() => {
	                        this.$destroy(true);// 销毁自身实例对象，并删除关联事件
		                this.$el.parentNode.removeChild(this.$el);// 移除dom。this.$el是组件根节点对应dom
	                }, 1000);
		}
	};
</script>

<style scoped>
	p.mi-notice {
		position: fixed;
		top: 50%;
		left: 50%;
		transform: translate(-50%, -50%);
		padding: 20px 30px;
		background-color: #000;
		color: #fff;
		min-width: 60%;
		max-width: 80%;
	}
</style>