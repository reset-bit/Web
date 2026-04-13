new Swiper('.banner', {
	loop: true,
	autoplay: {
		disableOnInteraction: false
	},
	pagination: {
		el: ".banner>.swiper-pagination",
		type: 'fraction'
	},
	navigation: {
		prevEl: '.banner>.swiper-button-prev',
		nextEl: '.banner>.swiper-button-next'
	}
});

var $loginForm = $('form.login').Validform({
	tiptype: 3
});
$('button.btn-login').on('click', function() {
	if(!$loginForm.check(false)) return;// 针对直接点击登录按钮的情况
	$.ajax({
		type: 'post',
		url: '/user/login_pwd',
		data: { 
			name: $('input.name').val().trim(), 
			pwd: $('input.pwd').val().trim()
		},
		success: function(res) {
			console.log(res);
			if(res.code !== 200) {
				layer.msg(res.msg, { time: 1000 });
				return;
			}
			Cookies.set('token', res.data);// , { expires: 1 }
			Cookies.set('name', $('input.name').val().trim());
			// layer.msg('登录成功', { time: 1000 });
			window.location.replace(document.referrer || '/test/index.html');
		}
	});
});