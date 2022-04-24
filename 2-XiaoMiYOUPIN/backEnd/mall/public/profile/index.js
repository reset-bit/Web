let user = Cookies.get('user') || '';
// 切换登录显示部分
$('.user-wrapper').toggleClass('alreadyLogged', user !== '');
if(user !== '') {
	$('span.name').text(user);
}
$('.btn-exit-wrapper').toggleClass('active', user !== '');

// 登录跳转
{
	$('.user-wrapper>*').on('click', function() {
		user = Cookies.get('user') || '';
		if(user === '') {
			layer.open({
				type: 0,
				title: [
					'声明与政策',
					'border-bottom: 1px solid gray'
					],
				content: '欢迎您来到小米有品！我们依据最新法律法规要求，制定并更新了《隐私政策》、《小米有品用户协议》以及《小米账号使用协议》。您需阅读并统一相关政策条款方可进行登录。',
				btn: ['同意', '不同意'],
				yes: function() {
					window.location.href = '/login/index.html';
				}
			});
		}
	});
}

// 退出按钮响应事件
{
	$('.btn-exit-wrapper').on('click', function() {
		layer.open({
			content: '确定退出吗？',
			btn: ['确定', '取消'],
			yes: function(index) {
				Cookies.remove('user');
				Cookies.remove('token');
				$('.user-wrapper').removeClass('alreadyLogged');
				$('.btn-exit-wrapper').removeClass('active');
				$('sup.cart-count').css('display', 'none');
				layer.close(index);
			}
		});
	});
}