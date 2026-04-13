<template>
	<div class="font">
		这是主页
		<MiNav />
		<MiCount v-for="item in list" v-bind:key="item.id"
					v-bind:count="item.count"
					v-bind:max-count="item.maxCount"
		                        v-model="item.count"/>
		<!--
			v-bind:decrease-handler="function() { item.count -= 1; }"
			v-bind:increase-handler="function() { item.count += 1; }"

                        v-on:decrease="item.count -= 1"
                        v-on:increase="item.count += 1"
                        v-on:change="function(count) { item.count = count }"
		-->
		<button v-on:click="$notice('this is notice')">点此出现notice</button>
		<button v-on:click="$alert('this is alert')">点此出现alert</button>
		<!-- confirm返回值为promise对象，要通过then传入点击 确定的回调函数。虽标红线，但能正常执行 -->
		<button v-on:click="$confirm('this is confirm').then(() => $alert('you clicked yes'))">点此出现confirm</button>
	</div>
</template>

<script>
	import MiNav from '@/components/MiNav';
	import MiCount from '@/components/MiCount';

	export default {
	        name: 'Home',
		components: { MiNav, MiCount },
		data() {
	                return {
                                list: [
                                        { id: 1, count: 1, maxCount: 5 },
                                        { id: 2, count: 5, maxCount: 5 },
                                        { id: 3, count: 3, maxCount: 5 }
                                ]
	                };
		},
		beforeCreate() {
	                console.log('beforeCreated');
		},
		created() {},
		beforeMount() {},
		mounted() {},
		beforeUpdate() {},
		updated() {},
		beforeDestroy() {},
		destroyed() {}
	};
</script>

<style scoped>
	.font { color: blue; }
</style>