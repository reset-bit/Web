<!-- 真正的地址管理页面 -->
<template>
	<div>
		<button class="btn-add">新增</button>
		<ul>
			<li v-for="item in list" v-bind:key="item.id">
				<h5 v-text="item.receiveName"></h5>
				<span v-text="item.receivePhone"></span>
				<p v-text="item.receiveRegion + '  ' + item.receiveDetail"></p>
				<button class="btn-update" v-bind:data-id="item.id">修改</button>
				<button class="btn-remove" v-bind:data-id="item.id" v-on:click="removeHandler">删除</button>
				<span>
					<span v-if="item.isDefault === 1">默认地址</span>
					<button class="btn-default" v-bind:data-id="item.id" v-else>设为默认地址</button>
				</span>
			</li>
		</ul>
	</div>
</template>

<script>
	import { mapState, mapActions } from 'vuex';

        export default {
                name: 'Address',
	        computed: {
		        ...mapState('addressTrue', ['list'])
	        },
	        methods: {
		        ...mapActions('addressTrue', ['init']),
		        removeHandler
	        },
	        mounted() {
			this.init();
	        }
        };
</script>

<style scpoed></style>