<template>
	<MiDialog v-on:close="close">
		<img v-bind:src="icon" alt="">
		<p v-text="text"></p>
		<div slot="footer">
			<button v-on:click="ok">确定</button>
			<button v-on:click="close">取消</button>
		</div>
	</MiDialog>
</template>

<script>
	import MiDialog from '../MiDialog';
	import icon from './icon.png';

	export default {
	        name: 'MiConfirm',
		components: {
	                MiDialog
		},
		data() {
	                return {
	                        icon,
	                        text: '',
		                resolve: null,
		                reject: null
	                };
		},
		methods: {
	                close() {
	                        this.reject();
	                        this.$destroy(true);
	                        this.$el.parentNode.removeChild(this.$el);
	                },
			ok() {
				this.resolve();
				this.$destroy(true);
				this.$el.parentNode.removeChild(this.$el);
			}
		}
	};
</script>

<style scoped></style>