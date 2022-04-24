<template>
	<!-- 有且仅有一个根节点 -->
	<div class="container">
		<div class="header"></div>
		<div class="content">
			<div class="left">
				<ul v-if="listMain.length > 0">
					<li v-for="item in listMain" v-bind:key="item.id"  v-bind:class="{active: activeId === item.id}" v-on:click="activeId = item.id">
						<span v-text="item.name"></span>
					</li>
				</ul>
			</div>
			<div class="right">
				<img v-bind:src="avatar" alt="">
				<ul v-if="listSub.length > 0">
					<li v-for="item in listSub" v-bind:key="item.id">
						<!-- router-link路由传参 -->
						<router-link v-bind:to="`/list/${item.id}/${item.name}/${item.pid}`">
							<img v-bind:src="item.avatar" alt="">
							<span v-text="item.name"></span>
						</router-link>
					</li>
				</ul>
				<p v-else>暂无相关分类</p>
			</div>
		</div>
		<div class="footer">
			<MiNav />
		</div>
	</div>
</template>

<script>
	import axios from 'axios';
	import MiNav from '@/components/MiNav';// 导入

	export default {
	        name: 'Category',
		components: { MiNav },// 注册
		data() {// es6简写
			return {
			        activeId: 0,
				listMain: [],
				listSub: []
			};
                },
		computed: {// 计算属性
			avatar: function() {
			        return this.activeId ? this.listMain.find(item => item.id === this.activeId).avatar : '';
			}
		},
		watch: {
	                activeId: function(newValue, oldValue) {
	                        this.$http({ url: '/category/list/' + newValue })
		                        .then(data => {
                                                this.listSub = data;
		                        })
		                        .catch(() => {});
//                                axios({ url: '/category/list/' + newValue }).then(res => {
////			        console.log(res);
//                                        if(res.status === 200) {
//                                                switch(res.data.code) {
//	                                                case 200:
//	                                                        this.listSub = res.data.data;
//	                                                        break;
//	                                                case 199:
//	                                                case 401:
//	                                                case 404:
//	                                                case 500:
//	                                                        console.log(res.data.msg);
//                                                }
//                                        } else {
//                                                console.log(res.statusText);
//                                        }
//                                }).catch(err => console.log(err.message));
	                }
		},
		created() {
	                // 发送ajax，请求页面初始数据
                        this.$http({ url: '/category/list/0' })
	                        .then(data => {
                                        this.listMain = data;
                                        this.activeId = data[0].id;
	                        })
	                        .catch(() => {});
//			axios({ url: '/category/list/0' }).then(res => {
////			        console.log(res);
//			        if(res.status === 200) {
//			                switch(res.data.code) {
//				                case 200:
//				                        this.activeId = res.data.data[0].id;
//				                        this.listMain = res.data.data;
//				                        break;
//				                case 199:
//				                case 401:
//				                case 404:
//				                case 500:
//				                        console.log(res.data.msg);
//			                }
//			        } else {
//                                        console.log(res.statusText);
//			        }
//			}).catch(err => console.log(err.message));
		}
	};
</script>

<!-- scoped添加额外属性作唯一属性，防止组件间相同类名样式产生覆盖。css仅覆盖当前组件中的元素 -->
<style scoped>
	.container {
		height: 100%;
		width: 100%;
		display: flex;
		flex-direction: column;
	}
	.header, .content, .footer {
		width: 100%;
		background-color: #fff;
	}
	.header {
		height: 45px;
		flex-shrink: 0;
		display: flex;
		justify-content: flex-end;
		align-items: center;
		position: relative;
		box-sizing: border-box;
		padding: 0 12px;
	}
	.content {
		flex-grow: 1;
		display: flex;
		border-top: 1px solid #D0D0D0;
		border-bottom: 1px solid #D0D0D0;
		overflow: hidden;
	}
	.left {
		width: 93px;
		height: 100%;
		flex-shrink: 0;
		overflow: auto;
	}
	.left::-webkit-scrollbar {
		display: none;
	}
	.left li.active span {
		color: red;
	}
	.right {
		box-sizing: border-box;
		display: flex;
		flex-direction: column;
		align-items: center;
		padding: 12px;
		flex-grow: 1;
		overflow: auto;
		background-color: whitesmoke;
	}
	.right::-webkit-scrollbar {
		display: none;
	}
	.right>* {
		width: 100%;
	}
	.right ul>li {
		width: 100%;
	}
	.right ul>li>a {
		display: block;
		width: 100%;
		height: 100%;
	}
	.footer {
		height: 13.3vw;
		flex-shrink: 0;
	}
</style>
