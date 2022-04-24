let data = null;
let pid = parseInt($.query.get('pid')) || 1;
let count = parseInt($.query.get('count')) || 1;
let receive = { name: '', phone: 0, address: 0 };// 选中的收货信息
// 动态渲染内容
{
	$.ajax({
		type: 'get',
		url: '/product/model/' + pid,
		success: function(res) {
			if(res.code !== 200) {
				console.log(res.msg);
				return;
			}
			console.log(res);
			data = res.data;
			// 轮播图
			let htmlStr = '';
			let bannerImgs = res.data.bannerImgs.split(',');
			bannerImgs.forEach(function(item) {
				htmlStr += `
					<div class="swiper-slide"><img src="${item}" alt=""></div>
				`;
			});
			$('.swiper-wrapper').html(htmlStr);
			// 轮播图对象
			new Swiper('.banner', {
				loop: true,
				autoplay: {
					disableOnInteraction: false// 用户操作后不停止自动切换
				},
				pagination: {
					el: '.banner>.swiper-pagination',
					type: 'fraction'
				}
			});
			// 商品信息
			$('span.price').text(res.data.price);
			$('span.name').text(res.data.name);
			$('p.brief').text(res.data.brief);
			htmlStr = '';
			let otherImgs = res.data.otherImgs.split(',');
			otherImgs.forEach(function(item) {
				htmlStr += `
					<img src="${item}">
				`;
			});
			$('.detail').html(htmlStr);
		}
	});
	// 送货地址
	$.ajax({
		type: 'get',
		headers: {Authorization: Cookies.get('token')},
		url: '/address/get_default',
		success: function(res) {
			if(res.code !== 200) {
				console.log(res.msg);
				return;
			}
			// console.log(res.data);
			$('span.address').text(res.data.receiveRegion + res.data.receiveDetail);
			address = res.data.receiveRegion + res.data.receiveDetail;
		}
	});
}

// header和返回顶部
{
	let $content = $('.content');
	// header
	$('.header>i.icon-back').on('click', function() {
		window.history.back();
	});
	let thresholdOfHeader = 50, thresholdOfHeaderSpan = 590;
	$content.scroll(function() {
		if($content.scrollTop() > thresholdOfHeader) {
			$('.header').addClass('active');
			$('span.header-product').addClass('active');
			$('span.header-detail').removeClass('active');
			if($content.scrollTop() > thresholdOfHeaderSpan) {
				$('span.header-product').removeClass('active');
				$('span.header-detail').addClass('active');
			}
		} else {
			$('.header').removeClass('active');
		}
	});
	
	// 返回顶部
	let thresholdOfTop = 500;
	$content.scroll(function() {
		if($content.scrollTop() > thresholdOfTop) {
			$('.btn-top').addClass('active');
		} else {
			$('.btn-top').removeClass('active');
		}
	});
	let timer = null, top = 0;
	$('.btn-top').on('click', function() {
		timer = setInterval(function() {
			top = $content.scrollTop();
			if(top < 5) {
				$content.scrollTop(0);
				clearInterval(timer);
				timer = null;
				return;
			}
			$content.scrollTop(top * 0.7);
		}, 30);
	});
}

// 弹窗、底部按钮及其他点击事件
{
	let checkedAddrPos = -1;
	let list = [];
	$('.option-count').on('click', function() {
		let htmlStr = `
			<div class="count-container">
				<div class="top">
					<img src="${data.avatar}">
					<div class="top-content">
						<span class="price-wrapper">￥<span class="price">${data.price}</span></span>
						<span class="count-wrapper"><span class="count">${count}</span>件</span>
					</div>
				</div>
				<div class="count-area">
					<span>数量</span>
					<span class="count-wrapper"><span class="btn-decrease ${count > 1 ? 'active' : ''}">-</span><span class="count">${count}</span><span class="btn-increase ${count < 5 ? 'active' : ''}">+</span></span>
				</div>
				<div class="bottom-wrapper">
					<span class="btn-cart">加入购物车</span><span class="btn-buy">立即购买</span>
				</div>
			</div>
		`;
		layer.open({
			type: 1,
			content: htmlStr,
			anim: 'up',
			style: 'position:fixed; bottom:0; left:0; width: 100%; height: 400px; padding:10px 0; border:none; border-radius: 20px 20px 0 0;'
		});
	});
	$('.option-address').on('click', function() {
		$.ajax({
			type: 'get',
			headers: {Authorization: Cookies.get('token')},
			url: '/address/list',
			success: function(res) {
				if(res.code !== 200) {
					console.log(res.msg);
					return;
				}
				console.log(res);
				list = res.data;
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
	
	$('body')
		.on('click', 'i.checkbox', function() {
			$(this).parents('.address-wrapper').find('i.checkbox.checked').removeClass('checked');
			$(this).toggleClass('checked');
			checkedAddrPos = $(this).parent().index();
			receive = list[checkedAddrPos];
			$('span.address').text(receive.address);
		})
		.on('click', 'span.btn-decrease', function() {
			if(!$(this).hasClass('active')) return;
			$(this).siblings('span.btn-increase').addClass('active');
			let curCount = 0;
			$(this).parents('.count-container').find('span.count').each(function() {
				curCount = parseInt($(this).text()) - 1;
				$(this).text(curCount);
			});
			if(curCount === 1) {
				$(this).removeClass('active');
			} else {
				$(this).addClass('active');
			}
			count = curCount;
			$('span.count').text(curCount);
		})
		.on('click', 'span.btn-increase', function() {
			if(!$(this).hasClass('active')) return;
			$(this).siblings('span.btn-decrease').addClass('active');
			let curCount = 0;
			$(this).parents('.count-container').find('span.count').each(function() {
				curCount = parseInt($(this).text()) + 1;
				$(this).text(curCount);
			});
			if(curCount === 5) {
				$(this).removeClass('active');
			} else {
				$(this).addClass('active');
			}
			count = curCount;
			$('span.count').text(curCount);
		})
		.on('click', 'span.btn-cart', function() {
			if(!Cookies.get('user')) {// 未登录
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
			} else {
				$.ajax({
					type: 'post',
					headers: {Authorization: Cookies.get('token')},
					url: '/cart/add',
					data: {pid, count},
					success: function(res) {
						console.log(pid + '		' + count);
						if(res.code !== 200) {
							console.log(res.msg);
							return;
						}
						layer.open({
							content: '添加购物车成功',
							skin: 'msg',
							time: 1
						});
					}
				});
			}
			
		})
		.on('click', 'span.btn-buy', function() {
			if(!Cookies.get('user')) {// 未登录
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
			} else {
				let str = JSON.stringify(receive)
				window.location.href = '/order_confirm/index.html?pid=' + pid + '&receive=' + str + '&count=' + count;
			}
		});
	
	$('.cart').on('click', function() {
		window.location.replace('/cart/index.html');
	});
}

