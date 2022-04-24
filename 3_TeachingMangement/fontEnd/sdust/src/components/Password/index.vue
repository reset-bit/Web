<template>
	<div class="container">
		<el-form :model="model" label-width="80px" :rules="rules" status-icon ref="form">
			<el-form-item label="原密码" prop="oldPwd">
				<el-input  type="password" v-model="model.oldPwd"></el-input>
			</el-form-item>
			<el-form-item label="新密码" prop="newPwd">
				<el-input  type="password" v-model="model.newPwd"></el-input>
			</el-form-item>
			<el-form-item label="密码确认" prop="checkPwd">
				<el-input type="password" v-model="model.checkPwd"></el-input>
			</el-form-item>
		</el-form>
		<div class="buttons-wrapper">
			<el-button type="primary" @click="changePwd">确定</el-button>
			<el-button @click="resetForm">重置</el-button>
		</div>
	</div>
</template>

<script>
        export default {
                name: 'Password',
	        data() {
                        return {
                                model: {
                                        oldPwd: '',
	                                newPwd: '',
	                                checkPwd: '',
                                },
	                        rules: {
                                        oldPwd: [
	                                        {
	                                                validator: (rule, value, callback) => {
	                                                        if(value.length === 0) {
	                                                                callback(new Error('请输入原密码'));
	                                                        } else if(value.length < 2 || value.length > 10) {
	                                                                callback(new Error('密码长度在2-10个字符之间'));
	                                                        } else {
	                                                                callback();
	                                                        }
	                                                },
		                                        trigger: 'blur'
	                                        }
                                        ],
		                        newPwd: [
			                        {
                                                        validator: (rule, value, callback) => {
                                                                if(value.length === 0) {
                                                                        callback(new Error('请输入新密码'));
                                                                } else if(value.length < 2 || value.length > 10) {
                                                                        callback(new Error('密码长度在2-10个字符之间'));
                                                                } else {
                                                                        callback();
                                                                }
                                                        },
                                                        trigger: 'blur'
			                        }
		                        ],
		                        checkPwd: [
			                        {
			                                validator: (rule, value, callback) => {
			                                        if(value.length === 0) {
				                                        callback(new Error('请输入确认密码'));
			                                        } else if(value !== this.model.newPwd) {
			                                                callback(new Error('两次输入密码不一致'));
			                                        } else {
			                                                callback();
			                                        }
			                                },
				                        trigger: 'blur'
			                        }
		                        ]
	                        }
                        };
	        },
	        methods: {
                        resetForm() {
                                this.model = {
                                        oldPwd: '',
                                        newPwd: '',
                                        checkPwd: ''
                                };
                                this.$refs.form.clearValidate();
                        },
		        async changePwd() {
                                try {
                                        await this.$refs.form.validate();
                                        let data = { oldPwd: this.model.oldPwd, newPwd: this.model.newPwd };
                                        await this.$http({ method: 'post', url: '/user/pwdchange', data });
                                        this.$notify({
	                                        type: 'success',
	                                        message: '修改密码成功',
	                                        title: '成功',
	                                        showClose: false
                                        });
                                        this.resetForm();
                                } catch(e) {
                                        this.$notify({
                                                type: 'warning',
                                                message: '修改密码失败，请检查原密码或求助管理员',
                                                title: '失败',
                                                showClose: false
                                        });
                                }
		        }
	        }
        };
</script>

<style scoped>
	.container {
		padding: 4% 25% 0;
	}
	.el-form-item { position: relative; }
	.el-form-item i {
		position: absolute;
		top: 50%;
		right: 20px;
		transform: translate(0, -50%);
		padding: 10px;
		cursor: pointer;
	}
	i.isActive { color: rgb(0,167,245); }
	.buttons-wrapper {
		display: flex;
		justify-content: center;
	}
	.buttons-wrapper .el-button {
		width: 20%;
		margin: 0 20px;
	}
</style>