<template>
	<el-container>
		<el-header>
			<el-form :model="search" :inline="true" class="form-inline-search">
				<el-form-item label="姓名">
					<el-input v-model="search.stu_name" placeholder="请输入"></el-input>
				</el-form-item>
				<el-form-item label="班级">
					<el-select v-model="search.stu_cls_id">
						<el-option label="请选择" :value="0"></el-option>
						<el-option v-for="item in classList" :key="item.cls_id"
						           :label="item.cls_name" :value="item.cls_id"></el-option>
					</el-select>
				</el-form-item>
				<el-form-item label="学历">
					<el-select v-model="search.stu_qualification">
						<el-option label="请选择" :value="0"></el-option>
						<el-option v-for="item in qualificationList" :key="item.dic_id" :label="item.dic_name" :value="item.dic_id"></el-option>
					</el-select>
				</el-form-item>
				<el-form-item>
					<el-button size="small" icon="el-icon-search" type="primary" @click="getCurrentPage()">搜索</el-button>
					<el-button size="small" icon="el-icon-plus" @click="beginAdd">新增</el-button>
					<el-button size="small" icon="el-icon-notebook-2" @click="beginAssignClass">批量分班</el-button>
				</el-form-item>
			</el-form>
		</el-header>
		<el-main>
			<el-table :data="list" border :header-cell-style="{backgroundColor: 'rgb(244,247,250)'}" @selection-change="selectionChange">
				<el-table-column type="selection" align="center" fixed="left"></el-table-column>
				<el-table-column label="姓名"  align="center" width="120" fixed="left">
					<template slot-scope="{ row }">
						<el-tag><span>{{row.stu_name}}</span></el-tag>
					</template>
				</el-table-column>
				<el-table-column label="性别"  align="center">
					<template slot-scope="{ row }">
						<span>{{row.stu_sex === 1 ? '男' : '女'}}</span>
					</template>
				</el-table-column>
				<el-table-column label="出生日期"  align="center" prop="stu_born" width="100"></el-table-column>
				<el-table-column label="班级"  align="center">
					<template slot-scope="{ row }">
						<span v-if="row.stu_cls_id !== null">{{classList.find(item => item.cls_id === row.stu_cls_id).cls_name}}</span>
						<span v-else style="color: #aaa;">暂无班级</span>
					</template>
				</el-table-column>
				<el-table-column label="照片" align="center">
					<template slot-scope="{ row }">
						<el-popover placement="right" trigger="click">
							<span slot="reference" style="color: skyblue; cursor: pointer;">预览</span>
							<el-image :src="row.stu_avatar" style='height: 240px; width: 100%;'>
								<div slot="error" class="image-slot" style="height: 100%; width: 100%; display: flex; align-items: center; justify-content: center;">
									<i class="el-icon-picture-outline"></i>
									<span>暂无照片</span>
								</div>
							</el-image>
						</el-popover>
					</template>
				</el-table-column>
				<el-table-column label="联系电话"  align="center" prop="stu_phone" width="120"></el-table-column>
				<el-table-column label="备用电话"  align="center" prop="stu_phone2" width="120"></el-table-column>
				<el-table-column label="院校"  align="center" prop="stu_school" width="150"></el-table-column>
				<el-table-column label="专业"  align="center" prop="stu_major" width="150"></el-table-column>
				<el-table-column label="家庭住址"  align="center" prop="stu_address" width="150"></el-table-column>
				<el-table-column label="备注"  align="center" width="100">
					<template slot-scope="{ row }" v-if="row.stu_remark !== null">
						<el-tooltip placement="top">
							<div slot="content" style="max-width: 150px">{{row.stu_remark}}</div>
							<span class="ellipsis" style="display: inline-block; width: 70px; cursor: pointer;">{{row.stu_remark}}</span>
						</el-tooltip>
					</template>
				</el-table-column>
				<el-table-column label="操作"  align="center" width="300">
					<template slot-scope="{ row }">
						<el-button icon="el-icon-picture-outline" size="small" @click="beginAvatarConfig(row)">照片存档</el-button>
						<el-button icon="el-icon-notebook-2" size="small" @click="beginAssignClass(row)">分班</el-button>
						<el-button icon="el-icon-edit" size="small" @click="beginUpdate(row)">修改</el-button>
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
		<el-dialog title="学生编辑" :visible.sync="isEdit" :modal="false">
			<el-form :model="model" label-width="70px" class="dialog-form" :rules="rules" status-icon ref="form">
				<el-form-item label="姓名" prop="stu_name">
					<el-input v-model="model.stu_name"></el-input>
				</el-form-item>
				<el-form-item label="性别" prop="stu_sex">
					<el-radio-group v-model="model.stu_sex">
						<el-radio :label="1">男</el-radio>
						<el-radio :label="0">女</el-radio>
					</el-radio-group>
				</el-form-item>
				<el-form-item label="出生日期" prop="stu_born">
					<el-date-picker v-model="model.stu_born" placeholder="请选择" style="width: 100%;" value-format="yyyy-MM-dd"></el-date-picker>
				</el-form-item>
				<el-form-item label="联系电话" prop="stu_phone">
					<el-input v-model.number="model.stu_phone"></el-input>
				</el-form-item>
				<el-form-item label="备用电话" prop="stu_phone2">
					<el-input v-model.number="model.stu_phone2"></el-input>
				</el-form-item>
				<el-form-item label="住址" prop="stu_address">
					<el-input v-model="model.stu_address"></el-input>
				</el-form-item>
				<el-form-item label="专业" prop="stu_qualification">
					<el-select v-model="model.stu_qualification" placeholder="请选择">
						<el-option v-for="item in qualificationList" :key="item.dic_id" :label="item.dic_name" :value="item.dic_id"></el-option>
					</el-select>
				</el-form-item>
				<el-form-item label="院校" prop="stu_school">
					<el-input v-model="model.stu_school"></el-input>
				</el-form-item>
				<el-form-item label="专业" prop="stu_major">
					<el-input v-model="model.stu_major"></el-input>
				</el-form-item>
				<el-form-item label="备注">
					<el-input type="textarea" v-model="model.stu_remark"></el-input>
				</el-form-item>
			</el-form>
			<div slot="footer">
				<el-button type="primary" @click="saveEdit">确定</el-button>
				<el-button @click="isEdit = false">取消</el-button>
			</div>
		</el-dialog>
		<el-dialog title="上传照片" :visible.sync="isUpload" :modal="false" class="imageUpload">
			<el-upload action="/student/avatarupload" name="avatar"
				:headers="{ Authorization: token }" accept=".jpg,.png" list-type="picture-card" :fileList="fileList"
			           :before-upload="beforeUploadHandler" :on-success="uploadSuccessHandler">
				<i class="el-icon-plus"></i>
				<div slot="tip" style="font-size: 12px;">只能上传jpg/png文件，且不超过500kb</div>
			</el-upload>
			<div slot="footer">
				<el-button type="primary" @click="avatarConfig">保存</el-button>
				<el-button @click="isUpload = false">取消</el-button>
			</div>
		</el-dialog>
		<el-dialog title="班级选择" :visible.sync="isAssignClass" :modal="false">
			<el-form :model="assignClass" label-width="70px" class="dialog-form" :rules="rules" status-icon>
				<el-form-item label="教室名称" prop="stu_cls_id">
					<el-select v-model="assignClass.stu_cls_id">
						<el-option v-for="item in classList" :key="item.cls_id"
						           :label="item.cls_name" :value="item.cls_id" :disabled="item.cls_end !== null"></el-option>
					</el-select>
				</el-form-item>
			</el-form>
			<div slot="footer">
				<el-button type="primary" @click="saveAssignClass">确定</el-button>
				<el-button @click="isAssignClass = false">取消</el-button>
			</div>
		</el-dialog>
	</el-container>
</template>

<script>
        import { mapState, mapActions } from 'vuex';

        export default {
                name: 'Student',
                data() {
                        return {
                                search: {
                                        stu_name: '',
                                        stu_cls_id: 0,
                                        stu_qualification: 0,
                                },
                                qualificationList: [],
                                list: [],
                                pagination: {
                                        currentPage: 1,
                                        total: 0,
                                        pageSize: 6
                                },
                                isEdit: false,
                                model: {
                                        stu_id: 0,
                                        stu_name: '',
	                                stu_avatar: null,
	                                stu_cls_id: null,
	                                stu_sex: null,
	                                stu_phone: '',
	                                stu_phone2: '',
	                                stu_born: null,
	                                stu_qualification: null,
	                                stu_school: null,
	                                stu_major: null,
	                                stu_address: null,
	                                stu_remark: null
                                },
                                rules: {
                                        stu_name: [
                                                { required: true, message: '请输入姓名', trigger: 'blur' }
                                        ],
                                        stu_sex: [
                                                { required: true, message: '请选择性别', trigger: 'change' }
                                        ],
                                        stu_phone: [
                                                { required: true, message: '请输入手机号码', trigger: 'blur' },
	                                        {
                                                        validator: async (rule, value, callback) => {
                                                                let res = await this.$http({ method: 'post', url: '/student/valid_phone',
                                                                        data: { stu_phone: this.model.stu_phone } });
                                                                if ((this.model.stu_id === 0 && res) || !/1[3-9]\d{9}/.test(value)) {
                                                                        callback(new Error('手机号码不合法'));
                                                                } else {
                                                                        callback();
                                                                }
                                                        },
		                                        trigger: 'blur'
	                                        }
                                        ],
                                        stu_phone2: [
                                                { required: true, message: '请输入手机号码', trigger: 'blur' },
                                                {
                                                        validator: async (rule, value, callback) => {
                                                                let res = await this.$http({ method: 'post', url: '/student/valid_phone',
                                                                        data: { stu_phone: this.model.stu_phone } });
                                                                if ((this.model.stu_id === 0 && res) || !/1[3-9]\d{9}/.test(value)) {
                                                                        callback(new Error('手机号码不合法'));
                                                                } else {
                                                                        callback();
                                                                }
                                                        },
                                                        trigger: 'blur'
                                                }
                                        ],
                                        stu_born: [
                                                { required: true, message: '请选择出生日期', trigger: 'blur' }
                                        ],
                                        stu_qualification: [
                                                { required: true, message: '请选择学历', trigger: 'blur' }
                                        ],
                                        stu_address: [
                                                { required: true, message: '请输入住址', trigger: 'blur' }
                                        ],
                                        stu_cls_id: [
                                                { required: true, message: '请选择班级', trigger: 'blur' }
                                        ]
                                },
	                        isUpload: false,
                                token: sessionStorage.getItem('token'),
	                        avatar: {
                                        stu_id: 0,
		                        stu_avatar_old: null,
		                        stu_avatar_new: null
	                        },
                                isAssignClass: false,
	                        assignClass: {
                                        stu_id: null,
		                        stu_ids: null,
		                        stu_cls_id: null
	                        }
                        };
                },
                computed: {
                        ...mapState('cls', {'classList': 'list'}),
                        ...mapState('classroom', {'classroomList': 'list'}),
	                fileList() {
                                let avatarPath = this.avatar.stu_avatar_old;
                                if(avatarPath === null) { return []; }
                                return [{
                                        name: avatarPath.slice(avatarPath.lastIndexOf('/'), 1),
	                                url: avatarPath
                                }];
	                }
                },
                methods: {
                        ...mapActions('cls', {'classInit': 'init'}),
                        ...mapActions('classroom', {'classroomInit': 'init'}),
                        async getCurrentPage(isResetPage = true) {
                                isResetPage && (this.pagination.currenPage = 1);
                                try {
                                        let res = await this.$http({ method: 'post', url: '/student/list', data: {
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
                                        stu_id: 0,
                                                stu_name: '',
                                                stu_avatar: null,
                                                stu_cls_id: null,
                                                stu_sex: null,
                                                stu_phone: '',
                                                stu_phone2: '',
                                                stu_born: null,
                                                stu_qualification: null,
                                                stu_school: null,
                                                stu_major: null,
                                                stu_address: null,
                                                stu_remark: null
                                };
                                if(this.$refs.form) { this.$refs.form.clearValidate(); }
                                this.isEdit = true;
                        },
                        beginUpdate(student) {
                                this.model = student;
                                if(this.$refs.form) { this.$refs.form.clearValidate(); }
                                this.isEdit = true;
                        },
                        async saveEdit() {
                                try {
                                        await this.$refs.form.validate();
                                        let message = this.model.stu_id === 0 ? '新增学生成功' : '编辑学生成功';
                                        if(this.model.stu_id === 0) {
                                                await this.$http({ method: 'post', url: '/student/add', data: this.model });
                                        } else {
                                                await this.$http({ method: 'post', url: '/student/update', data: this.model });
                                        }
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
	                beginAvatarConfig(student) {
                                this.avatar.stu_id = student.stu_id;
                                this.avatar.stu_avatar_old = student.stu_avatar;
                                this.isUpload = true;
	                },
	                beforeUploadHandler(file) {
                                const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png';
                                const isLt500kb = file.size / 1024 < 500;
                                if(!isJpgOrPng) {
                                        this.$message.error('上传头像图片只能是JPG/PNG格式');
                                }
                                if(!isLt500kb) {
                                        this.$message.error('上传头像图片大小不能超过500KB');
                                }
                                return isJpgOrPng && isLt500kb;
	                },
	                uploadSuccessHandler(response, file, fileList) {
                                response.status === 200 && (this.avatar.stu_avatar_new = response.data);
                                if(this.avatar.stu_avatar_old !== null && fileList.length > 2) {
                                        fileList.splice(1, 1);
                                } else if(this.avatar.stu_avatar_old === null && fileList.length > 1) {
                                        fileList.shift();
                                }
	                },
	                async avatarConfig() {
                                try {
                                        await this.$http({ method: 'post', url: '/student/avatarUpdate', data: this.avatar });
                                        this.$notify({
                                                type: 'success',
                                                message: '照片存档成功',
                                                title: '成功',
                                                showClose: false
                                        });
                                        this.isUpload = false;
                                } catch(e) {}
	                },
	                selectionChange(students) {
                                if(students. length > 0) {
                                        this.assignClass.stu_ids = [];
                                        students.forEach(item => this.assignClass.stu_ids.push(item.stu_id));
                                } else {
                                        this.assignClass.stu_ids = null;
                                }
	                },
	                beginAssignClass(student = null) {
                                if(student === null) {// 单个
                                        this.assignClass.stu_id = student.stu_id;
                                        this.assignClass.stu_ids = null;
                                } else {
                                        this.assignClass.stu_id = null;
                                        if(this.assignClass.stu_ids === null) {
                                                this.$notify({
                                                        type: 'warning',
                                                        message: '请至少选择一位学生进行分班',
                                                        title: '提示',
                                                        showClose: false
                                                });
                                                return;
                                        }
                                }
                                this.isAssignClass = true;
	                },
                        async saveAssignClass() {
                                try {
                                        await this.$http({ method: 'post', url: '/student/assignclass', data: this.assignClass });
                                        this.$notify({
                                                type: 'success',
                                                message: '分班成功',
                                                title: '成功',
                                                showClose: false
                                        });
                                        this.getCurrentPage(false);
                                        this.isAssignClass = false;
                                } catch(e) {}
                        }
                },
                async created() {
                        await this.classInit();
                        await this.classroomInit();
                        let dicRes = await this.$http({ url: '/dictionary/all' });
                        dicRes.forEach(item => {
                                item.dic_group_key === 'qualification' && this.qualificationList.push(item);
                        });
                        this.getCurrentPage(true);
                }
        };
</script>

<style scoped>
	.el-select { width: 100%; }
</style>