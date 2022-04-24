<template>
	<div class="container">
		<div class="left" :style="leftStyle">
			<div class="title">
				<h1>山东科技大学教务管理系统</h1>
				<span>ShanDong University Of Science and Technology</span>
			</div>
		</div>
		<div class="right">
			<img :src="logo" alt="">
			<el-form :model="model" :rules="rules" label-position="left" label-width="60px" status-icon>
				<el-form-item label="用户名" prop="user_name">
					<el-input placeholder="请输入内容" v-model.tirm="model.user_name" type="text"></el-input>
				</el-form-item>
				<el-form-item label="密码" prop="user_pwd">
					<el-input placeholder="请输入内容" v-model="model.user_pwd" type="password"></el-input>
				</el-form-item>
				<el-form-item>
					<el-button type="primary" round @click="login">登录</el-button>
				</el-form-item>
			</el-form>
		</div>
	</div>
</template>

<script>
	import logoImg from '@/assets/images/logo_title_dark.png';

	export default {
	        name: 'Login',
		data() {
	                return {
	                        model: {
                                        user_name: '',
                                        user_pwd: ''
	                        },
		                rules: {
	                                user_name: [
		                                {
		                                        validator: (rules, value, callback) => {
		                                                if(value.length === 0) {
		                                                        callback(new Error('用户名称为必填项'));
		                                                } else if(value.length < 2 || value.length > 15) {
		                                                        callback(new Error('用户名称长度为2-15'));
		                                                } else {
		                                                        callback();
		                                                }
		                                        },
			                                trigger: 'blur'
		                                }
	                                ],
			                user_pwd: [
                                                {
                                                        validator: (rules, value, callback) => {
                                                                if(value.length === 0) {
                                                                        callback(new Error('密码为必填项'));
                                                                } else if(new RegExp(/w/).test(value)) {
									callback(new Error('密码不能包含非字母、数字字符'));
                                                                }
                                                        },
	                                                trigger: 'blur'
                                                }
			                ]
		                },
		                logo: logoImg,
		                leftStyle: {
                                        width: '60%',
			                position: 'relative',
		                        backgroundImage: 'url(' + require("@/assets/images/login_bg.jpg") + ')',
		                        backgroundSize: 'cover',
			                backgroundRepeat: 'no-repeat',
			                backgroundPosition: '0 bottom'
		                }
	                };
		},
		methods: {
	                async login() {
	                        try {
                                        let token = await this.$http({ method: 'post', url: '/user/login', data: this.model });
                                        sessionStorage.setItem('token', token);
                                        sessionStorage.setItem('name', this.model.user_name);
                                        this.$router.replace('/home');
	                        } catch(e) {}
	                }
		}
	};
</script>

<style scoped>
	.container {
		display: flex;
		justify-content: flex-end;
		height: 100%;
		min-width: 900px;
		overflow: hidden;
	}
	.left {
		position: relative;
		animation: fade-in .8s ease-out forwards;
	}
	@keyframes fade-in {
		0% {
			right: -100%;
			opacity: 0;
		}
		100% {
			right: 0;
			opacity: 1;
		}
	}
	.left::after {
		content: '';
		position: absolute;
		left: 0;
		top: 0;
		height: 100%;
		width: 100%;
		background-color: rgba(0,108,230,.6);
	}
	.title {
		position: absolute;
		bottom: 23%;
		width: 80%;
		color: #fff;
		z-index: 1;
		opacity: 0;
		animation: fade-in-title .8s ease-out .3s forwards;
	}
	@keyframes fade-in-title {
		0% {
			left: 100%;
		}
		100% {
			left: 10%;
			opacity: 1;
		}
	}
	.title>h1 {
		font-weight: 500;
		font-size: 46px;
		letter-spacing: 2px;
	}
	.title>span {
		display: inline-block;
		font-size: 18px;
		font-family: Consolas;
		padding-top: 4px;
	}
	.right {
		flex-grow: 1;
		min-width: 400px;
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
		background-color: #fff;
		z-index: 0;
	}
	.right>img {
		height: 60px;
	}
	.el-form {
		margin-top: 50px;
		width: 70%;
	}
	.el-button--primary {
		width: 60%;
		margin: 0 20%;
		background-color: rgb(0,108,230);
		box-shadow: 0 4px 2px 0 rgba(0,108,230,.2);
	}
	.el-form-item__error {
		left: 20% !important;
	}
</style>