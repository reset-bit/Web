<template>
	<div class="container">
		<el-row :gutter="20">
			<el-col :span="6"  v-for="item in roleList" :key="item.role_id">
				<el-card shadow="hover" :body-style="cardStyle">
					<i class="el-icon-user"></i>
					<span v-text="item.role_name" class="role-name"></span>
					<div class="options">
						<el-button type="text" icon="el-icon-edit" @click="beginUpdateHandler(item)">编辑</el-button>
						<el-button type="text" icon="el-icon-delete" @click="removeHandler(item)">删除</el-button>
						<el-button type="text" icon="el-icon-setting" @click="beginConfigHandler(item)">功能分配</el-button>
					</div>
				</el-card>
			</el-col>
			<el-col :span="6">
				<el-card shadow="hover" :body-style="cardStyle">
					<el-button type="text" icon="el-icon-plus" @click="beginAddHandler" class="add-btn"></el-button>
				</el-card>
			</el-col>
		</el-row>
		<el-dialog title="角色编辑" :visible.sync="isEdit" :modal="false">
			<el-form :model='model.data' :rules="model.rules" status-icon lable-width="30%" ref="form" :inline="true">
				<el-form-item label="角色名称" prop="role_name">
					<el-input v-model="model.data.role_name"></el-input>
				</el-form-item>
			</el-form>
			<div slot="footer">
				<el-button type="primary" @click="save">确定</el-button>
				<el-button @click="isEdit = false">取消</el-button>
			</div>
		</el-dialog>
		<el-drawer class="custom-drawer" :visible.sync="isConfig" :modal="false" size="30%" title="角色功能分配" direction="ltr">
			<el-tree class="custom-tree" :data="treeOfList" default-expand-all :expand-on-click-node="false">
				<div class="custom-tree-node" slot-scope="{node, data}">
					<i class="el-icon-paperclip" v-if="data.func_key !== ''"></i>
					<span v-text="data.func_name"></span>
					<el-switch v-if="data.func_name !== 'Root'" :value="userFuncs.func_ids.indexOf(data.func_id) !== -1"
						@change="isOpen => changeSwitch(data, isOpen)"></el-switch>
				</div>
			</el-tree>
			<div class="drawer-footer">
				<el-button type="primary" @click="saveConfig">确定</el-button>
				<el-button @click="isConfig = false">取消</el-button>
			</div>
		</el-drawer>
	</div>
</template>

<script>
	import { mapGetters, mapState, mapActions } from 'vuex';

        export default {
                name: 'RoleFunc',
	        data() {
                        return {
                                cardStyle: {
                                        height: '40px',
	                                display: 'flex',
	                                justifyContent: 'center',
	                                alignItems: 'center'
                                },
	                        isEdit: false,
	                        model: {
                                        data: {
                                                role_id: 0,
                                                role_name: ''
                                        },
                                        rules: {
                                                role_name: [
                                                        {
                                                                validator: (rule, value, callback) => {
                                                                        if(value.length === 0) {
                                                                                callback(new Error('请输入角色名称'));
                                                                        } else if(value.length < 2 || value.length > 10) {
                                                                                callback(new Error('角色名称长度为2-10个字符'));
                                                                        } else {
                                                                                callback();
                                                                        }
                                                                },
                                                                trigger: 'blur'
                                                        }
                                                ]
                                        }
	                        },
	                        isConfig: false,
	                        userFuncs: {
                                        role_id: 0,
		                        func_ids: []
	                        }
                        }
	        },
	        computed: {
		        ...mapState('role', {'roleList': 'list'}),
                        ...mapGetters('func', ['treeOfList'])
	        },
	        methods: {
		        ...mapActions('role', ['init', 'remove', 'add', 'update']),
		        ...mapActions('func', {'funcInit': 'init'}),
		        async removeHandler(role) {
				try {
				        await this.$confirm(`确定删除${role.role_name}角色吗？`, '提示', { type: 'warning' });
				        await this.remove(role.role_id);
                                        this.$notify({
                                                title: '成功',
                                                message: '角色删除成功',
                                                type: 'success',
                                                showClose: false
                                        });
				} catch(e) {}
		        },
 		        beginAddHandler() {
		                this.model.data = { role_id: 0, role_name: '' };
		                if(this.$refs.form) { this.$nextTick(() => this.$refs.form.clearValidate()); }
		                this.isEdit = true;
		        },
		        beginUpdateHandler(role) {
		                this.model.data = {...role};
		                if(this.$refs.form) { this.$nextTick(() => this.$refs.form.clearValidate()); }
		                this.isEdit = true;
		        },
		        async save() {
                                try {
                                        await this.$refs.form.validate();
                                        await this[this.model.data.role_id === 0 ? 'add' : 'update'](this.model.data);
                                        if(this.model.data.role_id === 0) {// add
                                                this.$notify({
                                                        title: '成功',
                                                        message: '角色新增成功',
                                                        type: 'success',
                                                        showClose: false
                                                });
                                        } else {// update
                                                this.$notify({
                                                        title: '成功',
                                                        message: '角色修改成功',
                                                        type: 'success',
                                                        showClose: false
                                                });
                                        }
                                        this.isEdit = false;
                                } catch(e) {}
		        },
		        async beginConfigHandler(role) {
                                this.userFuncs.role_id = role.role_id;
                                this.userFuncs.func_ids = [];
                                let list = await this.$http({ url: '/role_function/list/' + this.userFuncs.role_id });
                                list.forEach(item => this.userFuncs.func_ids.push(item.func_id));
                                this.isConfig = true;
		        },
		        changeSwitch(func, isOpen) {
		                let { children, ...tmp } = func;
		                let func_ids = this.userFuncs.func_ids;
				if(isOpen) {
				        // 自身
                                        func_ids.push(func.func_id);
                                        // 后代
					children !== undefined && children.forEach(item => func_ids.push(item.func_id));
					// 父辈
					if(func.func_fid !== 0 && func_ids.indexOf(func.func_fid) === -1) {
						func_ids.push(func.func_fid);
					}
				} else {
				        // 自身
				        func_ids.splice(this.userFuncs.func_ids.indexOf(func.func_id), 1);
				        // 后代
				        children !== undefined && children.forEach(item => {
				                let pos = func_ids.indexOf(item.func_id);
				                if(pos !== -1) {
				                        func_ids.splice(pos, 1);
				                }
				        });
				        // 父辈
					if(func.func_fid !== 0) {
					        let siblings = this.treeOfList[0].children.find(item => item.func_id === func.func_fid).children;
					        let isClose = !siblings.some(item => {
					                return item.func_id !== func.func_id && func_ids.indexOf(item.func_id) !== -1;
					        });
					        isClose && func_ids.splice(func_ids.findIndex(item => item.func_id === func.func_fid), 1);
					}
				}
				this.userFuncs.func_ids = func_ids;
		        },
		        async saveConfig() {
				try {
				        await this.$http({ method: 'post', url: '/role_function/config', data: {
				                role_id: this.userFuncs.role_id,
						role_func_ids: this.userFuncs.func_ids.join(',')
				        } });
                                        this.$notify({
                                                title: '成功',
                                                message: '角色功能配置成功',
                                                type: 'success',
                                                showClose: false
                                        });
                                        this.isConfig = false;
				} catch(e) {}
		        }
	        },
	        async created() { this.init(); this.funcInit(); }
        };
</script>

<style scoped>
	.container { background-color: rgb(250,251,252); height: 100%; }
	.el-col { margin-bottom: 20px; }
	/* card */
	.el-card { background-color: rgb(237,243,246); position: relative; }
	.el-card:hover { cursor: pointer; }
	span.role-name { padding-left: 10px; }
	.options {
		position: absolute;
		top: 0;
		left: 0;
		height: 100%;
		width: 100%;
		display: flex;
		justify-content: center;
		align-items: center;
		flex-wrap: wrap;
		opacity: 0;
		transition: all .3s;
		background-color: rgb(237,243,246);
	}
	.el-card__body:hover .options { opacity: 1; }
	.options .el-button { color: #333; }
	.options .el-button:hover { color: rgb(0,167,245); }
	.el-button.add-btn {
		height: 100%;
		width: 100%;
		color: #333;
	}
	.el-form { display: flex; justify-content: center; }
	/* drawer */
	.drawer-footer {
		padding-top: 40px;
		display: flex;
		justify-content: center;
		align-items: center;
	}
	.drawer-footer>.el-button { width: 150px; margin: 0 40px; }
	.el-switch { transform: scale(.6); }
</style>