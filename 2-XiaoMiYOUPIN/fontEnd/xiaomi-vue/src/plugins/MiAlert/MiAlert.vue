<template>
	<MiDialog v-on:close="close">
		<!-- 使用template不渲染出的组件接收slot传值 -->
		<template slot-scope="{ num }">
			<img v-bind:src="icon" alt="">
			<span v-text="num"></span>
			<button v-on:click="close" slot="footer">确定</button>
			<p v-text="text"></p>
		</template>
	</MiDialog>
</template>

<script>
	import MiDialog from '../MiDialog';
	import icon from './icon.png';

	export default {
	        name: 'MiAlert',
		components: {
	                MiDialog
		},
		data() {
	                return {
	                        icon,
		                text: ''
	                }
		},
		methods: {
	                close() {
                                this.$destroy(true);
                                this.$el.parentNode.removeChild(this.$el);
	                }
		}
	};
</script>

<style scoped></style>