<template>
	<el-container>
		<el-header>
			<el-form :model="search" :inline="true" class="form-inline-search">
				<el-form-item label="名称">
					<el-input v-model="search.cls_name" placeholder="请输入"></el-input>
				</el-form-item>
				<el-form-item label="专业">
					<el-select v-model="search.cls_dic_id_major">
						<el-option label="请选择" :value="0"></el-option>
						<el-option v-for="item in dicList.major" :key="item.dic_id"
						           :label="item.dic_name" :value="item.dic_id"></el-option>
					</el-select>
				</el-form-item>
				<el-form-item label="状态">
					<el-select v-model="search.cls_status">
						<el-option v-for="(item, i) in statusList" :key="i" :label="item" :value="i"></el-option>
					</el-select>
				</el-form-item>
				<el-form-item>
					<el-button size="small" icon="el-icon-search" type="primary" @click="getCurrentPage()">搜索</el-button>
					<el-button size="small" icon="el-icon-plus" @click="beginAdd">新增</el-button>
				</el-form-item>
			</el-form>
		</el-header>
		<el-main>
			<!-- 防止第一次渲染时数据未初始化 -->
			<div v-loading="this.dicList.major.length === 0" v-if="this.dicList.major.length === 0" style="height: 100%"></div>
			<el-table :data="list" border :header-cell-style="{backgroundColor: 'rgb(244,247,250)'}" v-else>
				<el-table-column type="index" align="center"></el-table-column>
				<el-table-column label="班级名称"  align="center" width="120">
					<template slot-scope="{ row }">
						<el-tag><span>{{row.cls_name}}</span></el-tag>
					</template>
				</el-table-column>
				<el-table-column label="专业"  align="center">
					<template slot-scope="{ row }">
						<span>{{dicList.major.find(item => item.dic_id === row.cls_dic_id_major).dic_name}}</span>
					</template>
				</el-table-column>
				<el-table-column label="教室" align="center" width="100">
					<template slot-scope="{ row }" v-if="row.cls_clsr_id !== null">
						<i class="el-icon-data-line" style="color: rgb(0,167,245);"></i>
						<span>{{classroomList.find(item => item.clsr_id === row.cls_clsr_id).clsr_name}}</span>
					</template>
				</el-table-column>
				<el-table-column label="状态"  align="center">
					<template slot-scope="{ row }">
						<span v-if="row.cls_begin === null" style="color: skyblue;">未开课</span>
						<span v-else-if="row.cls_end === null" style="color: yellowgreen;">开课中</span>
						<span v-else style="color: red;">已结课</span>
					</template>
				</el-table-column>
				<el-table-column label="教学老师"  align="center">
					<template slot-scope="{ row }">
						<span>{{staffList.teach.find(item => item.stf_id === row.cls_stf_id_teacher).stf_name}}</span>
					</template>
				</el-table-column>
				<el-table-column label="教务老师"  align="center">
					<template slot-scope="{ row }">
						<span>{{staffList.academic.find(item => item.stf_id === row.cls_stf_id_admin).stf_name}}</span>
					</template>
				</el-table-column>
				<el-table-column label="就业老师"  align="center">
					<template slot-scope="{ row }">
						<span>{{staffList.job.find(item => item.stf_id === row.cls_stf_id_job).stf_name}}</span>
					</template>
				</el-table-column>
				<el-table-column label="开课时间"  align="center" width="110">
					<template slot-scope="{ row }" v-if="row.cls_begin !== null">
						<i class="el-icon-time" style="color: rgb(0,167,245); font-size: 12px;"></i>
						<span style="font-size: 12px;">{{row.cls_begin}}</span>
					</template>
				</el-table-column>
				<el-table-column label="结课时间"  align="center" width="110">
					<template slot-scope="{ row }" v-if="row.cls_end !== null">
						<i class="el-icon-time" style="color: red; font-size: 12px;"></i>
						<span style="font-size: 12px;">{{row.cls_end}}</span>
					</template>
				</el-table-column>
				<el-table-column label="备注"  align="center" width="100">
					<template slot-scope="{ row }" v-if="row.cls_remark !== null">
						<el-tooltip placement="top">
							<div slot="content" style="max-width: 150px">{{row.cls_remark}}</div>
							<span class="ellipsis" style="display: inline-block; width: 70px; cursor: pointer;">{{row.cls_remark}}</span>
						</el-tooltip>
					</template>
				</el-table-column>
				<el-table-column label="操作"  align="center" width="180">
					<template slot-scope="{ row }">
						<el-button icon="el-icon-edit" size="small" @click="beginUpdate(row)">修改</el-button>
						<el-button icon="el-icon-unlock" size="small" v-if="row.cls_begin === null" @click="beginStartClass(row)">开课</el-button>
						<el-button icon="el-icon-lock" size="small" v-else-if="row.cls_end === null" @click="EndClass(row)">结课</el-button>
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
		<el-dialog title="班级编辑" :visible.sync="isEdit" :modal="false">
			<el-form :model="model" label-width="70px" class="dialog-form" :rules="rules" status-icon ref="editForm">
				<el-form-item label="班级名称" prop="cls_name">
					<el-input v-model="model.cls_name"></el-input>
				</el-form-item>
				<el-form-item label="班级专业" prop="cls_dic_id_major">
					<el-select v-model="model.cls_dic_id_major">
						<el-option label="请选择" :value="0"></el-option>
						<el-option v-for="item in dicList.major" :key="item.dic_id" :label="item.dic_name" :value="item.dic_id"></el-option>
					</el-select>
				</el-form-item>
				<el-form-item label="教学老师" prop="cls_stf_id_teacher">
					<el-select v-model="model.cls_stf_id_teacher">
						<el-option label="请选择" :value="0"></el-option>
						<el-option v-for="item in staffList.teach" :key="item.stf_id" :label="item.stf_name" :value="item.stf_id"></el-option>
					</el-select>
				</el-form-item>
				<el-form-item label="教务老师" prop="cls_stf_id_admin">
					<el-select v-model="model.cls_stf_id_admin">
						<el-option label="请选择" :value="0"></el-option>
						<el-option v-for="item in staffList.academic" :key="item.stf_id" :label="item.stf_name" :value="item.stf_id"></el-option>
					</el-select>
				</el-form-item>
				<el-form-item label="就业老师" prop="cls_stf_id_job">
					<el-select v-model="model.cls_stf_id_job">
						<el-option label="请选择" :value="0"></el-option>
						<el-option v-for="item in staffList.job" :key="item.stf_id" :label="item.stf_name" :value="item.stf_id"></el-option>
					</el-select>
				</el-form-item>
				<el-form-item label="班级备注">
					<el-input type="textarea" v-model="model.cls_remark"></el-input>
				</el-form-item>
			</el-form>
			<div slot="footer">
				<el-button type="primary" @click="saveEdit">确定</el-button>
				<el-button @click="isEdit = false">取消</el-button>
			</div>
		</el-dialog>
		<el-dialog title="教室选择" :visible.sync="isStart" :modal="false">
			<el-form :model="startModel" label-width="60px" class="dialog-form" :rules="rules" status-icon ref="startForm">
				<el-form-item label="教室名称" prop="cls_clsr_id">
					<el-select v-model="startModel.cls_clsr_id">
						<el-option label="请选择" :value="0"></el-option>
						<el-option v-for="item in classroomList" :key="item.clsr_id"
						           :label="item.clsr_name" :value="item.clsr_id" :disabled="item.clsr_occupy === 1"></el-option>
					</el-select>
				</el-form-item>
			</el-form>
			<div slot="footer">
				<el-button type="primary" @click="saveStart">确定</el-button>
				<el-button @click="isStart = false">取消</el-button>
			</div>
		</el-dialog>
	</el-container>
</template>

<script>
	import { mapState, mapActions } from 'vuex';

        export default {
                name: 'Class',
	        data() {
                        return {
                                search: {
                                        cls_name: '',
	                                cls_dic_id_major: 0,
	                                cls_status: 0
                                },
                                dicList: {
                                        qualification: [],
	                                staff: [],
	                                major: []
                                },
	                        staffList: {
                                        teach: [],
                                        academic: [],
		                        job: []
	                        },
	                        statusList: ['所有', '开课中', '未开课', '结课'],
	                        list: [],
	                        pagination: {
                                        currentPage: 1,
		                        total: 0,
		                        pageSize: 6
	                        },
                                isEdit: false,
                                model: {
                                        cls_id: 0,
                                        cls_name: '',
                                        cls_dic_id_major: 0,
                                        cls_clsr_id: null,
                                        cls_stf_id_teacher: 0,
                                        cls_stf_id_admin: 0,
                                        cls_stf_id_job: 0,
                                        cls_begin: null,
                                        cls_end: null,
                                        cls_remark: null
                                },
	                        isStart: false,
                                startModel: {
                                        cls_id: 0,
		                        cls_clsr_id: 0
	                        },
	                        rules: {
                                        cls_name: [
	                                        {
	                                                validator: async (rule, value, callback) => {
                                                                let isLegal = await this.$http({ method: 'post', url: '/class/valid_name',
                                                                        data: { cls_name: this.model.cls_name } });
                                                                if(value.length === 0) {
                                                                        callback(new Error('请输入班级名称'));
                                                                } else if(value.length < 2 || value.length > 10) {
                                                                        callback(new Error('班级名称长度在2-10个字符之间'));
                                                                } else if (this.model.cls_id === 0 && isLegal) {
                                                                        callback(new Error('班级名称已存在'));
                                                                } else {
                                                                        callback();
                                                                }
                                                        },
                                                        trigger: 'blur'
	                                        }
                                        ],
                                        cls_dic_id_major: [
                                                {
                                                        validator: (rule, value, callback) => {
                                                                if(value === 0) {
                                                                        callback(new Error('请选择班级专业'));
                                                                } else { callback(); }
                                                        },
                                                        trigger: 'change'
                                                }
                                        ],
                                        cls_stf_id_teacher: [
                                                {
                                                        validator: (rule, value, callback) => {
                                                                if(value === 0) {
                                                                        callback(new Error('请选择教学老师'));
                                                                } else { callback(); }
                                                        },
                                                        trigger: 'change'
                                                }
                                        ],
                                        cls_stf_id_admin: [
                                                {
                                                        validator: (rule, value, callback) => {
                                                                if(value === 0) {
                                                                        callback(new Error('请选择教务老师'));
                                                                } else { callback(); }
                                                        },
                                                        trigger: 'change'
                                                }
                                        ],
                                        cls_stf_id_job: [
                                                {
                                                        validator: (rule, value, callback) => {
                                                                if(value === 0) {
                                                                        callback(new Error('请选择就业老师'));
                                                                } else { callback(); }
                                                        },
                                                        trigger: 'change'
                                                }
                                        ],
                                        cls_clsr_id: [
                                                {
                                                        validator: (rule, value, callback) => {
                                                                if(value === 0) {
                                                                        callback(new Error('请选择教室'));
                                                                } else { callback(); }
                                                        },
                                                        trigger: 'change'
                                                }
                                        ]
	                        }
                        };
	        },
	        computed: {
		        ...mapState('cls', {'classList': 'list'}),
		        ...mapState('classroom', {'classroomList': 'list'})
	        },
	        methods: {
		        ...mapActions('cls', {'classInit': 'init', 'add': 'add', 'update': 'update'}),
		        ...mapActions('classroom', {'classroomInit': 'init', 'classroomReInit': 'reInit'}),
		        async getCurrentPage(isResetPage = true) {
				isResetPage && (this.pagination.currenPage = 1);
				try {
					let res = await this.$http({ method: 'post', url: '/class/list', data: {
                                                ...this.search,
                                                begin: (this.pagination.currentPage - 1) * this.pagination.pageSize,
                                                pageSize: this.pagination.pageSize
					}});
					this.list = res.list;
					this.pagination.total = res.total;
				} catch(e) {}
		        },
		        beginAdd() {
		                this.model = {
                                        cls_id: 0,
                                        cls_name: '',
                                        cls_dic_id_major: 0,
                                        cls_clsr_id: null,
                                        cls_stf_id_teacher: 0,
                                        cls_stf_id_admin: 0,
                                        cls_stf_id_job: 0,
                                        cls_begin: null,
                                        cls_end: null,
                                        cls_remark: null
                                };
                                if(this.$refs.editForm) { this.$refs.editForm.clearValidate(); }
		                this.isEdit = true;
		        },
		        beginUpdate(cls) {
		                this.model = cls;
                                if(this.$refs.editForm) { this.$refs.editForm.clearValidate(); }
		                this.isEdit = true;
		        },
		        async saveEdit() {
		                try {
                                        await this.$refs.editForm.validate();
                                        let message = this.model.cls_id === 0 ? '新增班级成功' : '编辑班级成功';
                                        await this[this.model.cls_id === 0 ? 'add' : 'update'](this.model);
                                        this.$notify({
                                                type: 'success',
                                                message,
                                                title: '成功',
                                                showClose: false
                                        });
                                        this.isEdit = false;
                                        this.getCurrentPage(false);
		                } catch(e) {}
		        },
		        async beginStartClass(cls) {
		                await this.$confirm('确定开始此班级课程吗？', '提示', { type: 'warning' });
                                if(this.$refs.startForm) { this.$refs.startForm.clearValidate(); }
                                this.startModel = {
                                        cls_id: cls.cls_id,
	                                cls_clsr_id: cls.cls_clsr_id
                                };
		                this.isStart = true;
		        },
                        async saveStart() {
				try {
				        await this.$http({ method: 'post', url: '/class/begin', data: this.startModel });
				        this.$notify({
					        type: 'success',
					        message: '班级开课成功',
					        title: '成功',
					        showClose: false
				        });
                                        this.isStart = false;
                                        this.classroomReInit();
                                        this.getCurrentPage(false);
				} catch(e) {}
                        },
		        async EndClass(cls) {
		                try {
                                        await this.$confirm('确定结束此班级课程吗？', '提示', { type: 'warning' });
                                        await this.$http({ method: 'post', url: '/class/end', data: { cls_id: cls.cls_id } });
                                        this.$notify({
                                                type: 'success',
                                                message: '班级结课成功',
                                                title: '成功',
                                                showClose: false
                                        });
                                        this.classroomReInit();
                                        this.getCurrentPage(false);
		                } catch(e) {}
		        }
	        },
	        async created() {
//                        await this.classInit();
                        this.getCurrentPage(true);
                        await this.classroomInit();
                        let dicRes = await this.$http({ url: '/dictionary/all' });
			for(let i = 0; i < dicRes.length; ++i) {
			        switch(dicRes[i].dic_group_key) {
				        case 'qualification':
				                this.dicList.qualification.push(dicRes[i]);
				                break;
				        case 'staff_category':
                                                this.dicList.staff.push(dicRes[i]);
                                                switch(dicRes[i].dic_name) {
                                                        case '教学老师':
                                                                this.staffList.teach = await this.$http({url: '/staff/listbycategory/' + dicRes[i].dic_id });
                                                                break;
                                                        case '教务老师':
                                                                this.staffList.academic = await this.$http({url: '/staff/listbycategory/' + dicRes[i].dic_id });
                                                                break;
                                                        case '就业老师':
                                                                this.staffList.job = await this.$http({url: '/staff/listbycategory/' + dicRes[i].dic_id });
                                                                break;
                                                }
                                                break;
				        case 'class_major':
                                                this.dicList.major.push(dicRes[i]);
                                                break;
			        }
			}
                }
        };
</script>

<style scoped>
	.el-table .el-button { margin: 0; }
	.el-footer { padding-top: 10px; }
	.el-dialog__wrapper::-webkit-scrollbar { display: none; }
</style>