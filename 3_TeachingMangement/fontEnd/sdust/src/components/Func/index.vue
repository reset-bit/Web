<template>
	<div>
		<el-tree :data="treeOfList" class="custom-tree" default-expand-all :expand-on-click-node="false"
		         :render-content="renderContent"></el-tree>
		<el-dialog title="功能编辑" :visible.sync="isEdit" :modal="false">
			<el-form label-width="30%" :model="model.data" :rules="model.rules" status-icon ref="form">
				<el-form-item label="上级功能">
					<el-select v-model="model.data.func_fid" :disabled="model.data.func_id === 0">
						<el-option v-for="item in non_leafNode" :key="item.func_id" :label="item.func_name" :value="item.func_id"></el-option>
					</el-select>
				</el-form-item>
				<el-form-item label="节点类型">
					<el-radio-group v-model="model.isLeaf" :disabled="model.data.func_id !== 0 || model.data.func_fid > 0">
						<el-radio :label="true">叶子节点</el-radio>
						<el-radio :label="false">非叶子节点</el-radio>
					</el-radio-group>
				</el-form-item>
				<el-form-item label="功能名称" prop="func_name">
					<el-input v-model.tirm="model.data.func_name"></el-input>
				</el-form-item>
				<el-form-item label="绑定组件" v-show="model.isLeaf" prop="func_key">
					<el-select v-model="model.data.func_key">
						<el-option v-for="(item, key) in components" :key="key" :label="key" :value="key">
							<el-tooltip placement="right" :content="item.remark">
								<div v-text="key"></div>
							</el-tooltip>
						</el-option>
					</el-select>
				</el-form-item>
			</el-form>
			<div slot="footer" class="el-dialog__footer-content">
				<el-button @click="save" type="primary">确定</el-button>
				<el-button @click="isEdit = false">取消</el-button>
			</div>
		</el-dialog>
	</div>
</template>

<script>
	import { mapState, mapGetters, mapActions } from 'vuex';
	import components from '@/components';

	export default {
	        name: 'Func',
		data() {
	                return {
                                components,
	                        isEdit: false,
	                        model: {
	                                data: {
                                                func_id: 0,
                                                func_name: '',
                                                func_key: '',
                                                func_fid: -1
	                                },
		                        isLeaf: true,
		                        rules: {
                                                func_name: [
                                                        {
                                                                validator: (rule, value, callback) => {
                                                                        if(value.length === 0) {
                                                                                callback(new Error('请输入功能名称'));
                                                                        } else if(value.length < 2 || value.length > 11) {
                                                                                callback(new Error('功能名称长度为2-11个字符'));
                                                                        } else if(this.funcList.some(item => item.func_name === value && item.func_id !== this.model.data.func_id)) {
                                                                                // 如果在已有功能中存在与当前弹窗input重名的组件，且不是与当前组件重名（防止无法改回当前的组件名称），需要报错
                                                                                callback(new Error('功能名称已存在'));
                                                                        } else {
                                                                                callback();
                                                                        }
                                                                },
                                                                trigger: 'blur'
                                                        }
                                                ],
                                                func_key: [
                                                        {
                                                                validator: (rule, value, callback) => {
                                                                        if(this.model.isLeaf && value === '') {
                                                                                callback(new Error('叶节点必须绑定功能组件'));
                                                                        } else {
                                                                                callback();
                                                                        }
                                                                },
                                                                trigger: 'change'
                                                        }
                                                ]
                                        }
	                        }
	                };
		},
		computed: {
			...mapState('func', {'funcList': 'list'}),
			...mapGetters('func', ['treeOfList']),
			non_leafNode() {
				return [
					{ func_id: 0, func_name: 'Root', func_key: '', func_fid: -1 },
					...this.funcList.filter(item => item.func_key === '')
				];
			}
		},
		methods: {
                        ...mapActions('func', ['init', 'remove', 'add', 'update']),
			renderContent(h, { node, data, store }) {
				return h('div', {
				        on: {
				                'mouseenter': () => { data.is_show = true; },
					        'mouseleave': () => { data.is_show = false; }
				        }
				}, [
                                        h('i', {// 非叶子节点缩进
                                                class: 'el-icon-paperclip',
                                                style: {
                                                        display: (data.func_key !== '' || data.children !== undefined) ? 'none' : '',
                                                        visibility: (data.func_key === '' && data.children === undefined) ? 'hidden' : '',
                                                        padding: '6px',
                                                        fontSize: '14px'
                                                }
                                        }),
					h('i', {// 叶子节点图标
					        class: 'el-icon-paperclip',
						style: {
					                display: data.func_key !== '' ? '' : 'none',
							padding: '6px',
							fontSize: '14px'
						}
					}),
					h('span', {
					        class: 'tree-node-text',
						style: { fontSize: '14px' }
					}, data.func_name),
					h('span', {
					        style: { display: data.is_show ? '' : 'none' }
					}, [
                                                h('i', {
                                                        class: 'el-icon-plus',
                                                        style: {
                                                                display: data.func_key === '' ? '' : 'none',
                                                                padding: '0 6px',
	                                                        fontSize: '14px',
	                                                        color: '#409EFF'
				                        },
	                                                on: { click: () => this.beginAddHandler(data) }
						}),
                                                h('i', {
                                                        class: 'el-icon-edit',
                                                        style: {
                                                                display: data.func_id > 2 ? '' : 'none',
	                                                        paddingLeft: data.func_key === '' ? '' : '8px',
                                                                paddingRight: '6px',
                                                                fontSize: '14px',
                                                                color: '#409EFF'
                                                        },
                                                        on: { click: () => this.beginUpdateHandler(data) }
                                                }),
                                                h('i', {
                                                        class: 'el-icon-delete',
                                                        style: {
                                                                display: (data.func_id > 2 && data.children === undefined) ? '' : 'none',
                                                                fontSize: '14px',
                                                                color: '#409EFF'
                                                        },
                                                        on: { click: () => this.removeHandler(data) }
                                                })
					])
				]);
			},
			beginAddHandler(func) {
				this.model.data = {
                                        func_id: 0,
                                        func_name: '',
                                        func_key: '',
                                        func_fid: func.func_id
                                };
                                this.model.isLeaf = true;
                                if(this.$refs.form) { this.$nextTick(() => this.$refs.form.clearValidate()); }
				this.isEdit = true;
			},
			beginUpdateHandler(func) {
                                this.model.isLeaf = func.func_key !== '';
                                this.model.data = { ...func };
                                if(this.$refs.form) { this.$nextTick(() => this.$refs.form.clearValidate()); }
                                this.isEdit = true;
			},
			async removeHandler(func) {
                                try {
                                        await this.$confirm(`确定删除${func.func_name}功能吗？`, '提示', { type: 'warning' });
					await this.remove(func.func_id);
                                        this.$notify({
                                                title: '成功',
                                                message: '功能删除成功',
                                                type: 'success',
                                                showClose: false
                                        });
                                        this.$emit('removeMenu', func.func_id);
                                } catch(e) {}
			},
			async save() {
                                try {
                                        let op = this.model.data.func_id === 0 ? 'add' : 'update';
                                        await this.$refs.form.validate();
                                        await this[op](this.model.data);// add: model.data.func_id将会改变
                                        this.isEdit = false;
                                        if(op=== 'add') {
                                                this.$emit('addMenu', this.model.data);
                                                this.$notify({
                                                        title: '成功',
                                                        message: '功能添加成功',
                                                        type: 'success',
                                                        showClose: false
                                                });
                                        } else {
                                                this.$emit('updateMenu', this.model.data);
                                                this.$notify({
                                                        title: '成功',
                                                        message: '功能修改成功',
                                                        type: 'success',
                                                        showClose: false
                                                });
                                        }
                                } catch(e) {}
			}
		},
		async created() { this.init(); }
	};
</script>

<style scoped>
	.el-dialog .el-radio { padding: 4px 0; }
	.el-dialog .el-input, .el-dialog .el-select { width: 85%; }
	.el-dialog__footer-content {
		display: flex;
		justify-content: space-evenly;
		align-items: center;
	}
	.el-dialog__footer-content>.el-button { width: 25%; }
</style>