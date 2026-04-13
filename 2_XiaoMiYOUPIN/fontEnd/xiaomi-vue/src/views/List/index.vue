<template>
	<div class="container">
		<div class="header">
			<a v-on:click="$router.back()">&lt;</a>
			<h3 v-bind:text="title"></h3>
			<button>搜索</button>
		</div>
		<div class="category-list-wrapper">
			<ul class="category-list">
				<li v-for="item in categoryList" v-bind:key="item.id" :class="{ active: item.id === ajaxData.cid }">
					<router-link v-bind:to="`/list/${item.id}/${item.name}/${item.fid}`">
						<img v-bind:src="item.avatar" alt="">
						<span v-text="item.name"></span>
					</router-link>
				</li>
			</ul>
		</div>
		<div class="order-wrapper">
			<span v-on:click="changeOrder" :class="`{ ${ajax.orderDir } ${ ajaxData.orderCol === 'price' }`">价格</span>
			<span v-on:click="changeOrder" :class="`{ ${ajax.orderDir } ${ ajaxData.orderCol === 'sale' }`">销量</span>
			<span v-on:click="changeOrder" :class="`{ ${ajax.orderDir } ${ ajaxData.orderCol === 'rate' }`">评论</span>
		</div>
		<div class="content">
			<div class="scroll-wrapper">
				<ul class="list"></ul>
			</div>
			<p class="tip" v-text="tip"></p>
		</div>
	</div>
</template>

<script>
	import IScroll from 'iscroll/build/iscroll-probe.js';
	import imagesLoaded from 'imagesloaded';

	export default {
	        name: 'List',
		data() {
	                return {
                                fid: parseInt(this.$route.params.fid) || 1,
		                title: this.$route.title || '电视机',
		                ajaxData: {// 组合以监听多个值的变化
                                        cid: parseInt(this.$route.params.cid) || 17,
                                        name: '',
                                        orderCol: '',
                                        orderDir: '',
                                        pageSize: 6,
		                },
		                isLoading: false,
		                hasMore: true,
		                isTriggerLoadMore: false,
		                list: [],
		                categoryList: []
	                };
		},
		methods: {
	                _initOrRefreshCategoryScroll() {},
			changeOrder() {}
	        },
		created() {
	                this.scroll = null;// 不适合直接放在data中：值的更改不涉及到页面更新渲染
		},
		computed: {
	                tip() {
	                      if(this.isLoading) {
	                              return '——加载中——';
                              } else if(this.isTriggerLoadMore) {
					return '——放手立即加载——';
                              } else if(this.hasMore) {
					return '——上拉加载更多——';
	                      } else if(this.list.length === 0) {
					return '——暂无相关商品——';
	                      } else {
	                              return '——没有更多商品了——';
	                      }
	                }
		},
		activated() {},
		beforeRouterEnter() {},
		beforeDestory() {
	                // 销毁并释放scroll对象
	                if(this.scroll !== null) {
	                        this.scroll.destory();
	                        this.scroll  = null;
                        }
	        },
                watch: {
                        ajaxData: {// 监听对象键值变化
                                deep: true,
                                handler(newValue, oldValue) {
                                        // getdata()
                                }
                        },
                        fid(newValue, oldValue) {}
                }
	};
</script>

<style scoped>
	.container {
		width: 100%;
		height: 100%;
		display: flex;
		flex-direction: column;
	}
	.header {
		height: 12vw;
		flex-shrink: 0;
		display: flex;
		background-color: whitesmoke;
	}
	.header a, .header button {
		width: 12vw;
		flex-shrink: 0;
	}
	.header h3 {
		flex-grow: 1;
		text-align: center;
	}
</style>