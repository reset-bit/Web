{
	// 登录方式切换
	$('span.login-pwd').on('click', function() {
		$('.content').css('left', '-100%');
		$('span.welcome').css('animation', 'in .2s ease-in-out');
		setTimeout(function() {
			$('span.welcome').css('animation', 'none');
		}, 200);
	});
	$('span.login-phone').on('click', function() {
		$('.content').css('left', '0');
		$('span.welcome').css('animation', 'out .2s ease-in-out');
		setTimeout(function() {
			$('span.welcome').css('animation', 'none');
		}, 200);
	});
	// 按钮激活
	$('input').on('input', function() {
		$('.btn-next').toggleClass('active', $('input.phone-input').val().length !== 0);
		$('.btn-login').toggleClass('active', $('input.name-input').val().length !== 0 && $('input.pwd-input').val().length !== 0);
	});
	
	// 手机登录
	let $loginForm = $('form.login').Validform({
		tiptype: 3,
		datatype: {
			phone: /1[3-9]\d{9}/g
		}
	});
	$('.btn-next').on('click', function() {
		if(!$(this).hasClass('active')) return;
		layer.open({
			content: '暂不支持此功能，请选择账号密码登录',
			skin: 'msg',
			time: 2
		});
	});
	
	// 账号密码登录
	$('.btn-login').on('click', function() {
		if(!$(this).hasClass('active')) return;
		let name = $('input.name-input').val().trim();
		let pwd = $('input.pwd-input').val().trim();
		$.ajax({
			type: 'post',
			url: '/user/login_pwd',
			data: { name, pwd },
			success: function(res) {
				if(res.code !== 200) {
					if(res.msg === '账号或密码错误..') {
						layer.open({
							content: res.msg,
							skin: 'msg',
							time: 1
						});
					} else {
						console.log(res.msg);
					}
					return;
				}
				Cookies.set('token', res.data);
				Cookies.set('user', name);
				layer.open({
					content: '登录成功',
					skin: 'msg',
					time: 1
				});
				setTimeout(function() {
					window.location.replace(document.referrer || '/home/index.html');
				}, 2000);
			}
		});
	});
}