<template>
	<div>
		<el-row :gutter="20">
			<el-col v-for="item in list" :key="item.clsr_id" :span="6">
				<el-card shadow="hover" :body-style="cardStyle" :class="{ isOccupied: item.clsr_occupy === 1 }">
					<i class="el-icon-data-line" v-if="item.clsr_occupy === 1"></i>
					<i class="el-icon-data-board" v-else></i>
					<span v-text="item.clsr_name"></span>
					<div class="options">
						<el-button type="text" icon="el-icon-edit" @click="beginUpdate(item)">编辑</el-button>
						<el-button type="text" icon="el-icon-delete" v-show="item.clsr_occupy === 0"
						           @click="removeHandler(item)">删除</el-button>
					</div>
				</el-card>
			</el-col>
			<el-col :span="6">
				<el-card shadow="hover" :body-style="cardStyle">
					<el-button icon="el-icon-plus" type="text" class="add-btn" @click="beginAdd"></el-button>
				</el-card>
			</el-col>
		</el-row>
		<el-dialog :modal="false" :visible.sync="isEdit" title="教室编辑">
			<el-form :model="model.data" :rules="model.rules" status-icon label-width="60px" ref="form">
				<el-form-item label="教室名称" prop="clsr_name">
					<el-input v-model="model.data.clsr_name"></el-input>
				</el-form-item>
			</el-form>
			<div slot="footer">
				<el-button type="primary" @click="save">确定</el-button>
				<el-button @click="isEdit = false">取消</el-button>
			</div>
		</el-dialog>
	</div>
</template>

<script>
	import { mapState, mapActions } from 'vuex';

        export default {
                name: 'Classroom',
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
                                                clsr_id: 0,
                                                clsr_name: ''
                                        },
		                        rules: {
                                                clsr_name: [
	                                                {
	                                                        validator: (rule, value, callback) => {
	                                                                if(value.length === 0) {
	                                                                        callback(new Error('请输入教室名称'));
	                                                                } else if(value.length < 2 || value.length > 10) {
	                                                                        callback(new Error('教室名称长度在2-10个字符之间'));
	                                                                } else if(this.list.find(item => item.clsr_name === value && item.clsr_id !== this.model.data.clsr_id)) {
	                                                                        callback(new Error('教室名称已存在'));
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
		        ...mapState('classroom', ['list'])
	        },
	        methods: {
		        ...mapActions('classroom', ['init', 'remove', 'update', 'add']),
		        async removeHandler(classroom) {
		                try {
                                        await this.$confirm(`确定删除${classroom.clsr_name}吗？`, '提示', { type: 'warning' });
                                        await this.remove(classroom.clsr_id);
                                        this.$notify({
	                                        type: 'success',
	                                        message: '删除教室成功',
	                                        title: '成功',
	                                        showClose: false
                                        });
		                } catch(e) {}
		        },
		        beginAdd() {
		                if(this.$refs.form) { this.$refs.form.clearValidate(); }
                                this.model.data.clsr_id = 0;
                                this.model.data.clsr_name = '';
		                this.isEdit = true;
		        },
		        beginUpdate(classroom) {
                                if(this.$refs.form) { this.$refs.form.clearValidate(); }
                                this.model.data.clsr_id = classroom.clsr_id;
		                this.model.data.clsr_name = classroom.clsr_name;
		                this.isEdit = true;
		        },
		        async save() {
		                try {
                                        this.$refs.form.validate();
					await this[this.model.data.clsr_id === 0 ? 'add' : 'update'](this.model.data);
					let message = this.model.data.clsr_id === 0 ? '新增教室成功' : '修改教室成功';
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
	        async created() { this.init(); }
        };
</script>

<style scoped>
	.el-col { margin-bottom: 20px; }
	/* card */
	.el-card { position: relative; }
	.el-card.isOccupied { background-color: rgb(237,243,246); }
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
		background-color: #fff;
	}
	.el-card.isOccupied .options { background-color: rgb(237,243,246); }
	.el-card__body:hover .options { opacity: 1; }
	.options .el-button { color: #333; }
	.options .el-button:hover { color: rgb(0,167,245); }
	.el-button.add-btn {
		height: 100%;
		width: 100%;
		color: #333;
	}
	.el-form { display: flex; justify-content: center; }
</style>