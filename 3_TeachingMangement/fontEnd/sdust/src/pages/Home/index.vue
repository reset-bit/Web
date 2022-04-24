<template>
	<el-container>
		<el-aside :class="{ collapse: menu.isCollapse }">
			<div class="logo-wrapper">
				<img :src="logoWithText" alt="图片加载失败" v-show="!menu.isCollapse">
				<img :src="logo" alt="图片加载失败" v-show="menu.isCollapse">
			</div>
			<el-button icon="el-icon-s-operation" type="text" class="menu-button"
			           @click="menu.isCollapse = !menu.isCollapse"></el-button>
			<el-menu :collapse="menu.isCollapse" :collapse-transition="false" :default-active="menu.active"
			         @select="addTab" :key="menu.keyOfMenu">
				<template v-for="item in menu.list.filter(item => item.func_fid === 0)">
					<el-submenu v-if="item.func_key === ''" :key="item.func_id" :index="item.func_id.toString()">
						<template slot="title">
							<i class="el-icon-more-outline"></i>
							<span v-text="item.func_name"></span>
						</template>
						<el-menu-item v-for="child in menu.list.filter(child => child.func_fid === item.func_id)"
							:key="child.func_id" :index="child.func_key">
							<i v-if="menu.isCollapse" class="el-icon-setting"></i>
							<span v-text="child.func_name"></span>
						</el-menu-item>
					</el-submenu>
					<el-menu-item v-else :key="item.func_id" :index="item.func_key">
						<i v-if="menu.isCollapse" class="el-icon-setting"></i>
						<span v-text="item.func_name"></span>
					</el-menu-item>
				</template>
			</el-menu>
		</el-aside>
		<el-container class="content-wrapper">
			<el-header style="height: 60px;">
				<el-avatar icon="el-icon-user-solid"></el-avatar>
				<el-dropdown :hide-on-click="false">
					<div class="user-name-wrapper el-dropdown-link">
						<span v-text="username" class="user-name"></span>
						<i class="el-icon-arrow-down"></i>
					</div>
					<el-dropdown-menu slot="dropdown">
						<el-dropdown-item>
							<el-button type="text" icon="el-icon-switch-button" class="logout" @click="logout">退出登录</el-button>
						</el-dropdown-item>
					</el-dropdown-menu>
				</el-dropdown>
			</el-header>
			<el-main>
				<div class="content">
					<el-empty v-if="tabs.length === 0" description="暂无任务"></el-empty>
					<el-tabs v-else type="card" closable @tab-remove="removeTab" v-model="menu.active">
						<el-tab-pane v-for="item in tabs" :key="item.func_key" :label="item.func_name" :name="item.func_key">
							<component :is="components[item.func_key].component"
								@removeMenu="removeMenu" @addMenu="addMenu" @updateMenu="updateMenu"></component>
						</el-tab-pane>
					</el-tabs>
				</div>
			</el-main>
		</el-container>
	</el-container>
</template>

<script>
        import logoWithText from '@/assets/images/logo_title.png';
	import logo from '@/assets/images/logo.png';
	import components from '@/components';

	export default {
	        name: 'Home',
		data() {
	                return {
                                logoWithText,
		                logo,
		                components,
		                username: '',
	                        menu: {
                                        isCollapse: false,
                                        list: [],
		                        active: '',// func_key,
		                        keyOfMenu: 0
                                },
		                tabs: []
	                };
		},
		methods: {
	                removeMenu(func_id) { this.menu.list.splice(this.menu.list.findIndex(item => item.func_id === func_id), 1); },
			addMenu(func) {
	                        this.menu.list.push(func);
                                this.menu.keyOfMenu = new Date().getTime();// key改变将重新渲染组件
			},
			updateMenu(func) { this.menu.list.splice(this.menu.list.findIndex(item => item.func_id === func.func_id), 1, func); },
	                addTab(func_key) {// 回调参数已规定
	                        if(!this.tabs.some(item => item.func_key === func_key)) {
	                                let func_name = this.menu.list.find(item => item.func_key === func_key).func_name;
	                                this.tabs.push({ func_key, func_name });// func_key可当做key，需要加入tabs中
	                        }
	                        this.menu.active = func_key;
	                },
			removeTab(func_key) {// 回调参数已规定
				let pos = this.tabs.findIndex(item => item.func_key === func_key);
                                this.tabs.splice(pos, 1);
                                if(this.menu.active !== func_key) {// 删除的是未激活的标签
					return;
                                } else if(this.tabs.length === 0) {// 删除的是最后一个标签，且已无打开的标签
                                        this.menu.active = '';
                                } else if(pos === 0) {// 删除的是第一个
                                        this.menu.active = this.tabs[0].func_key;
				} else if(pos === this.tabs.length) {// 删除的是最后一个，且还有打开的标签
				        this.menu.active = this.tabs[this.tabs.length - 1].func_key;
				} else {
                                        this.menu.active = this.tabs[pos].func_key;
                                }
			},
			logout() {
	                        sessionStorage.removeItem('token');
	                        sessionStorage.removeItem('name');
	                        this.$notify({
		                        title: '成功',
		                        message: '已退出登录',
		                        type: 'success',
		                        showClose: false,
		                        duration: 1000
	                        });
                                setTimeout(() => {
                                        this.$router.replace('/login');
                                }, 1300);
			}
		},
		async created() {
	                try {
	                        this.menu.list = await this.$http({ method: 'post', url: '/user/getmenu' });
	                } catch(e) {}
	                this.username = sessionStorage.getItem('name');
		},
		mounted() {
	                const that = this;
	                window.onresize = () => {
	                        return (() => {
                                        let width = document.documentElement.clientWidth;
                                        that.menu.isCollapse = width < 768;
                                })();
	                }
		}
	};
</script>

<style scoped>
	.el-container {
		height: 100%;
	}
	/* aside侧边栏 */
	.el-aside {
		width: 220px !important;
		display: flex;
		flex-direction: column;
		box-shadow: 0 4px 4px 0 #eee;
		transition: width .4s;
		background-color: rgb(34,43,72);
		overflow: hidden;
	}
	.el-aside.collapse { width: 64px !important; }
	.el-aside::after {
		content: '';
		position: absolute;
		top: 10%;
		right: 0;
		height: 80%;
		width: 1px;
		background-color: #bbb;
	}
	.logo-wrapper {
		height: 60px;
		width: 100%;
		display: flex;
		align-items: center;
		justify-content: center;
		box-sizing: border-box;
		padding: 10px;
	}
	.logo-wrapper>img {
		display: inline-block;
		height: 34px;
	}
	.el-button.menu-button {
		box-sizing: border-box;
		border-top: 1px solid rgb(110,130,158);
		border-bottom: 1px solid rgb(110,130,158);
		border-radius: 0;
		color: #eee;
		font-size: 16px;
	}
	.el-menu { flex-grow: 1; box-sizing: border-box; border-right: 1px solid transparent; overflow: hidden; background-color: rgb(34,43,72); }
	.el-menu::-webkit-scrollbar { display: none; }
	.el-menu i { font-size: 14px;  color: #eee; }
	.el-submenu__title, li.el-menu-item { position: relative; }
	.el-submenu__title>span, li.el-menu-item>span {
		position: absolute;
		top: 50%;
		left: 50%;
		transform: translate(0, -50%);
		text-indent: -4.5em;
		font-size: 13px;
		color: #eee;
	}
	.el-submenu .el-menu-item { background-color: #eee; }
	.el-submenu .el-menu-item>span, .el-submenu--collapse .el-menu-item>span { color: rgb(34,43,72); }
	.el-menu-item.is-active { background-color: rgb(0,167,245); }
	.el-menu-item.is-active>span { color: #eee; }
	/* main主界面 */
	.el-container.content-wrapper .el-header {
		display: flex;
		justify-content: flex-end;
		align-items: center;
		box-shadow: 4px 0 4px 0 #aaa;
	}
	.el-avatar {
		width: 34px;
		height: 34px;
		display: flex;
		justify-content: center;
		align-items: center;
	}
	.user-name-wrapper { cursor: pointer; }
	span.user-name {
		padding-left: 10px;
		padding-right: 4px;
	}
	.el-button.logout {
		height: 20px;
		width: 100%;
		text-align: center;
		font-size: 14px;
		color: #000;
	}
	.el-main {
		background-color: whitesmoke;
		padding: 10px;
	}
	.content {
		box-sizing: border-box;
		height: 100%;
		width: 100%;
		background-color: #fff;
		border-radius: 4px;
		box-shadow: 0 0 4px 0 #eee;
		padding: 10px;
		display: flex;
		justify-content: center;
		align-items: center;
	}
	.el-tabs { height: 100%; width: 100%; }
	.el-tabs__content { height: 100%; overflow: auto; }
</style>