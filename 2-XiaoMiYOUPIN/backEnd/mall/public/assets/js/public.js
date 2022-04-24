// 更新购物车上标
{
	if(Cookies.get('user')) {// 已登录
		$('sup.cart-count').css('display', 'flex');
		$.ajax({
			type: 'post',
			headers: {Authorization:Cookies.get('token')},
			url: '/cart/list',
			success: function(res) {
				if(res.code !== 200) {
					console.log(res.msg);
					return;
				}
				// console.log(res);
				if(res.data.length > 0) {
					$('sup.cart-count').text(res.data.length);
				} else {
					$('sup.cart-count').css('display', 'none');
				}
			}
		});
	} else {// 未登录
		$('sup.cart-count').css('display', 'none');
	}
}