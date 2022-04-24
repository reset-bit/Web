<template>
	<MiDialog>
		<p>this is protocol</p>
		<router-link to="/login" replace>同意</router-link>
		<button v-on:click="close">不同意</button>
	</MiDialog>
</template>

<script>
	import MiDialog from '../MiDialog';

	export default {
	        name: 'MiLoginAlert',
		components: { MiDialog },
		methods: {
	                close() {
	                        this.$destroy(true);
	                        this.$el.parentNode.removeChild(this.$el);
	                }
		}
	};
</script>

<style scoped>

</style>