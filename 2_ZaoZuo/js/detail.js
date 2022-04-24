window.onload = function() {
	// 放大镜
	{
		let ratio = 2, minRatio = 1, maxRatio = 6;
		let zoomContainer = document.querySelector('.zoom-container'),
			zoomMask = document.querySelector('.zoom-mask'),
			zoom = document.querySelector('.zoom'),
			zoomBig = document.querySelector('.zoom-big'),
			avatar = document.querySelector('img.avatar');
		let zoomW = 0, zoomH = 0,
			zoomContainerW = avatar.width,
			zoomContainerH = avatar.height,
			zoomBorderW = zoom.style.borderWidth;
		let changeRatio = function(ratio) {
			zoomBig.style.backgroundSize = `${avatar.width * ratio}px ${avatar.height * ratio}px`;
			zoom.style.width = avatar.width / ratio + 'px';
			zoom.style.height = avatar.height / ratio + 'px';
			zoomW = avatar.width / ratio;
			zoomH = avatar.height / ratio;
		};
		let zoomInit = function () {
			console.log('zoom init');
			zoomContainer.style.width = avatar.width + 'px';
			zoomContainer.style.height = avatar.height + 'px';
			zoomBig.style.backgroundImage = `url(${avatar.src})`;		
			zoom.style.backgroundImage = `url(${avatar.src})`;
			zoom.style.backgroundSize = `${avatar.width}px ${avatar.height}px`;
			changeRatio(ratio);
		};
	
		zoomInit();
		document.querySelector('img.avatar').onload = zoomInit;
	
		let left = 0, top = 0, maxLeft = 0, maxTop = 0;
		let mouseHandler = function (e) {
			left = e.offsetX - zoomW / 2;
			top = e.offsetY - zoomH / 2;
			left = left < 0 ? 0 : left;
			top = top < 0 ? 0 : top;
			maxLeft = zoomContainerW - zoomW;
			maxTop = zoomContainerH - zoomH;
			left = left > maxLeft ? maxLeft : left;
			top = top > maxTop ? maxTop : top;
			zoom.style.left =  (left - zoomBorderW) + 'px';
			zoom.style.top = (top - zoomBorderW) + 'px';
			zoom.style.backgroundPosition = `-${left}px -${top}px`;
			zoomBig.style.backgroundPosition = `-${left * ratio}px -${top * ratio}px`;
		};
		zoomMask.onmousemove = function(e) {
			mouseHandler(e);
		};
		zoomMask.onmousewheel = function(e) {
			ratio += e.wheelDelta / 1000;
			ratio = ratio < minRatio ? minRatio : ratio;
			ratio = ratio > maxRatio ? maxRatio : ratio;
			changeRatio(ratio);
			mouseHandler(e);
			return false;
		};
	}
	
	// 动态切换菜单
	{
		let threshold = 400,// 切换菜单临界值
			top = document.documentElement.scrollTop || window.scrollYOffset || document.body.scrollTop,
			timer = null;
		let headerMenu = document.querySelector('.header-menu-wrapper'),
			navMenu = document.querySelector('.nav-menu-wrapper'),
			designerDiv = document.querySelector('.designer'),
			detailDiv = document.querySelector('.detail'),
			combinationDiv = document.querySelector('.combination'),
			orderShareDiv = document.querySelector('.order-share'),
			navSpans = document.querySelectorAll('.nav-menu-left>span');
		let temp = -200;// 在滑动到目标版块之前点亮相应nav标题
		let topData = [];
		topData[0] = top + designerDiv.getBoundingClientRect().top + temp;
		topData[1] = top + detailDiv.getBoundingClientRect().top + temp;
		topData[2] = top + combinationDiv.getBoundingClientRect().top + temp;
		topData[3] = top + orderShareDiv.getBoundingClientRect().top + temp;
		// console.log(topData);
		
		// 初始化切换菜单
		if(top > threshold) {
			headerMenu.classList.remove('fixed');
			navMenu.classList.add('active');
		} else {
			headerMenu.classList.add('fixed');
			navMenu.classList.remove('active');
		}
		// 滚动过程中切换菜单
		let onscrollHandler = window.onscroll;
		window.onscroll = function() {
			if(onscrollHandler !== null) {
				onscrollHandler();
			}
			if(timer !== null) return;
			top = document.documentElement.scrollTop || window.scrollYOffset || document.body.scrollTop;
			// console.log(top);
			if(top >= threshold) {
				headerMenu.classList.remove('fixed');
				navMenu.classList.add('active');
			} else {
				headerMenu.classList.add('fixed');
				navMenu.classList.remove('active');
			}
			// 点亮导航栏相应标题
			navSpans.forEach(function(item) {
				item.classList.remove('active');
			});
			if(top < topData[1]) {
				navSpans[0].classList.add('active');
			} else if(top < topData[2]) {
				navSpans[1].classList.add('active');
			} else if(top < topData[3]) {
				navSpans[2].classList.add('active');
			} else {
				navSpans[3].classList.add('active');
			}
		};
		
		// 页面内导航跳转
		document.onmousewheel = function() {
			if(timer !== null) {
				clearInterval(timer);
				timer = null;
			}
		};
		for(let i = 0; i < navSpans.length; ++i) {
			navSpans[i].index = i;
			navSpans[i].onclick = function() {
				if(this.classList.contains('active')) return;
				if(timer !== null) {
					clearInterval(timer);
					timer = null;
				}
				navSpans.forEach(function(item) {
					item.classList.remove('active');
				});
				this.classList.add('active');
				let target = topData[this.index];
				timer = setInterval(function() {
					top = document.documentElement.scrollTop || window.scrollYOffset || document.body.scrollTop;
					if(Math.abs(top - target) < 2) {
						window.scrollTo(0, target);
						clearInterval(timer);
						timer = null;
					}
					let distance = top - target;
					window.scrollTo(0, top - distance * 0.2);
				}, 10);
			};
		}
	}	
	
	// 商品颜色切换
	{
		document.querySelectorAll('span.color').forEach(function(item) {
			item.onclick = function() {
				this.parentNode.querySelector('span.color.active').classList.remove('active');
				this.classList.add('active');
				document.querySelector('.avatar').src = '../images/detail-1-color-' + this.dataset.id + '.jpg';
			};
		});
	}
	
	// 商品数量加减
	{
		let countSpan = document.querySelector('span.count');
		let count = parseInt(countSpan.innerText);
		document.querySelector('span.decrease').onclick = function() {
			if(count === 1) return;
			countSpan.innerText = --count;
		};
		document.querySelector('span.increase').onclick = function() {
			countSpan.innerText = ++count;
		};
	}
	
	// 视频模态框
	{
		document.querySelector('span.video').onclick = function() {
			document.querySelector('.hidden-video').classList.add('active');
			document.querySelector('video').src = '../images/xiaomai.mp4';
		};
		document.querySelector('span.close').onclick = function() {
			document.querySelector('.hidden-video').classList.remove('active');
			document.querySelector('video').pause();
		};
	}
	
	// 动态渲染背景图片
	{
		let dts = document.querySelectorAll('.dl-container dt');
		for(let i = 0; i < dts.length; ++i) {
			dts[i].style.backgroundImage = 'url(../images/detail-1-' + (i + 4) + '.jpg)';
		}
		let dtsShort = document.querySelectorAll('.content-item.short dt');
		let images = [
			'url(../images/detail-1-3.jpg)',
			'url(../images/banner-4.png)',
			'url(../images/detail-1-21.jpg)',
			'url(../images/detail-1-20.jpg)',
		];
		for(let i = 0; i < dtsShort.length; ++i) {
			dtsShort[i].style.backgroundImage = images[i];
		}
	}
	
	// 折叠与展开内容
	{
		let targetTop = [], curTop = 0, timer = null;
		// 使用数组targetTop，利用下标保存、获取对应折叠内容的初始top值，每次收起返回到指定的top值
		document.querySelectorAll('.unfold-wrapper').forEach(function(item, i) {
			targetTop[i] = (document.documentElement.scrollTop || window.scrollYOffset || document.body.scrollTop) + item.getBoundingClientRect().top - 400;
		});
		// console.log(targetTop);
		// 展开按钮
		document.querySelectorAll('.btn-unfold').forEach(function(item) {
			item.onclick = function() {
				this.classList.toggle('active');// 自身
				this.parentNode.parentNode.nextElementSibling.classList.toggle('active');// 内容
			};
		});
		// 折叠按钮
		document.querySelectorAll('span.btn-fold').forEach(function(item, i) {
			item.onclick = function() {
				this.parentNode.previousElementSibling.querySelector('.btn-unfold').classList.remove('active');// 展开按钮
				this.parentNode.classList.remove('active');// 内容
				let target = targetTop[i];
				timer = setInterval(function() {
					curTop = document.documentElement.scrollTop || window.scrollYOffset || document.body.scrollTop;
					if(Math.abs(curTop - target) < 2) {
						clearInterval(timer);
						timer = null;
						window.scrollTo(0, target);
					}
					let distance = curTop - target;
					window.scrollTo(0, curTop - distance * 0.2);
				}, 20);
			};
		});
	}
	
	// 动态渲染推荐优惠组合+号
	{
		document.querySelectorAll('.combination .left').forEach(function(item) {
			let list = item.querySelectorAll('a');
			for(let i = 1; i <= list.length; ++i) {
				if(i % 4 !== 0 && i !== list.length) {
					list[i - 1].classList.add('needAdd');
				}
			}
		});
	}
	
	// 晒单选项卡
	{
		let indicators = document.querySelectorAll('.order-share .indicator');
		for(let i = 0; i < indicators.length; ++i) {
			indicators[i].index = i;
			indicators[i].onclick = function() {
				// console.log('order share toggle');
				this.parentNode.querySelector('.indicator.active').classList.remove('active');
				this.parentNode.parentNode.querySelector('.order-share-item.active').classList.remove('active');
				this.classList.add('active');
				this.parentNode.parentNode.querySelectorAll('.order-share-item')[parseInt(this.index)].classList.add('active');
			};
		}
	}
	
	// 页面跳转、未登录状态隐藏元素
	{
		document.querySelector('.btn-buy').onclick = function() {
			window.location.href = '../html/order_confirm.html';
		};
		let personalSubMenus = document.querySelectorAll('.personal-sub-menu');
		if(Cookies.get('user') === undefined) {
			personalSubMenus.forEach(function(item) {
				item.querySelector('a:last-child').style.display = 'none';
			});
		} else {
			personalSubMenus.forEach(function(item) {
				item.querySelector('a:last-child').style.display = 'block';
			});
		}
	}
};