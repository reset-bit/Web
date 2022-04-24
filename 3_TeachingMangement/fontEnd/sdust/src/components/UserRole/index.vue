<template>
	<el-container>
		<el-header>
			<el-form :inline="true" :model="search" class="search-form">
				<el-form-item label="用户名">
					<el-input v-model="search.user_name" placeholder="请输入"></el-input>
				</el-form-item>
				<el-form-item label="用户角色">
					<el-select v-model="search.role_id">
						<el-option label="请选择" :value="-1"></el-option>
						<el-option label="无角色" :value="0"></el-option>
						<el-option v-for="item in roleList" :key="item.role_id"
						           :label="item.role_name" :value="item.role_id"></el-option>
					</el-select>
				</el-form-item>
				<el-form-item>
					<el-button icon="el-icon-search" type="primary" @click="searchUsers">查询</el-button>
					<el-button icon="el-icon-plus" @click="beginAddHandler">新增用户</el-button>
				</el-form-item>
			</el-form>
		</el-header>
		<el-main>
			<el-table :data="list" :header-cell-style="{backgroundColor: 'rgb(244,247,250)'}" border @cell-click="opHandler">
				<el-table-column type="index" align="center"></el-table-column>
				<el-table-column prop="user_name" label="用户名" width="180" align="center"></el-table-column>
				<el-table-column label="密码" width="120" align="center">
					<template slot-scope="{row}">
						<span v-show="row.is_pwd_show">{{ row.user_pwd }}</span>
						<i class="el-icon-view pwd-control" :class="{ isActive: row.is_pwd_show }" @click="row.is_pwd_show = !row.is_pwd_show"></i>
					</template>
				</el-table-column>
				<el-table-column label="角色名" width="120" align="center">
					<template slot-scope="{row}">
						<span v-if="row.role_id !== null" v-text="roleList.find(item => item.role_id === row.role_id).role_name"></span>
						<span v-else>无角色</span>
					</template>
				</el-table-column>
				<el-table-column label="操作" align="center">
					<template slot-scope="{row}">
						<el-button size="small" icon="el-icon-edit" class="update">编辑</el-button>
						<el-button size="small" icon="el-icon-delete" class="remove">删除</el-button>
						<el-button size="small" icon="el-icon-setting" class="aboutRole">角色分配</el-button>
					</template>
				</el-table-column>
			</el-table>
		</el-main>
		<el-footer>
			<el-pagination layout="prev, pager, next, ->, total, jumper, sizes"
			               :page-sizes="[6, 8, 10, 12]" :page-size.sync="pagination.pageSize"
			               :total="pagination.total" :current-page.sync="pagination.currentPage"
			               @size-change="getCurrentPage()" @current-change="getCurrentPage(false)"
			               :hide-on-single-page="pagination.total === 1" background></el-pagination>
		</el-footer>
		<el-dialog :modal="false" :visible.sync="isEdit" title="新增用户">
			<el-form :model="model.data" :rules="model.rules" status-icon ref="form" label-width="50px">
				<el-form-item label="用户名" prop="user_name">
					<el-input type="text" v-model.tirm="model.data.user_name" :disabled="model.optionType !== 'add'"></el-input>
				</el-form-item>
				<el-form-item label="密码" prop="user_pwd" class="pwd-control-wrapper" v-show="model.optionType !== 'configRole'">
					<el-input type="password" v-model="model.data.user_pwd" v-show="!model.isPwdShow"></el-input>
					<el-input v-model="model.data.user_pwd" v-show="model.isPwdShow"></el-input>
					<i class="el-icon-view pwd-control" :class="{ isActive: model.isPwdShow }" @click="model.isPwdShow = !model.isPwdShow"></i>
				</el-form-item>
				<el-form-item label="角色" prop="role_id" v-show="model.optionType === 'configRole'">
					<el-select v-model="model.data.role_id">
						<el-option label="请选择" :value="-1"></el-option>
						<el-option v-for="item in roleList" :key="item.role_id" :label="item.role_name"
							:value="item.role_id"></el-option>
					</el-select>
				</el-form-item>
			</el-form>
			<div slot="footer" class="el-dialog__footer-content">
				<el-button @click="save" type="primary">确定</el-button>
				<el-button @click="isEdit = false">取消</el-button>
			</div>
		</el-dialog>
	</el-container>
</template>

<script>
	import { mapState, mapActions } from 'vuex';

        export default {
                name: 'UserRole',
	        data() {
                        return {
                                search: {
                                        user_name: '',
	                                role_id: -1
                                },
	                        list: [],
	                        pagination: {
                                        currentPage: 1,
		                        total: 0,
		                        pageSize: 6
	                        },
	                        isEdit: false,
	                        model: {
                                        data: {
                                                user_name: '',
                                                user_pwd: '',
	                                        role_id: -1
                                        },
		                        optionType: 'add',
		                        isPwdShow: false,
		                        rules: {
                                                user_name: [
	                                                {
	                                                        validator: async (rule, value, callback) => {
	                                                                let isLegal = await this.$http({ method: 'post', url: '/user/valid_name',
                                                                                data: { user_name: this.model.data.user_name } });
	                                                                if(value.length === 0) {
	                                                                        callback(new Error('请输入用户名'));
	                                                                } else if(value.length < 2 || value.length > 11) {
	                                                                        callback(new Error('用户名长度在2-11个字符之间'));
	                                                                } else if (this.model.optionType === 'add' && isLegal) {
                                                                                callback(new Error('用户名已存在'));
                                                                        } else {
                                                                                callback();
                                                                        }
	                                                        },
		                                                trigger: 'blur'
	                                                }
                                                ],
			                        user_pwd: [
				                        {
				                                validator: (rule, value, callback) => {
				                                        if(this.model.optionType === 'configRole') { callback(); }
                                                                        if(value.length === 0) {
                                                                                callback(new Error('请输入密码'));
                                                                        } else if(value.length < 2 || value.length > 10) {
                                                                                callback(new Error('密码长度在2-10个字符之间'));
                                                                        } else {
                                                                                callback();
                                                                        }
				                                },
					                        trigger: 'blur'
				                        }
			                        ],
			                        role_id: [
				                        {
				                                validator: (rule, value, callback) => {
                                                                        if(this.model.optionType !== 'configRole') { callback(); }
				                                        if(value === -1) {
				                                                callback(new Error('请选择角色'));
				                                        } else {
				                                                callback();
				                                        }
				                                },
					                        trigger: 'blur'
				                        }
			                        ]
		                        }
	                        }
                        };
	        },
	        computed: {
		        ...mapState('role', {'roleList': 'list'})
	        },
	        methods: {
		        ...mapActions('role', ['init']),
		        async getCurrentPage(isResetPage = true) {
		                isResetPage && (this.pagination.currentPage = 1);// 跳转第一页
		                try {
					let res = await this.$http({ method: 'post', url: '/user/list', data: {
						...this.search,
						begin: (this.pagination.currentPage - 1) * this.pagination.pageSize,
						pageSize: this.pagination.pageSize
					}});
					//  添加控制密码是否显示变量
					this.list = [];
					res.list.forEach(item => this.list.push({...item, is_pwd_show: false}));
					this.pagination.total = res.total;
		                } catch(e) {}
		        },
		        searchUsers() {
		                if(this.search.role_id === -1 && this.search.user_name === '') {
		                        this.$notify({
			                        title: '提示',
			                        message: '请选择查询条件',
			                        type: 'warning',
			                        showClose: false
		                        });
		                } else {
                                        this.getCurrentPage();
		                }
		        },
		        opHandler(row, column, cell, event) {
//		                console.log(event.target);// 事件冒泡
                                let curDom = event.target;
		                let tag = curDom.tagName;
				if((tag === 'I' && !curDom.classList.contains('pwd-control')) || tag === 'SPAN') {
				        while(curDom.tagName !== 'BUTTON') {
                                                curDom = curDom.parentNode;
				        }
				}
				if(curDom.classList.contains('remove')) {
					this.removeHandler(row);
				} else if(curDom.classList.contains('update')) {
					this.beginUpdateHandler(row);
				} else if(curDom.classList.contains('aboutRole')) {
					this.beginConfigRole(row);
				}
		        },
		        async removeHandler(user) {
		                try {
                                        await this.$confirm(`确定删除用户${user.user_name}吗？`, '提示', { type: 'warning' });
                                        await this.$http({ method: 'post', url: '/user/remove/' + user.user_name });
                                        this.getCurrentPage(false);
                                        this.$notify({
	                                        title: '成功',
                                                message: '删除用户成功',
	                                        type: 'success',
	                                        showClose: false
                                        });
		                } catch(e) {}
		        },
		        beginAddHandler() {
		                this.model.data.user_name = '';
		                this.model.data.user_pwd = '';
		                if(this.$refs.form) { this.$refs.form.clearValidate(); }
		                this.isEdit = true;
		                this.model.optionType = 'add';
		        },
		        beginUpdateHandler(user) {
                                this.model.data.user_name = user.user_name;
                                this.model.data.user_pwd = user.user_pwd;
				if(this.$refs.form) { this.$refs.form.clearValidate(); }
				this.isEdit = true;
				this.model.optionType = 'update';
		        },
		        beginConfigRole(user) {
                                this.model.data.user_name = user.user_name;
                                this.model.data.role_id = -1;
                                if(this.$refs.form) { this.$refs.form.clearValidate(); }
                                this.isEdit = true;
                                this.model.optionType = 'configRole';
		        },
		        async save() {
		                try {
		                        await this.$refs.form.validate();
		                        let message = '';
                                        let data = null;
                                        if(this.model.optionType === 'add') {
                                                data = { user_name: this.model.data.user_name, user_pwd: this.model.data.user_pwd };
                                                await this.$http({ method: 'post', url: '/user/add', data });
                                                message = '用户新增成功';
                                        } else if(this.model.optionType === 'update') {
                                                data = { user_name: this.model.data.user_name, user_pwd: this.model.data.user_pwd };
                                                await this.$http({ method: 'post', url: '/user/change_pwd', data });
                                                message = '用户修改成功';
                                        } else if(this.model.optionType === 'configRole') {
                                                data = { user_name: this.model.data.user_name, role_id: this.model.data.role_id };
                                                await this.$http({ method: 'post', url: '/user/config_role', data });
                                                if(this.list.some(item => item.user_name === data.user_name)) {
                                                        this.list.find(item => item.user_name === data.user_name).role_id = data.role_id;
                                                }
                                                message = '用户角色配置成功';
                                        }
                                        this.getCurrentPage(false);
                                        this.$notify({
                                                type: 'success',
                                                message,
                                                title: '成功',
                                                showClose: false
                                        });
                                        this.isEdit = false;
		                } catch(e) {}
		        }
	        },
	        async created() {
                        this.init();
                        this.getCurrentPage();
	        }
        };
</script>

<style scoped>
	.el-container { min-width: 780px; }
	/* 搜索栏 */
	.el-header { padding: 0; }
	.search-form {
		display: flex;
		flex-wrap: nowrap;
	}
	.search-form .el-form-item {
		display: flex;
		flex-grow: 1;
		flex-basis: 0;
		flex-shrink: 0;
		flex-wrap: nowrap;
		justify-content: space-evenly;
		margin: 0;
	}
	.search-form .el-button { padding: 12px 16px; }
	/* 表格 */
	.el-main { padding: 0; }
	.el-main::-webkit-scrollbar { display: none; }
	i.pwd-control { cursor: pointer; }
	i.pwd-control.isActive { color: rgb(0,167,245); }
	/* 分页 */
	.el-footer { padding-top: 10px; }
	/* 弹窗 */
	.el-dialog .el-form-item { padding: 0 40px; }
	.el-dialog .el-form-item.pwd-control-wrapper { position: relative; }
	.el-dialog i.pwd-control {
		position: absolute;
		top: 50%;
		right: 30px;
		transform: translate(0, -50%);
	}
	.el-dialog .el-select { width: 100%; }
	.el-dialog__footer-content {
		display: flex;
		justify-content: space-evenly;
		align-items: center;
	}
	.el-dialog__footer-content>.el-button { width: 25%; }
</style>