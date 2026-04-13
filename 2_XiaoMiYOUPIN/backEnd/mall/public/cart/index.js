// 购物车状态判断
{
	if(!Cookies.get('user')) {
		$('.container').removeClass('empty');
		$('.container').addClass('default');
	} else {
		// 获取用户购物车信息
		$.ajax({
			type: 'post',
			headers: {Authorization:Cookies.get('token')},
			url: '/cart/list',
			success: function(res) {
				if(res.code !== 200) {
					console.log(res.msg);
					return;
				}
				console.log(res);
				if(res.data.length === 0) {// 空购物车
					$('.container').removeClass('default');
					$('.container').addClass('empty');
				} else { // 渲染购物车数据
					let htmlStr = '';
					res.data.forEach(function(item) {
						htmlStr += `
							<li data-id="${item.id}" data-pid=${item.pid}>
								<i class="checkbox"></i>
								<div class="list-content-wrapper">
									<img src="${item.avatar}">
									<div class="list-content">
										<h6 class="name">${item.name}</h6>
										<div class="price-wrapper">
										<span class="price-wrapper">￥<span class="price">${item.price}</span>.00</span>
										<span class="count-wrapper"><span class="btn-decrease ${item.count === 1 ? '' : 'active'}">-</span><span class="count">${item.count}</span><span class="btn-increase active">+</span><span>
										</div>
									</div>
							</div>
							</li>
						`;
					});
					$('ul.list').html(htmlStr);
				}
			}
		});
	}
}

// 点击事件
{	
	let ids = [];
	let total = 0;
	// 全选按钮
	$('i.checkbox.all').on('click', function() {
		$(this).toggleClass('checked');
		let that = this;
		$('i.checkbox:not(.all)').each(function() {
			$(this).toggleClass('checked', $(that).hasClass('checked'));
		});
		updateTotal();
	});
	
	// 事件委托完成单选按钮、商品数量增减
	$('.content')
		.on('click', '.list-content-wrapper>img', function() {
			let pid = $(this).parents('li').attr('data-pid');
			let count = $(this).parents('li').children('span.count');
			window.location.href = '/detail/index.html?pid='+pid+'&count='+count;
		})
		.on('click', 'h6.name', function() {
			let pid = $(this).parents('li').attr('data-pid');
			let count = $(this).parents('li').children('span.count');
			window.location.href = '/detail/index.html?pid='+pid+'&count='+count;
		})
		.on('click', 'i.checkbox', function() {
			$(this).toggleClass('checked');
			$('i.checkbox.all').toggleClass('checked', $('i.checkbox:not(.all,.checked)').length === 0);
			updateTotal();
		})
		.on('click', 'span.btn-decrease', function() {
			if(!$(this).hasClass('active')) return;
			$(this).siblings('span.btn-increase').addClass('active');
			$.ajax({
				type: 'post',
				headers: {Authorization: Cookies.get('token')},
				url: '/cart/decrease/' + $(this).parents('li').attr('data-id'),
				success: function(res) {
					if(res.code !== 200) {
						console.log(res.msg);
						return;
					}
				}
			});
			let $count = $(this).siblings('span.count');
			let oldCount = parseInt($count.text());
			$count.text(oldCount - 1);
			if(oldCount - 1 === 1) {
				$(this).removeClass('active');
			}
			updateTotal();
		})
		.on('click', 'span.btn-increase', function() {
			if(!$(this).hasClass('active')) return;
			$(this).siblings('span.btn-decrease').addClass('active');
			$.ajax({
				type: 'post',
				headers: {Authorization: Cookies.get('token')},
				url: '/cart/increase/' + $(this).parents('li').attr('data-id'),
				success: function(res) {
					if(res.code !== 200) {
						console.log(res.msg);
						return;
					}
				}
			});
			let $count = $(this).siblings('span.count');
			let oldCount = parseInt($count.text());
			$count.text(oldCount + 1);
			if(oldCount + 1 === 5) {
				$(this).removeClass('active');
			}
			updateTotal();
		});
	// 删除与结算
	$('span.btn-option').on('click', function() {
		if(!$(this).hasClass('active')) return;
		if($(this).text() === '结算') {
			window.location.href = '/order_confirm/index.html?ids=' + ids + '&total=' + total;
		} else {
			let ids = [];
			layer.open({
				content: '确定要删除吗？',
				btn: ['确定', '取消'],
				yes: function(index) {
					$('i.checkbox.checked:not(.all)').each(function() {
						ids.push(parseInt($(this).parent().attr('data-id')));
						layer.close(index);
					});
					$.ajax({
						type: 'post',
						headers: {Authorization: Cookies.get('token')},
						url: '/cart/remove',
						data: {ids},
						success: function(res) {
							if(res.code !== 200) {
								console.log(res.msg);
								return;
							}
						}
					});
					$('i.checkbox.checked:not(.all)').each(function() {
						$(this).parent().remove();
					});
					$('.container').addClass('empty');
				}
			});
			$('span.btn-option').text('删除');
		}
	});
	
	// 更新底部工具栏
	function updateTotal() {
		if($('i.checkbox.checked:not(.all)').length !== 0) {
			$('span.btn-option').addClass('active');
		} else {
			$('span.btn-option').removeClass('active');
		}
		if($('span.btn-option').text() === '结算') {// 商品结算页面，更新总金额
			ids = [];
			$('i.checkbox.checked:not(.all)').each(function() {
				ids.push(parseInt($(this).parent().attr('data-id')));
			});
			$.ajax({
				type: 'post',
				headers: {Authorization:Cookies.get('token')},
				url: '/cart/list',
				success: function(res) {
					if(res.code !== 200) {
						console.log(res.msg);
						return;
					}
					total = 0;
					res.data.forEach(function(item) {
						if(ids.indexOf(item.id) !== -1) {
							total += item.count * item.price;
						}
					});
					$('span.total').text(total);
				}
			});
		} else {// 商品编辑页面，更新删除数量
			let cnt = 0;
			$('i.checkbox.checked:not(.all)').each(function() {
				cnt += parseInt($(this).parent().find('span.count').text());
			});
			$('span.btn-option').text('删除(' + cnt + ')');
		}
	};
	
	// 编辑（选中并删除）商品
	$('span.option').on('click', function() {
		if($(this).text() === '编辑') {
			$(this).text('完成');
			$('span.btn-option').text('删除');
			$('span.total-price-wrapper').css('display', 'none');
		} else if($(this).text() === '完成') {
			$(this).text('编辑');
			$('span.btn-option').text('结算');
			$('span.total-price-wrapper').css('display', 'inline-block');
		}
		// 单选按钮重置
		$('i.checkbox.checked').each(function() {
			$(this).removeClass('checked');
		});
	});
}

// 登录、页面跳转
{
	$('span.btn-login').on('click', function() {
		layer.open({
			type: 0,
			title: ['声明与政策', 'border-bottom: 1px solid gray'],
			content: '欢迎您来到小米有品！我们依据最新法律法规要求，制定并更新了《隐私政策》、《小米有品用户协议》以及《小米账号使用协议》。您需阅读并统一相关政策条款方可进行登录。',
			btn: ['同意', '不同意'],
			yes: function() {
				window.location.href = '/login/index.html';
			}
		});
	});
	
	$('.header>i.icon-back').on('click', function() {
		window.history.back();
	});
}