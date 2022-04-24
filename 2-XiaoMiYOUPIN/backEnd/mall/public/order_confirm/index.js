let ids = [], account = 0, addressId = 0;
let pid = 0, count = 0, isone = true;// 加入购物车需要的数据（从商品详情页跳转需要先加入购物车）
// 动态渲染
{
	function getHtmlStr(item) {
		return `
			<div class="product-item">
				<div class="product-header"><img src="../images/mi_shop_icon.png" alt=""><span>小米自营</span></div>
				<div class="product">
					<img src="${item.avatar}" alt="" class="avatar">
					<div class="product-content">
						<h6 class="name">${item.name}</h6>
						<span class="product-content-detail"><span class="price-wrapper">￥<span class="price">${item.price}</span>.00</span><span class="count-wrapper">×<span class="count">${item.count}</span></span></span>
					</div>
				</div>
				<div class="content-item"><span>发票类型</span><span>个人电子发票<i class="iconfont icon-next"></i></span></div>
				<div class="content-item"><span>配送方式</span><span>快递配送</span></div>
				<div class="content-item"><span>买家留言</span><input type="text" placeholder="填写内容需与商家协商并确认，45字以内"></div>
			</div>
		`;
	}
	// 判断来源
	if(document.referrer.indexOf('/detail/index.html') !== -1) {// 从商品详情页跳转
		pid = $.query.get('pid') || 1;
		let receive = JSON.parse($.query.get('receive')) || {};
		// console.log(receive);
		count = $.query.get('count') || 1;
		account = count;
		$.ajax({
			type: 'get',
			url: '/product/model/' + pid,
			success: function(res) {
				if(res.code !== 200) {
					console.log(res.msg);
					return;
				}
				// console.log(res);
				isone = true;
				if(receive.name === '') {
					$('.receive-area').addClass('default');
				} else {
					$('.receive-name').text(receive.name);
					$('.receive-phone').text(receive.phone);
					$('.receive-address').text(receive.address);
				}
				let detail = res.data;
				detail.count = count;
				$('.product-area').html(getHtmlStr(detail));
				$('span.total').each(function() {
					$(this).text(res.data.price * count);
				});
			}
		});
	} else if(document.referrer.indexOf('/cart/index.html') !== -1) {// 从购物车跳转
		ids = $.query.get('ids').split(',') || [1];
		let total = $.query.get('total') || 1;
		account = total;
		// console.log(ids);
		$('.receive-area').addClass('default');
		$.ajax({
			type: 'post',
			headers: {Authorization: Cookies.get('token')},
			url: '/cart/list_ids',
			data: {ids},
			success: function(res) {
				if(res.code !== 200) {
					console.log(res.msg);
					return;
				}
				// console.log(res);
				isone = false;
				res.data.forEach(function(item) {
					$(getHtmlStr(item)).appendTo($('.product-area'));
				});
			}
		});
		$('span.total').each(function() {
			$(this).text(total);
		});
	}
	
}

// header
{
	let top = 0;
	$('.content').on('scroll', function() {
		top = $('.content').scrollTop();
		$('.header').toggleClass('active', top > 60);
	});
	$('.header>i.icon-back').on('click', function() {
		window.history.back();
	});
}

// 收货地址
{
	let checkedAddrPos = -1;
	$('.receive-area').on('click', function() {
		$.ajax({
			type: 'get',
			headers: {Authorization: Cookies.get('token')},
			url: '/address/list',
			success: function(res) {
				if(res.code !== 200) {
					console.log(res.msg);
					return;
				}
				// console.log(res);
				let addressStr = '';
				res.data.forEach(function(item, i) {
					addressStr += `
						<div class="address-item">
							<i class="checkbox ${i === checkedAddrPos ? 'checked' : ''}"></i>
							<div>
								<p>${item.receiveName}<p>
								<div class="address-item-content">${item.receiveRegion} ${item.receiveDetail}</div>
							</div>
						</div>
					`;
				});
				let htmlStr = `
					<div class="address-container">
						<div class="top">配送地址</div>
						<div class="address-content">
							<span class="default-text">暂无收货地址</span>
							<div class="address-wrapper">${addressStr}</div>
						</div>
						<div class="bottom-wrapper">
							<span class="btn-other-address">选择其他配送地址</span>
						</div>
					</div>
				`;
				layer.open({
					type: 1,
					content: htmlStr,
					anim: 'up',
					style: 'position:fixed; bottom:0; left:0; width: 100%; height: 400px; padding:10px 0; border:none; border-radius: 20px 20px 0 0;'
				});
			}
		});
	});
	$('body').on('click', 'i.checkbox', function() {
		$(this).parents('.address-wrapper').find('i.checkbox.checked').removeClass('checked');
		$(this).toggleClass('checked');
		address = $(this).siblings().children('.address-item-content').text();
		$('.receive-area').removeClass('default');
		$.ajax({
			type: 'get',
			headers: {Authorization: Cookies.get('token')},
			url: '/address/list',
			success: function(res) {
				if(res.code !== 200) {
					console.log(res.msg);
					return;
				}
				// console.log(res);
				let region = address.substring(0, address.indexOf('街道') + 2);
				let detail = address.substring(address.indexOf('街道') + 3);
				// console.log(region);
				// console.log(detail);
				res.data.forEach(function(item) {
					if(item.receiveRegion.indexOf(region) !== -1 && item.receiveDetail.indexOf(detail) !== -1) {
						addressId = item.id;
						$('span.receive-name').text(item.receiveName);
						$('span.receive-phone').text(item.receivePhone);
						$('.receive-address').text(address);
					}
				});
			}
		});
		checkedAddrPos = $(this).parent().index();
	});
}

// 生成订单
{
	$('.btn-save').on('click', function() {
		if($('.receive-area').hasClass('default')) {
			layer.open({
				content: '请选择地址',
				skin: 'msg',
				time: 1
			});
			return;
		}
		if(isone) {
			// 加入购物车
			$.ajax({
				async: false,// 关闭异步执行
				type: 'post',
				headers: {Authorization: Cookies.get('token')},
				url: '/cart/add',
				data: {pid, count},
				success: function(res) {
					if(res.code !== 200) {
						console.log(res.msg);
						return;
					}
					// 读取购物记录id
					$.ajax({
						async: false,// 关闭异步执行
						type: 'post',
						headers: {Authorization: Cookies.get('token')},
						url: '/cart/list',
						success: function(res) {
							if(res.code !== 200) {
								console.log(res.msg);
								return;
							}
							// console.log(res);
							res.data.forEach(function(item) {
								if(item.pid === pid) {
									ids.push(item.id);
									return;
								}
							});
							layer.open({
								content: '订单正在提交，请稍后',
								skin: 'msg',
								time: 1
							});
							$.ajax({
								async: false,// 关闭异步执行
								type: 'post',
								headers: {Authorization: Cookies.get('token')},
								url: '/order/confirm',
								data: {ids, account, addressId},
								success: function(res) {
									if(res.code !== 200) {
										console.log(res.msg);
										return;
									}
									// console.log(res);
									layer.open({
										content: '提交订单成功',
										skin: 'msg',
										time: 1
									});
									setTimeout(function() {
										window.location.replace(document.referrer);
									}, 1000);
								}
							});
						}
					});
				}
			});
		} else {
			layer.open({
				content: '订单正在提交，请稍后',
				skin: 'msg',
				time: 1
			});
			$.ajax({
				type: 'post',
				headers: {Authorization: Cookies.get('token')},
				url: '/order/confirm',
				data: {ids, account, addressId},
				success: function(res) {
					if(res.code !== 200) {
						console.log(res.msg);
						return;
					}
					// console.log(res);
					layer.open({
						content: '提交订单成功',
						skin: 'msg',
						time: 1
					});
					setTimeout(function() {
						window.location.replace(document.referrer);
					}, 1000);
				}
			});
		}
	});
}
