// list
let name = '';
let cid = parseInt($.query.get('cid')) || 17;
let orderCol = 'price';// price|rate|sale
let orderDir = 'asc';// asc|desc
let pageSize = 6;

// status
let isLoading = false;
let hasMore = true;
let isTriggerLoadMore = false;
let iscroll = null;// iscroll对象

// 更新底部提示
function updateTip() {
	let $tip = $('p.tip');
	if(isLoading) {
		$tip.text('- 加载中.. -');
	} else if(isTriggerLoadMore) {
		$tip.text('- 松手加载更多 -');
	} else if(hasMore) {
		$tip.text('- 上拉加载更多 -');
	} else if($('ul.list li').length === 0) {
		$tip.text('- 暂无相关商品，敬请期待 -');
	} else {
		$tip.text('- 没有更多商品了 -');
	}
};

// 商品列表动态渲染、加载更多、排序切换
{
	// title
	$('span.title').text($.query.get('cName') || '电视机');
	
	// 水平分类
	let pid = parseInt($.query.get('pid')) || 1;
	// 动态渲染
	$.ajax({
		type: 'get',
		url: '/category/list/' + pid,
		success: function(res) {
			if(res.code !== 200) {
				console.log(res.msg);
				return;
			}
			// console.log(res);
			let htmlStr = '';
			res.data.forEach(function(item) {
				htmlStr += `
					<li class="${cid === item.id ? 'active' : ''}" data-cid=${item.id}>
						<img src="${item.avatar}"/>
						<span class="name">${item.name}</span>
					</li>
				`;
			});
			$('ul.category').html(htmlStr);
		}
	});
	// 点击事件
	$('ul.category').on('click', 'li', function() {
		$(this).addClass('active').siblings('.active').removeClass('active');
		cid = $(this).attr('data-cid');
		getData();
	});
	
	function initOrRefreshScroll() {
		$('.content-wrapper').imagesLoaded(function() {
			if(iscroll === null) {
				iscroll = new IScroll($('.content-wrapper')[0], {
					deceleration: 0.002,
					bounce: false,
					probeType: 2,
					click: true
				});
				// 滑动过程中事件处理函数：判断是否到达底部并更新tip值
				iscroll.on('scroll', function() {
					if(isLoading || !hasMore) return;
					isTriggerLoadMore = iscroll.y - iscroll.maxScrollY === 0;
					updateTip();
				});
				// 滑动结束事件处理函数：判断是否触发加载更多。若触发，则加载
				iscroll.on('scrollEnd', function() {
					if(isTriggerLoadMore) {
						getData(true);
						isTriggerLoadMore = false;
					}
				});
			} else {
				iscroll.refresh();// 更新可滑动区域
			}
		});
	};
	
	// 动态渲染列表数据
	function getData() {
		isLoading = true;
		updateTip();
		if(!isTriggerLoadMore) $('ul.list').empty();
		$.ajax({
			type: 'post',
			url: '/product/list',
			data: { name, cid, orderCol, orderDir, begin: $('ul.list>li').length, pageSize },
			success: function(res) {
				if(res.code !== 200) {
					console.log(res.msg);
					return;
				}
				// console.log(res);
				setTimeout(function() {
					let htmlStr = '';
					res.data.forEach(function(item) {
						htmlStr += `
							<li>
								<a href="/detail/index.html?pid=${item.id}">
									<img src="${item.avatar}" />
									<div class="product-detail">
										<h6>${item.name}</h6>
										<p>${item.brief}</p>
										<div class="price-wrapper">￥<span class="price">${item.price}</span></div>
										<div class="other-wrapper"><span class="rate-wrapper"><span class="rate">${item.rate}</span>条好评</span><span class="sale-wrapper"><span class="sale">${item.sale}</span>件销量</span></div>
									</div>
								</a>
							</li>
						`;
					});
					$(htmlStr).appendTo('ul.list');
					initOrRefreshScroll();
					isLoading = false;
					hasMore = res.data.length === pageSize;
					updateTip();
				}, 500);
			}
		});
	};
	getData();
	
	// 切换列表排序类型及顺序
	$('.order-wrapper').on('click', 'span', function(e) {
		if($(this).hasClass('active') && $(this).attr('data-col') === 'price') {// 针对价格切换升降序
			orderDir = $(this).hasClass('asc') ? 'desc' : 'asc';
			$(this).toggleClass('asc desc').children('i').toggleClass('icon-sort_asc icon-sort_desc');
		} else {// 切换排序方式
			orderCol = $(this).attr('data-col');
			orderDir = $(this).attr('class');
			$(this).addClass('active').siblings('.active').removeClass('active');
		}
		getData();
		iscroll && iscroll.scrollTo(0, 0, 0);// 排序切换复位
	});
}

// 搜索模态框
{
	$('.default-header>i.icon-search').on('click', function() {
		$('.search-module').fadeIn(100);
	});
	
	function getDataByName(pName) {
		name = pName;
		$('ul.list').empty();
		$.ajax({
			type: 'post',
			url: '/product/list',
			data: { name, cid, orderCol, orderDir, begin: 0, pageSize },
			success: function(res) {
				if(res.code !== 200) {
					console.log(res.msg);
					return;
				}
				// console.log(res);
				let htmlStr = '';
				res.data.forEach(function(item) {
					htmlStr += `
						<li>
							<a href="/detail/index.html?pid=${item.id}">
								<img src="${item.avatar}" />
								<div class="product-detail">
									<h6>${item.name}</h6>
									<p>${item.brief}</p>
									<div class="price-wrapper">￥<span class="price">${item.price}</span></div>
									<div class="other-wrapper"><span class="rate-wrapper"><span class="rate">${item.rate}</span>条好评</span><span class="sale-wrapper"><span class="sale">${item.sale}</span>件销量</span></div>
								</div>
							</a>
						</li>
					`;
				});
				$(htmlStr).appendTo('ul.list');
				hasMore = res.data.length === pageSize;
				updateTip();
			}
		});
	};	
		
	function toggleHeader() {
		$('.default-header-wrapper').removeClass('active');
		$('.search-module').fadeOut(100);
		$('.result-header').addClass('active');
	};
	// 搜索按钮响应事件
	$('span.btn-search').on('click', function() {
		let $li = $('ul.search-list>li.active');
		let searchStr = $('input.module-search').val();
		if(searchStr.length === 0) {
			getDataByName($li.text());
		} else {
			getDataByName(searchStr);
		}
		toggleHeader();
	});
	// “搜索发现”标签响应事件
	$('.module-content').on('click', 'span', function() {
		getDataByName($(this).text());
		toggleHeader();
	});
	
	// keypress回车事件：按照名字搜索商品
	$('input.header-search').on('keypress', function() {
		getDataByName($('input.header-search').val());
	});
	// input事件：隐藏轮播商品
	$('input.module-search').on('input', function() {
		if($(this).val().length !== 0) {
			$('ul.search-list').css('display', 'none');
		} else {
			$('ul.search-list').css('display', 'block');
		}
	});
	
	// 无缝轮播推荐商品
	let index = 0;
	let $searchList = $('ul.search-list');
	setInterval(function() {// 第一次调用也延时
		index++;
		$searchList.css({ 'transition': 'all .4s', 'top': `-${index}00%` });
		$(`ul.search-list>li:nth-child(${index + 1})`).addClass('active').siblings('.active').removeClass('active');
		setTimeout(function() {
			if(index === 3) {
				index = 0;
				$searchList.css({ 'transition': 'all 0s', 'top': `-${index}00%` });
				$(`ul.search-list>li:nth-child(${index + 1})`).addClass('active').siblings('.active').removeClass('active');
			}
		}, 400);
	}, 4000);
	
}
