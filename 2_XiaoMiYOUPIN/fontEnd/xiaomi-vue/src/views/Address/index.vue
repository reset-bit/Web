<template>
	<div>
		<p>这是地址管理页面</p>
		<span v-text="$store.state.key"></span>
		<p v-text="$store.getters['keyPlus']"></p>
		<button v-on:click="$store.commit('changeKey', 101)">mutations-changeKey</button>
		<button v-on:click="$store.dispatch('changeKey', 102)">actions-changeKey</button>

		<hr>

		<p>vuex映射，因引入子仓库映射导致主仓库数据被替换</p>
		<span v-text="key"></span>
		<p v-text="keyPlus"></p>
		<button v-on:click="changeKey(101)">mutations-changeKey</button>
		<button v-on:click="changeKeyPlus(102)">actions-changeKey</button>

		<hr>

		<p>调用子仓库方法</p>
		<span v-text="$store.state.address.key"></span>
		<p v-text="$store.getters['address/keyPlus']"></p>
		<button v-on:click="$store.commit('address/changeKey', 201)">mutations-changeKey</button>
		<button v-on:click="$store.dispatch('address/changeKey', 202)">actions-changeKey</button>

		<hr>

		<p>映射子仓库</p>
		<span v-text="key"></span>
		<p v-text="keyPlus"></p>
		<button v-on:click="changeKey(201)">mutations-changeKey</button>
		<button v-on:click="changeKeyPlus(202)">actions-changeKey</button>
	</div>
</template>

<script>
	import {mapState, mapGetters, mapMutations, mapActions} from 'vuex';

	export default {
	        name: 'Address',
		created() {
	                console.log('root key:' + this.$store.state.key);
		},
//		computed: ...mapState(['key']),// 导入单个值
		computed: {
			...mapState('address', ['key']),
			...mapGetters('address', ['keyPlus'])
		},
		methods: {
			...mapMutations('address', ['changeKey']),
			...mapActions('address', {'changeKeyPlus': 'changeKey'})
		}
	};
</script>

<style scpoed></style>