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
	let headerMainLis = document.querySelectorAll('.header-menu-left>li'),
		headerMenu = document.querySelector('ul.header-menu-left'),
		subMenuBgs = document.querySelectorAll('.sub-bg'),
		htmlStr = "",
		subMenu = null,
		curTarget = null,
		threshold = 2,//前两个li不需要显示二级菜单背板
		id = 0;
		
	// 动态渲染二级菜单数据
	headerMainLis.forEach(function(item) {
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
	});
	
	// li事件委托：找到当前target元素，如果是a/span就逐级递进向上寻找parentNode，直到找到li。判断li id，满足指定条件则显示二级菜单背景板
	headerMenu.onmouseover = function(e) {
		// e.fromElement;标记从哪个元素移入的
		curTarget = e.target;
		while(curTarget.nodeName !== null && curTarget.nodeName !== 'LI') {
			curTarget = curTarget.parentNode;
		}	
		id = parseInt(curTarget.dataset.id) - threshold;
		if(id < 0) return;
		subMenuBgs[0].classList.add('active');
	};
	headerMenu.onmouseout = function(e) {
		curTarget = e.target;
		while(curTarget.nodeName !== null && curTarget.nodeName !== 'LI') {
			curTarget = curTarget.parentNode;
		}
		id = parseInt(curTarget.dataset.id) - threshold;
		if(id < 0) return;
		subMenuBgs[0].classList.remove('active');
	};
	
	// 退出登录
	let exits = document.querySelectorAll('a.btn-exit');
	if(exits.length !== 0) {
		exits.forEach(function(item) {
			item.onclick = function() {
				Cookies.remove('user');
				window.location.href = '../html/login.html';
			};
		});
	}
})();

