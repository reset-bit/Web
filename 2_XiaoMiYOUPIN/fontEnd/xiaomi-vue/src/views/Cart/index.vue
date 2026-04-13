<template>
	<div class="container">
		<template  v-if="list.length > 0">
			<span v-on:click="mode = !mode" v-text="mode ? '完成' : '编辑'"></span>
			<ul v-on:click="changeCount">
				<li v-for="item in list" v-bind:key="item.id">
					<input type="checkbox" v-show="mode" v-model="item.checkedEdit"><!--编辑状态-->
					<input type="checkbox" v-show="!mode" v-model="item.checkedDefault">
					<span v-text="item.name"></span>
					<p>￥<span v-text="item.price"></span>.00</p>

					<!--<button class="btn-decrease" v-bind:disabled="item.count === 1"  v-bind:data-id="item.id">-</button>-->
					<!--<span v-text="item.count"></span>-->
					<!--<button class="btn-increase" v-bind:disabled="item.count === 5" v-bind:data-id="item.id">+</button>-->
					<MiCount v-bind:count="item.count" v-bind:max-count="5"/>
				</li>
			</ul>
			<div v-show="mode"><!--编辑状态-->
				<input type="checkbox" v-model="isCheckedAll">全选
				<button>删除</button>
			</div>
			<div v-show="!mode">
				<input type="checkbox" v-model="isCheckedAll">全选
				<span>合计：￥<span v-text="total"></span>.00元</span>
				<button v-bind:disabled="amount === 0">
					结算 <span v-show="amount !== 0" v-text='`(${amount})`'></span>
				</button>
			</div>
		</template>
		<p v-else>没有购物记录，<router-link to="/home">去购物</router-link></p>
	</div>
</template>

<script>
	import MiCount from '@/components/MiCount';

	export default {
	        name: 'Cart',
		components: {
	                MiCount
		},
		data() {
	                return {
	                        mode: false,// true表示进入编辑状态
		                list: []
	                };
		},
		created() {
	                this.$http({ method: 'post', url: '/cart/List' })
		                .then(data => {
                                        data.forEach(item => {
                                                item.checkedEdit  = false;
                                                item.checkedDefault = false;
                                        });
                                        this.list = data;
		                })
		                .catch(() => {});
//                         axios({
//	                         method: 'post',
//	                         url: '/cart/List',
//	                         headers: { Authorization: sessionStorage.getItem('token') }
//                         }).then(res => {
////			        console.log(res);
//                                 if(res.status === 200) {
//                                         switch(res.data.code) {
//                                                 case 200:
//                                                         res.data.data.forEach(item => {
//                                                                 item.checkedEdit  = false;
//                                                                 item.checkedDefault = false;
//                                                         });
//                                                         this.list = res.data.data;
//                                                         break;
//                                                 case 199:
//                                                 case 401:
//                                                 case 404:
//                                                 case 500:
//                                                         console.log(res.data.msg);
//                                         }
//                                 } else {
//                                         console.log(res.statusText);
//                                 }
//                         }).catch(err => console.log(err.message));
		 },
                computed: {
                        total() {// 总金额
                                let total = 0;
                                this.list.forEach(item => {
                                        if(item.checkedDefault) {
                                                total += item.price * item.count;
                                        }
                                });
                                return total;
                        },
                        amount() {// 总数量
                                let amount = 0;
                                this.list.forEach(item => {
                                        if(item.checkedDefault) {
                                                amount += item.count;
                                        }
                                });
                                return amount;
                        },
                        isCheckedAll: {
                                // 使用checkedxxx代替checked属性，用于判断选中状态
                                // edit状态与default状态使用同一isCheckedAll，二者值时刻同步。相比于当前状态，另一状态总是隐藏。每次切换mode，

                                // 非全选=》全选
                                get() {
                                        // 如果当前mode=true，则进入编辑状态。使用下标访问当前状态的checkedxxx。全true返回true
                                        return this.list.every(item => item[this.mode ? 'checkedEdit' : 'checkedDefault']);
                                },
                                // 全选=》非全选（否则只能在methods: {}中定义函数实现遍历操作）
                                set(value) {
                                        // value从使用v-model的双向绑定元素而来
                                        // 将全选按钮的值绑定到每个非全选checkbox。下标访问原理同上
                                        this.list.forEach(item => {
                                                item[this.mode ? 'checkedEdit' : 'checkedDefault'] = value;
                                        });
                                }
                        }
                },
		methods: {
	                changeCount(e) {
	                        // ajax->List，冒泡
	                        if(e.target.classList.contains('btn-decrease') || e.target.classList.contains('btn-increase')) {
					let id = parseInt(e.target.dataset.id);
					let url = `/cart/${e.target.classList.contains('btn-decrease') ? 'decrease' : 'increase'}/${id}`;
					this.$http({ method: 'post', url })
						.then(data => {
                                                        let target = this.list.find(item => item.id === id);
                                                        e.target.classList.contains('btn-decrease') ? target.count-- : target.count++;
						})
						.catch(() => {});
//                                        axios({ method: 'post', url, headers: { Authorization: sessionStorage.getItem('token') } })
//	                                        .then(res => {
//	                                                if(res.status === 200) {
//	                                                        switch(res.data.code) {
//		                                                        case 200:
//	                                                                        let target = this.List.find(item => item.id === id);
//	                                                                        e.target.classList.contains('btn-decrease') ? target.count-- : target.count++;
//	                                                                        break;
//	                                                                case 199:
//	                                                                case 401:
//	                                                                case 404:
//	                                                                case 500:
//	                                                                        console.log(res.data.msg);
//	                                                        }
//	                                                } else {
//	                                                        console.log(res.statusText);
//	                                                }
//	                                        })
//	                                        .catch(err => console.log(err.message));
	                        }
	                }
		}
	};
</script>

<style scoped>

</style>