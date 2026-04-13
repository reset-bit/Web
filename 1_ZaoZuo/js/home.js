// 页面加载完成调用事件
window.onload = function (){
	// nav-init
	(function() {
		let ulWidth = document.getElementById('nav-main').clientWidth;
		let lisWidth = 0;
		let lisNavMain = document.querySelectorAll('ul.nav-main>li');
		for(let i = 0; i < lisNavMain.length; ++i) {
			lisWidth += lisNavMain[i].clientWidth;
		}
		console.log('ulWidth=' + ulWidth);
		console.log('lisWidth=' + lisWidth);
		let padding = (ulWidth - lisWidth) / (lisNavMain.length - 1) / 2;
		console.log('nav main padding=' + padding);
		for(let i = 0; i < lisNavMain.length; ++i) {
			if(i == 0) {
				lisNavMain[i].style.paddingRight = padding + 'px';
			} else if (i == (lisNavMain.length - 1)) {
				lisNavMain[i].style.paddingLeft = padding + 'px';
			} else {
				lisNavMain[i].style.padding = '0 ' + padding + 'px';
			}
		}
	})();
	
	// 动态渲染设计推荐
	(function() {
		let dataSelectedDesign = [
			{
				avatar: '../images/selected-1.jpg',
				name: '美术馆电视柜',
				price: 2970,
				author: 'Note Design Studio',
				address: 'Sweden | Stockholm',
				intro: '现代的丰饶，空间的画作'
			},
			{
				avatar: '../images/selected-2.jpg',
				name: '美术馆斗柜',
				price: 3330,
				author: 'Note Design Studio',
				address: 'Sweden | Stockholm',
				intro: '现代的丰饶，空间的画作'
			},
			{
				avatar: '../images/selected-3.jpg',
				name: '美术馆茶几',
				price: 2080,
				author: 'Note Design Studio',
				address: 'Sweden | Stockholm',
				intro: '现代的丰饶，空间的画作'
			},
			{
				avatar: '../images/selected-4.jpg',
				name: '美术馆梳妆台',
				price: 3910,
				author: 'Note Design Studio',
				address: 'Sweden | Stockholm',
				intro: '现代的丰饶，空间的画作'
			},
			{
				avatar: '../images/selected-5.jpg',
				name: '美术馆陈列柜',
				price: 4000,
				author: 'Note Design Studio',
				address: 'Sweden | Stockholm',
				intro: '现代的丰饶，空间的画作'
			},
			{
				avatar: '../images/selected-6.jpg',
				name: '燕翎沙发',
				price: 2880,
				author: 'Janas Wagell',
				address: 'Sweden | Stockholm',
				intro: '长翎舒展，给紧凑客厅的优美曲线沙发'
			},
			{
				avatar: '../images/selected-7.jpg',
				name: '匿 枕芯',
				price: 2970,
				author: 'Z-Inhouse',
				address: '中国 | 北京',
				intro: '五个减法，匿入低奢睡眠'
			},
			{
				avatar: '../images/selected-8.jpg',
				name: '光笼',
				price: 810,
				author: 'Note Design Studio',
				address: 'Sweden | Stockholm',
				intro: '双层金属网编，来自斯德哥尔摩的氛围造型大师'
			}
		];
		
		console.log('begin to add dom');
		let divSelectedDesignContent =  document.querySelector('.selected-design-content');
		let innerHTML = '';
		for(let i = 0; i < dataSelectedDesign.length; ++i){
			innerHTML += `
				<div class="content-item">
					<a href="">
						<img data-src="${dataSelectedDesign[i].avatar}">
						<div class="content-hover">
							<div class="content-hover-main">${dataSelectedDesign[i].intro}</div>
							<div class="content-hover-bottom">
								<span>${dataSelectedDesign[i].author}</span>
								<span>${dataSelectedDesign[i].address}</span>
							</div>
						</div>
						<h6>${dataSelectedDesign[i].name}</h6>
					</a>
					<p>￥${dataSelectedDesign[i].price}</p>
				</div>
			`;
		}
		divSelectedDesignContent.innerHTML = innerHTML;
		console.log('end to add dom');
	})();
	
	// 鼠标滑过更改图片
	(function() {
		// header
		var headerShoppingCart = document.getElementById('headerShoppingCart');
		headerShoppingCart.onmouseover = function() {
			headerShoppingCart.setAttribute('src', '../images/shoppingcart-1.png');
		};
		headerShoppingCart.onmouseout = function() {
			headerShoppingCart.setAttribute('src', '../images/shoppingcart-2.png');
		};
		var headerPersonal = document.getElementById('headerPersonal');
		headerPersonal.onmouseover = function() {
			headerPersonal.setAttribute('src', '../images/personal.png');
		};
		headerPersonal.onmouseout = function() {
			headerPersonal.setAttribute('src', '../images/personal-1.png');
		};
		// nav
		var navShoppingCart = document.getElementById('navShoppingCart');
		navShoppingCart.onmouseover = function() {
			navShoppingCart.setAttribute('src', '../images/shoppingcart.png');
		};
		navShoppingCart.onmouseout = function() {
			navShoppingCart.setAttribute('src', '../images/shoppingcart-0.png');
		};
		var navPersonal = document.getElementById('navPersonal');
		navPersonal.onmouseover = function() {
			navPersonal.setAttribute('src', '../images/personal.png');
		};
		navPersonal.onmouseout = function() {
			navPersonal.setAttribute('src', '../images/personal-0.png');
		};		
	})();
	
	// 图片懒加载
	(function() {
		debounce(checkLazyLoad(), 1000);
		let onscrollHandler = window.onscroll;
		window.onscroll = function() {
			if(onscrollHandler !== null) {
				onscrollHandler();
			}
			debounce(checkLazyLoad(), 1000);
		};
	})();

	// 轮播图
	(function() {
		// 每隔固定时间间隔切换图片，切换到最后一张与第一张图片时，进行动画消除与瞬时切换工作。设置开关变量，使得在banner切换过程中点击切换按钮无效
		let timer = null, index = 1, isToggling = false;
		let bannerContent = document.querySelector('.banner-content'),
			length = bannerContent.children.length;// 7
		function bannerToggle(nextIndex) {
			isToggling = true;
			index = (index + 1) % length;
			bannerContent.style.transitionDuration = '.4s';
			bannerContent.style.left = `-${index}00%`;
			// indicator
			let i = index;
			if(i === length - 1) {// 6->1
				i = 1;
			} else if(i === 0) {// 0->5
				i = length - 2;
			}
			// console.log(i - 1);
			document.querySelector('ul.banner-indicator li.active').classList.remove('active');
			document.querySelectorAll('ul.banner-indicator>li')[i - 1].classList.add('active');
			// banner image
			setTimeout(function() {
				index = nextIndex;
				if(nextIndex === length - 1) {// 正向切换
					index = 1;
					bannerContent.style.transitionDuration = '0s';
					bannerContent.style.left = `-${index}00%`;
				} else if(nextIndex === 0) {// 反向切换
					index = length - 2;
					bannerContent.style.transitionDuration = '0s';
					bannerContent.style.left = `-${index}00%`;
				}
				isToggling = false;
			}, 400);
		}
		timer = setInterval(function() {
			bannerToggle(index + 1);
		}, 3000);
		// 鼠标悬停与移开事件
		document.querySelector('.banner-content-wrapper').onmouseover = stopBanner;
		document.querySelector('.banner-content-wrapper').onmouseout = beginBanner;
		document.querySelectorAll('span.banner-btn, ul.banner-indicator>li').forEach(function(item) {
			item.onmouseover = stopBanner;
			item.onmouseout = beginBanner;
		});
		function stopBanner() {
			clearInterval(timer);
			timer = null;
		};
		function beginBanner() {
			timer = setInterval(function() {
				bannerToggle(index + 1);
			}, 3000);
		};
		// 正反向切换banner事件
		document.querySelector('span.btn-prev').onclick = function() { 
			if(isToggling) return;
			bannerToggle(index - 1); 
		};
		document.querySelector('span.btn-next').onclick = function() { 
			if(isToggling) return;
			bannerToggle(index + 1);
		};
		document.querySelectorAll('ul.banner-indicator>li').forEach(function(item, i) {
			item.index = i + 1;
			item.onclick = function() {
				if(this.classList.contains('active') || isToggling) return;
				bannerToggle(this.index);
			};
		});
	})();
	
	// 动态渲染导航菜单数据+鼠标滑过显示菜单背板（事件委托）
	(function() {
		let subMenuData = [
			{ id: 0, name: "全屋系列", sub: ["全部", "美术馆系列", "飞鸟·流方套系", "画板系列", "山雪系列", "cosmo系列", "海盐硬糖系列"]},
			{ id: 1, name: "沙发·椅凳", sub: ["全部", "沙发", "休闲椅", "椅凳", "坐墩"]},
			{ id: 2, name: "柜架", sub: ["全部", "电视柜", "书柜·书架", "衣柜", "餐边柜", "斗柜", "鞋柜", "玄关柜", "床头柜", "床头柜", "置物架·储物格", "衣帽架"]},
			{ id: 3, name: "桌几", sub: ["全部", "餐桌·书桌", "茶几", "边桌", "梳妆台"]},
			{ id: 4, name: "床·床具", sub: ["全部", "床", "床垫", "床头柜", "床尾凳", "床品", "被褥", "枕芯"]},
			{ id: 5, name: "灯具", sub: ["全部", "地灯", "吊灯", "台灯", "夜灯"]},
			{ id: 6, name: "家纺·床品", sub: ["全部", "床品", "被褥", "枕芯", "毛巾·浴巾", "盖毯", "地毯·地垫", "抱枕·颈枕"]},
			{ id: 7, name: "装饰·收纳", sub: ["全部", "墙镜", "花瓶", "摆件", "收纳", "装饰画"]},
			{ id: 8, name: "餐具·水具", sub: ["全部", "餐具", "托盘·果盘", "食品储物"]}
		];
		let headerMenu = document.querySelector('ul.header-menu-left'),
			navMenu = document.querySelector('ul.nav-main'),
			headerMainLis = headerMenu.children,
			navMainLis = navMenu.children,
			subMenuBgs = document.querySelectorAll('.sub-bg'),
			htmlStr = "",
			subMenu = null,
			curTarget = null,
			threshold = 2,//前两个li不需要显示二级菜单背板
			id = 0;
		
		// 动态渲染二级菜单数据
		// 使用.children得到的是集合，无法使用forEach()
		for(let i = 0; i < headerMainLis.length; ++i) {
			bindData(headerMainLis[i]);
		}
		for(let i = 0; i < navMainLis.length; ++i) {
			bindData(navMainLis[i]);
		}
		// li事件委托：找到当前target元素，如果是a/span就逐级递进向上寻找parentNode，直到找到li。判断li id，满足指定条件则显示二级菜单背景板
		headerMenu.onmouseover = function(e) {
			mouseHandler(e, 0, 1);
		};
		headerMenu.onmouseout = function(e) {
			mouseHandler(e, 0, 0);
		};
		navMenu.onmouseover = function(e) {
			mouseHandler(e, 1, 1);
		};
		navMenu.onmouseout = function(e) {
			mouseHandler(e, 1, 0);
		};
		
		/**
		 * @param {dom} item 需要绑定数据的li元素
		 */
		function bindData(item) {
			id = item.dataset.id - 2;
			if(id < 0) return;
			htmlStr = "";
			for(let i = 0; i < subMenuData[id].sub.length; ++i){
				htmlStr += `
					<li><a href="">${subMenuData[id].sub[i]}</a></li>
				`;
			}
			subMenu = item.querySelector('ul.sub-menu');
			if(subMenu !== null) {
				subMenu.innerHTML = htmlStr;
			}
		}
		/**
		 * @param {event} e 鼠标滑过/划出事件
		 * @param {number} bgPos 需要控制的背板下标
		 * @param {number} opacity 目标背板透明度
		 */
		function mouseHandler(e, bgPos, opacity) {
			let curTarget = e.target;
			while(curTarget.nodeName !== null && curTarget.nodeName !== 'LI') {
				curTarget = curTarget.parentNode;
			}	
			id = parseInt(curTarget.dataset.id) - threshold;
			if(id < 0) return;
			subMenuBgs[bgPos].style.opacity = opacity;
		}
	})();
	
	// 动态切换导航栏
	(function() {
		let top = document.documentElement.scrollTop || window.scrollYOffset || document.body.scrollTop,
			threshold = 200,
			aimMenu = document.querySelector('.header-menu-wrapper');
		let onscrollHandler = window.onscroll;
		window.onscroll = function() {
			if(onscrollHandler !== null) {
				onscrollHandler();
			}
			top = document.documentElement.scrollTop || window.scrollYOffset || document.body.scrollTop;
			if(top >= threshold) {
				aimMenu.classList.add('fixed');
				setTimeout(function() {
					aimMenu.querySelector('.header-menu-left-wrapper>img').style.display = 'inline-block';
					aimMenu.querySelector('ul.header-menu-left').style.display = 'inline-block';
					aimMenu.querySelector('ul.header-menu-right').style.display = 'inline-block';
				}, 100);
			} else{
				aimMenu.querySelector('.header-menu-left-wrapper>img').style.display = 'none';
				aimMenu.querySelector('ul.header-menu-left').style.display = 'none';
				aimMenu.querySelector('ul.header-menu-right').style.display = 'none';
				aimMenu.classList.remove('fixed');
			}
		};
	})();
	
	// 页面跳转、未登录状态隐藏元素
	(function() {
		document.getElementById('navShoppingCart').onclick = function() {
			window.location.href = '../html/cart.html';
		};
		document.getElementById('navPersonal').onclick = function() {
			window.location.href = '../html/proflie.html';
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
	})();
};

// 懒加载
function checkLazyLoad() {
	var images = document.querySelectorAll('img'),
		clientHeight = document.documentElement.clientHeight;
	for(let i = 0; i < images.length; ++i) {
		// 判断当前img到可视区顶部的距离 是否小于 可视区域的高度 + 图片是否已加载
		if(images[i].getBoundingClientRect().top <= clientHeight  && images[i].src !== null) {
			images[i].src = images[i].dataset.src;
		}
	}
}

// banner高度自适应
(function() {
	let timer = null;
	window.onresize = function() {
		// 若此时timer不为空，证明此时banner在调整大小中。应立即结束原先timer以替换旧的目标高度值
		if(timer !== null) {
			clearInterval(timer);
			timer = null;
		}
		let aimHeight = document.body.clientWidth / 1350 * 450,
			bannerContentWrapper = document.querySelector('.banner-content-wrapper'),
			diff = 0;
		// console.log('aimHeight='+aimHeight);
		timer = setInterval(function() {
			diff = aimHeight - bannerContentWrapper.clientHeight;
			if(diff < 4) {
				clearInterval(timer);
				timer = null;
				bannerContentWrapper.style.height = aimHeight;
			}
			bannerContentWrapper.style.height = (bannerContentWrapper.clientHeight + diff) + 'px';
		}, 500);
	}
})();
