{
	$('i.checkbox').on('click', function() {
		$(this).toggleClass('checked');
	});
	$('input').on('focus', function() {
		$(this).parent().addClass('focus');
	}).on('blur', function() {
		$(this).parent().removeClass('focus');
	}).on('input', function() {
		let flag = true;
		$('input').each(function() {
			if($(this).val().length === 0) {
				flag = false;
			}
		});
		$('.btn-next').toggleClass('active', flag);
	});
	
	// 下一步按钮验证
	$('.btn-next').on('click', function() {
		if(!$(this).hasClass('active')) return;
		let name = $('input.username').val().trim();
		let pwd = $('input.pwd').val().trim();
		let phone = $('input.phone').val().trim();
		let reg = /1[3-9]\d{9}/g;
		if(!reg.test(phone)) {
			layer.open({
				content: '请输入正确的用户号码',
				skin: 'msg',
				time: 2
			});
			return;
		}
		if(!$('i.checkbox').hasClass('checked')) {
			layer.open({
				content: '请勾选同意用户协议和隐私政策',
				skin: 'msg',
				time: 2
			});
			return;
		}
		$.ajax({
			type: 'post',
			url: '/user/register',
			data: { name, pwd, phone },
			success: function(res) {
				if(res.code !== 200) {
					console.log(res.msg);
					return;
				}
				console.log('res success');
				layer.open({
					content: '注册成功，请登录',
					skin: 'msg',
					time: 2
				});
				setTimeout(function() {
					window.location.replace('/login/index.html');
				}, 2000);
			}
		});
	});
}