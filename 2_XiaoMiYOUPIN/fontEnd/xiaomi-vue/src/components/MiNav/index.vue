<template>
	<div class="nav-content">
		<router-link class="footer-item" to="/home"><i class="avatar"></i><span>首页</span></router-link>
		<router-link class="footer-item" to="/category"><i class="avatar"></i><span>分类</span></router-link>
		<router-link class="footer-item" to="/cart"><i class="avatar"></i><span>购物车</span></router-link>
		<router-link class="footer-item" to="/profile"><i class="avatar"></i><span>个人</span></router-link>
	</div>
</template>

<script>
	export default {
	        name: 'MiNav'
	};
</script>

<style scoped>
	.nav-content {
		height: 100%;
		width: 100%;
		display: flex;
	}
	a.footer-item {
		height: 100%;
		width: 25%;
		flex-grow: 1;
		flex-basis: 0;
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
		text-decoration: none;
	}
	i.avatar {
		display: inline-block;
		height: 6.4vw;
		width: 6.4vw;
		background-image: url(./nav_bg.png);
		background-size: 100% auto;
	}
	a.footer-item:nth-child(1)>i.avatar {
		background-position: 0 0;
	}
	a.footer-item:nth-child(1).active>i.avatar {
		background-position: 0 14.2857%;
	}
	a.footer-item:nth-child(2)>i.avatar {
		background-position: 0 28.5714%;
	}
	a.footer-item:nth-child(2).active>i.avatar {
		background-position: 0 42.8571%;
	}
	a.footer-item:nth-child(3)>i.avatar {
		background-position: 0 57.1428%;
	}
	a.footer-item:nth-child(3).active>i.avatar {
		background-position: 0 71.4286%;
	}
	a.footer-item:nth-child(4)>i.avatar {
		background-position: 0 85.7142%;
	}
	a.footer-item:nth-child(4).active>i.avatar {
		background-position: 0 100%;
	}
	a.footer-item>span {
		font-size: 12px;
		color: gray;
	}
	a.footer-item.active>span {
		color: #eab151;
	}
	sup.cart-count {
		position: absolute;
		right: 25%;
		top: 0;
		height: 18px;
		width: 18px;
		align-items: center;
		justify-content: center;
		font-size: 12px;
		transform: scale(.8);
		color: #fff;
		background-color: red;
		border-radius: 50%;
	}
</style>