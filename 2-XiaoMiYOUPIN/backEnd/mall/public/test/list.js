(function() {
	// 可能从别的地方直接跳转到list
	var cid = parseInt($.query.get('cid')) || 17;// NaN || 17
	var cName = $.query.get('cName') || '电视机';// 由上一个页面传递的字符串
	
	var name = '';// 搜索框字符串
	var orderCol = 'price';// 排序方案：rate|price|sale
	var orderDir = 'asc';// 排序方向：asc升序|desc降序
	var pageSize = 6;// 每页显示数据量
	
	var isLoading = false;// 也可使用节流throttle
	var hasMore = true;// 按当前条件筛选，是否有更多数据。用以控制显示加载更多/提示信息
	var scroll = null;// 保存new IScroll产生的对象
	var isTriggerLoadMore = false;
	
	
	function updateTip() {
		if(isLoading) {
			$('p.tip').text('加载中..');
		} else if(isTriggerLoadMore) {
			$('p.tip').text('松手加载更多');
		}else if(hasMore) {
			$('p.tip').text('上拉加载更多');
		} else if($('ul.list li').length === 0) {// 公用页面，对没有数据的分类
			$('p.tip').text('暂无相关商品，敬请期待');
		} else {
			$('p.tip').text('没有更多商品了');
		}
	}
	
	function initOrRefreshScroll() {
		// iscroll需要在图片节点加载完成之后
		new imagesLoaded($('.content')[0], function() {// jQuery对象转为原生js对象
			if(scroll === null) {
				// 需要保证内容高度一定大于盒子高度
				scroll = new IScroll($('.content')[0], {
					deceleration: 0.002,// 设置阻尼系数
					bounce: false,// 关闭边界回弹
					probeType: 2,// 开启滚动监听
					click: true
				});
				scroll.on('scroll', function() {
					// console.log("正在滚动");
					if(isLoading || !hasMore) return;
					isTriggerLoadMore = scroll.y - scroll.maxScrollY === 0;// 到达最底部
					updateTip();
				});
				scroll.on('scrollEnd', function() {
					// console.log("滚动结束");
					if(isTriggerLoadMore) {
						getData(true);
						isTriggerLoadMore = false;
					}
				})
			} else {
				scroll.refresh();// 更新滚动区域，加载更多之后可滑动范围将改变
			}
		});
	}
	
	/**
	 * 请求ajax:
	 * 页面初始化
	 * orderCol变化；orderDir变化
	 * 上拉加载更多 isLoadMore=true
	 * 点击搜索按钮
	 */
	function getData(isLoadMore = false) {
		isLoading = true;
		updateTip();
		if(!isLoadMore) $('ul.list').empty();
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
				hasMore = res.data.length === pageSize;
				setTimeout(function() {
					var htmlStr = '';
					res.data.forEach(function(item) {
						htmlStr += `
							<li>
								<a href="detail.html?pid=${item.id}">
									<img src="${item.avatar}"/>
									<div class="detail">
										<h6>${item.name}</h6>
										<p>${item.brief}</p>
										<div class="price-wrapper">
											￥<span class="price">${item.price}</span>
										</div>
										<div class="other-wrapper">
											好评：<span class="rate">${item.rate}</span>
											销量：<span class="sale">${item.sale}</span>
										</div>
									</div>
								</a>
							</li>
						`;
					});
					$(htmlStr).appendTo('ul.list');
					initOrRefreshScroll();
					isLoading = false;
					updateTip();
				}, 500);
			}
		});
	}
	getData();// 页面初始化
	
	// 排序切换
	$('.order-wrapper').on('click', 'span', function(e) {
		if(isLoading) {
			layer.msg('您的操作太频繁，请稍后再试', { time: 1000 });
			return;
		}
		if($(this).hasClass('active')) {// 切换排序方向
			orderDir = orderDir === 'asc' ? 'desc' : 'asc';
			$(e.delegateTerget).children().toggleClass('asc desc');// 多对象多类名切换
		} else {// 切换排序方式
			orderCol = $(this).attr('data-col');
			$(this).addClass('active').siblings('.active').removeClass('active');
		}
		scroll && scroll.scrollTo(0,0,0);// 切换排序时需要复位，如果不为空就重置
		getData();
	});
})();

