window.onload = function(){
	// 背景随鼠标移动
	(function() {
		let container = document.querySelector('.container'),
			width = 0,
			height = 0,
			x = 0,
			y = 0;
		window.onmousemove = function(e) {
			// 鼠标位置
			width = document.body.clientWidth;
			height = document.body.clientHeight;
			x = e.clientX < width / 2 ? -(e.clientX / 40) : e.clientX / 40;
			y = e.clientY < height / 2 ? -(e.clientY / 40) : e.clientY / 40;
			container.style.backgroundPositionX = x + 'px';
			container.style.backgroundPositionY = y + 'px';
		};
	})();

	// 获取验证码（闭包）
	(function() {
		let clickHandler = function() {
			let timer = null, second = 60;
			let that = this;
			return function() {
				let phone = that.parentNode.parentNode.querySelector('input[name="phone"]').value.trim();
				// console.log(phone);
				if(phone.length === 0) {
					alert('请输入手机号码！');
					return;
				}
				if(timer !== null) return;
				timer = setInterval(function() {
					that.innerText = second-- + 's';
					that.style.color = '#d2d2d2';
					that.style.backgroundColor = 'whitesmoke';
					setTimeout(function() {
						clearInterval(timer);
						timer = null;
						second = 60;
						that.innerText = '获取验证码';
						that.style.color = '#fff';
						that.style.backgroundColor = '#d2d2d2';
					}, 60000);
				}, 1000);
			};
		};
			
		document.querySelectorAll('span.btn-code').forEach(function(item) {
			item.onclick = clickHandler.call(item);
		});
	})();
	
	// 登录方式、登录注册切换
	(function() {
		let loginWrapper = document.querySelector('.wrapper.login'),
			registerWrapper = document.querySelector('.wrapper.register');
		let quickLogin = loginWrapper.querySelector('.login-type.quick>span'),
			quickInput = loginWrapper.querySelector('.input-bar-wrapper.quick'),
			quickTool = loginWrapper.querySelector('.tool.quick'),
			pwdLogin = loginWrapper.querySelector('.login-type.pwd>span'),
			pwdInput = loginWrapper.querySelector('.input-bar-wrapper.pwd'),
			pwdTool = loginWrapper.querySelector('.tool.pwd');
		
		// 登录注册切换
		document.querySelector('.go-register').onclick = function() {
			loginWrapper.classList.remove('active');
			resetLogin();
			registerWrapper.classList.add('active');
		};
		document.querySelector('.go-login').onclick = function() {
			registerWrapper.classList.remove('active');
			resetLogin();
			loginWrapper.classList.add('active');
		};
		// 登录方式切换
		document.querySelectorAll('.login-type>span').forEach(function(item) {
			item.onclick = function() {
				this.parentNode.parentNode.querySelector('.login-type.active').classList.remove('active');
				this.parentNode.classList.add('active');
				document.querySelector('.big-btn.login').classList.remove('active');
				if(this.parentNode.classList.contains('quick')) {
					resetLogin();
				} else if(this.parentNode.classList.contains('pwd')) {
					quickLogin.classList.remove('active');
					quickInput.classList.remove('active');
					quickTool.classList.remove('active');
					this.classList.add('active');
					pwdInput.classList.add('active');
					pwdTool.classList.add('active');
					document.forms['loginQuick']['phone'].value = "";
					document.forms['loginQuick']['code'].value = "";
				}
			};
		});
		// 重置登录方式
		function resetLogin() {
			pwdLogin.classList.remove('active');
			pwdInput.classList.remove('active');
			pwdTool.classList.remove('active');
			quickLogin.classList.add('active');
			quickInput.classList.add('active');
			quickTool.classList.add('active');
			document.forms['loginQuick']['phone'].value = "";
			document.forms['loginQuick']['code'].value = "";
			document.forms['loginPwd']['userNumber'].value = "";
			document.forms['loginPwd']['pwd'].value = "";
			document.forms['register']['phone'].value = "";
			document.forms['register']['code'].value = "";
			document.querySelector('.big-btn.login').classList.remove('active');
			document.querySelector('.big-btn.register').classList.remove('active');
		}
		// 激活登录按钮
		document.querySelectorAll('input').forEach(function(item) {
			item.oninput = function() {
				let sibling = this.parentNode.previousElementSibling === null ? 
								this.parentNode.nextElementSibling.querySelector('input').value.trim() :
								this.parentNode.previousElementSibling.querySelector('input').value.trim();
				// console.log(sibling);
				if(this.value.trim().length === 0 || sibling.length == 0) return;
				this.parentNode.parentNode.parentNode.parentNode.querySelector('.big-btn').classList.add('active');
			};
		});
		// 验证登录
		document.querySelector('.big-btn.login').onclick = function() {
			if(!this.classList.contains('active')) return;
			
			let test = {phone: '123', code: '1', pwd: '1'};
			
			let phoneLogin = document.forms['loginQuick']['phone'].value.trim(),
				codeLogin = document.forms['loginQuick']['code'].value.trim(),
				userNumber = document.forms['loginPwd']['userNumber'].value.trim(),
				pwd = document.forms['loginPwd']['pwd'].value.trim();
			if(document.querySelector('.input-bar-wrapper.quick').classList.contains('active')) {
				if(phoneLogin !== test.phone || codeLogin !== test.code) {
					alert('手机号码未注册或验证码错误');
					return;
				}
			} else {
				if(userNumber !== test.phone || pwd !== test.pwd) {
					alert('手机号码/邮箱或密码错误');
					return;
				}
			}
			Cookies.set('user', test, { expires: 3 });
			// console.log(document.referrer);
			if(document.referrer !== null) {
				window.location.replace(document.referrer);
			} else {
				window.location.replace('../html/home.html');
			}
		};
		// 注册
		document.querySelector('.big-btn.register').onclick = function() {
			let phoneRegister = document.forms['register']['phone'].value.trim(),
			codeRegister = document.forms['register']['code'].value.trim();
			if(phoneRegister.length === 0 || codeRegister === 0) {
				alert('输入不能为空，请检查！');
				return;
			} else {
				alert('注册成功，请登录');
				registerWrapper.classList.remove('active');
				loginWrapper.classList.add('active');
				resetLogin();
			}
		};
	})();
	
};
