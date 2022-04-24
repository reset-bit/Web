window.onload = function() {
	// header
	{
		console.log('header init');
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
			subMenuBg = document.querySelector('.sub-bg');
		let htmlStr = "",
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
		
		headerMainLis[5].classList.add('active');
		headerMainLis[5].querySelector('ul.sub-menu').classList.add('active');
		subMenuBg.classList.add('active');
		headerMenu.onmouseover = function(e) {
			headerMainLis[5].querySelector('ul.sub-menu').classList.remove('active');
			subMenuBg.classList.add('active');
			curTarget = e.target;
			while(curTarget.nodeName !== null && curTarget.nodeName !== 'LI') {
				curTarget = curTarget.parentNode;
			}	
			id = parseInt(curTarget.dataset.id) - threshold;
			if(id < 0) {
				subMenuBg.classList.remove('active');
			}
		};
		headerMenu.onmouseout = function(e) {		
			headerMainLis[5].classList.add('active');
			headerMainLis[5].querySelector('ul.sub-menu').classList.add('active');
			subMenuBg.classList.add('active');
		};
	}
	
	let data = [
		{ id: 1, avatar: '../images/list-1.jpg', name: '随形桌&reg;', price: 2999, note: '限时优惠;2色可选;官方独家' },
		{ id: 2, avatar: '../images/list-2.jpg', name: '瓦雀长桌&reg; 1.2/1.6/1.9米', price: 3299, note: ';3色可选;' },
		{ id: 3, avatar: '../images/list-3.jpg', name: '美术馆餐桌 1.6米', price: 4999, note: ';2色可选;' },
		{ id: 4, avatar: '../images/list-4.jpg', name: '山雪伸缩桌 1.4-1.8米', price: 2599, note: '' },
		{ id: 5, avatar: '../images/list-5.jpg', name: '画板餐桌&reg;-长桌 1.6米', price: 2999, note: '' },
		{ id: 6, avatar: '../images/list-6.jpg', name: '飞鸟实木长桌 1.8米', price: 6999, note: ';;官方独家' }
	];
	let getHtmlStr = function(item) {
		let htmlStr = '', noteTemp = [], noteStr = '';
		if(item.note.length > 0){
			noteStr = '';
			noteTemp = item.note.split(';');
			noteStr += noteTemp[0].length === 0 ? '' : '<span class="preferential-mark">' + noteTemp[0] + '</span>';
			noteStr += noteTemp[1].length === 0 ? '' : '<span class="color-mark">' + noteTemp[1] + '</span>';
			noteStr += noteTemp[2].length === 0 ? '' : '<span class="exclusive-mark">' + noteTemp[2] + '</span>';
		}
		
		htmlStr += `
			<dd>
				<a href="${item.id === 1 ? 'detail.html' : ''}" data-id=${item.id}>
					<img src="${item.avatar}">
					<h6>${item.name}</h6>
					<span>￥${item.price}</span>
					<div class="marks">
					${noteTemp.length === 0 ? '' : noteStr}
					</div>
				</a>
			</dd>
		`;
		return htmlStr;
	}
	
	// 页面初始化时动态渲染数据
	{
		let content = document.querySelector('dl.content');
		let htmlStr = '';
		data.forEach(function(item) {
			htmlStr += getHtmlStr(item);
		});
		content.innerHTML = htmlStr;
		
		// 排序
		let dataSort = function(type) {
			if(type === 'default') {// 按照id排序
				data.sort(sortById);
			} else if(type === 'price') {// 按照价格排序
				data.sort(sortByPrice);
			}
			// console.log(data);
			htmlStr = '';
			data.forEach(function(item) {
				htmlStr += getHtmlStr(item);
			});
			content.innerHTML = htmlStr;
		};
		document.querySelectorAll('.btn-sort').forEach(function(item) {
			item.onclick = function() {
				if(this.classList.contains('active')) return;
				this.parentNode.querySelector('.btn-sort.active').classList.remove('active');
				this.classList.add('active');
				dataSort(item.dataset.type);
			};
		});
		// 按照id升序排序
		var sortById = function(item1, item2) {
			return item1.id - item2.id;
		}
		// 按照价格降序排序
		var sortByPrice = function(item1, item2) {
			return item2.price - item1.price;
		}
	}
	
	// 页面跳转、未登录状态隐藏元素
	{
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
