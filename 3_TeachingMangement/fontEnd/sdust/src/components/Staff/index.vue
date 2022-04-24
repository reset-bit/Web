<template>
	<el-container>
		<el-header>
			<el-form :inline="true" :data="search" class="form-inline-search">
				<el-form-item label="员工姓名">
					<el-input v-model.tirm="search.stf_name"></el-input>
				</el-form-item>
				<el-form-item label="员工类型">
					<el-select v-model="search.stf_category">
						<el-option label="请选择" :value="0"></el-option>
						<el-option v-for="item in dicList" :key="item.dic_id" :label="item.dic_name" :value="item.dic_id"></el-option>
					</el-select>
				</el-form-item>
				<el-form-item>
					<el-button type="primary" icon="el-icon-search" @click="getCurrentPage()">搜索</el-button>
					<el-button icon="el-icon-plus" @click="beginAdd">新增</el-button>
				</el-form-item>
			</el-form>
		</el-header>
		<el-main>
			<el-table :data="list" border :header-cell-style="{backgroundColor: 'rgb(244,247,250)'}">
				<el-table-column type="index" align="center"></el-table-column>
				<el-table-column label="姓名" prop="stf_name" align="center"></el-table-column>
				<el-table-column label="职务类型" align="center">
					<template slot-scope="{ row }">
						<span>{{dicList.find(item => item.dic_id === row.stf_category).dic_name}}</span>
					</template>
				</el-table-column>
				<el-table-column label="备注" prop="stf_remark" align="center"></el-table-column>
				<el-table-column label="状态" align="center">
					<template slot-scope="{ row }">
						<span v-if="row.stf_invalid === 1">在职</span>
						<span v-else style="color: #aaa;">离职</span>
					</template>
				</el-table-column>
				<el-table-column label="操作" width="200" align="center">
					<template slot-scope="{ row }">
						<el-button size="small" icon="el-icon-edit" @click="beginUpdate(row)">编辑</el-button>
						<el-button size="small" icon="el-icon-user" type="info" v-if="row.stf_invalid === 1" @click="dimission(row)">离职</el-button>
						<el-button size="small" icon="el-icon-user" type="success" v-else @click="reinstate(row)">入职</el-button>
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
		<el-dialog :visible.sync="isEdit" :modal="false" title="员工编辑">
			<el-form label-width="70px" :rules="rules" :model="model" ref="form" class="dialog-form" >
				<el-form-item label="员工姓名" prop="stf_name">
					<el-input v-model="model.stf_name"></el-input>
				</el-form-item>
				<el-form-item label="员工类型" prop="stf_category">
					<el-select v-model="model.stf_category">
						<el-option label="请选择" :value="0"></el-option>
						<el-option v-for="item in dicList" :key="item.dic_id" :label="item.dic_name" :value="item.dic_id"></el-option>
					</el-select>
				</el-form-item>
				<el-form-item label="备注">
					<el-input type="textarea" v-model="model.stf_remark"></el-input>
				</el-form-item>
			</el-form>
			<div slot="footer">
				<el-button type="primary" @click="save">确定</el-button>
				<el-button @click="isEdit = false">取消</el-button>
			</div>
		</el-dialog>
	</el-container>
</template>

<script>
        export default {
                name: 'Staff',
	        data() {
                        return {
                                search: {
                                        stf_name: '',
	                                stf_category: 0
                                },
	                        dicList: [],
	                        list: [],
                                pagination: {
                                        currentPage: 1,
	                                total: 0,
	                                pageSize: 6
                                },
	                        isEdit: false,
	                        model: {
                                        stf_id: 0,
                                        stf_name: '',
                                        stf_category: 0,
		                        stf_remark: null,
		                        stf_invalid: 0
	                        },
	                        rules: {
                                        stf_name: [
	                                        {
	                                                validator: (rule, value, callback) => {
                                                                if(value.length === 0) {
                                                                        callback(new Error('请输入员工名称'));
                                                                } else if(value.length < 2 || value.length > 10) {
                                                                        callback(new Error('员工名称长度在2-10个字符之间'));
                                                                }else {
                                                                        callback();
                                                                }
                                                        },
                                                        trigger: 'blur'
	                                        }
                                        ],
		                        stf_category: [
			                        {
                                                        validator: (rule, value, callback) => {
                                                                if(value === 0) {
                                                                        callback(new Error('请选择员工分类'));
                                                                } else { callback(); }
                                                        },
                                                        trigger: 'change'
			                        }
		                        ]
	                        }
                        };
	        },
	        methods: {
                        async getCurrentPage(isResetPage = true) {
				try {
				        isResetPage && (this.pagination.currentPage = 1);
				        let res = await this.$http({ method: 'post', url: '/staff/list', data: {
					        ...this.search,
					        begin: (this.pagination.currentPage - 1) * this.pagination.pageSize,
					        pageSize: this.pagination.pageSize
				        } });
				        this.list = res.list;
				        this.pagination.total = res.total;
				} catch(e) {}
                        },
		        beginAdd() {
                                this.model = {
                                        stf_id: 0,
                                                stf_name: '',
                                                stf_category: 0,
                                                stf_remark: null,
                                                stf_invalid: 0
                                };
				if(this.$refs.form) { this.$refs.form.clearValidate(); }
				this.isEdit = true;
		        },
		        beginUpdate(staff) {
                                this.model = staff;
                                if(this.$refs.form) { this.$refs.form.clearValidate(); }
                                this.isEdit = true;
		        },
		        async save() {
                                try {
                                        await this.$refs.form.validate();
                                        let message = this.model.stf_id === 0 ? '新增员工成功' : '修改员工成功';
                                        if(this.model.stf_id === 0) {// add
                                                await this.$http({ method: 'post', url: '/staff/add', data: this.model });
                                        } else {// update
                                                await this.$http({ method: 'post', url: '/staff/update', data: this.model });
                                        }
                                        this.$notify({
	                                        type: 'success',
	                                        message,
	                                        title: '成功',
	                                        showClose: false
                                        });
                                        this.isEdit = false;
                                } catch(e) {}
		        },
		        async dimission(staff) {
                                await this.$confirm('确定离职吗？', '提示', { type: 'warning' });
                                await this.$http({ url: '/staff/dimission/' + staff.stf_id });
                                this.$notify({
                                        type: 'success',
                                        message: '离职成功',
                                        title: '成功',
                                        showClose: false
                                });
                                this.getCurrentPage(false);
		        },
		        async reinstate(staff) {
                                await this.$confirm('确定入职吗？', '提示', { type: 'warning' });
                                await this.$http({ url: '/staff/reinstate/' + staff.stf_id });
                                this.$notify({
                                        type: 'success',
                                        message: '入职成功',
                                        title: '成功',
                                        showClose: false
                                });
                                this.getCurrentPage(false);
                        }
	        },
	        async created() {
                        let dicRes = await this.$http({ url: '/dictionary/all' });
                        dicRes.forEach(item => item.dic_group_key === 'staff_category' && this.dicList.push(item));
			this.getCurrentPage();
	        }
        };
</script>

<style scoped></style>