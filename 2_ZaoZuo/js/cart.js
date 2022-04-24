let goods = [
	{ id: 1, name: '水引地毯', avatar: '../images/cart-1.jpg', color: ['曙蓝','霞粉','影黑','星紫','海绿','黛灰'], colorSelected: 0, type: ['地毯-大', '地毯-小', '地垫'], typeSelected: 0, time: '2021-09-12', count: 1, maxCount: 4, oldPrice: 1599, preferential: 319, price: 1280},
	{ id: 2, name: '光语地毯', avatar: '../images/cart-2.jpg', color: ['黎黄','霞粉','影黑','曙蓝','影灰','阳橙'], colorSelected: 0, type: ['地毯-大', '地毯-小', '地垫'], typeSelected: 0, time: '2021-09-14', count: 1, maxCount: 4, oldPrice: 1599, preferential: 319, price: 1280},
	{ id: 3, name: '布丁坐墩', avatar: '../images/cart-3.jpg', color: ['瓦灰'], colorSelected: 0, type: ['矮款'], typeSelected: 0, time: '2021-09-13', count: 2, maxCount: 6, oldPrice: 599, preferential: 0, price: 599},
	{ id: 4, name: '瓦雀伸缩桌 &copy; 1.2-1.5米', avatar: '../images/cart-4.jpg', color: ['本木色', '米白'], colorSelected: 0, type: [], typeSelected: -1, time: '2021-09-14', count: 1, maxCount: 2, oldPrice: 3999, preferential: 0, price: 3999},
	{ id: 5, name: '美术馆斗柜', avatar: '../images/cart-5.jpg', color: ['脂灰', '灰绿', '阳橙棕'], colorSelected: 0, type: [], typeSelected: -1, time: '2021-10-01', count: 1, maxCount: 1, oldPrice: 3330, preferential: 369, price: 3699},
	{ id: 6, name: '随形桌', avatar: '../images/detail-1-color-1.jpg', color: ['茜红', '米白'], colorSelected: 0, type: [], typeSelected: -1, time: '2021-09-01', count: 1, maxCount: 1, oldPrice: 2999, preferential: 0, price: 2999}
];
window.onload = function() {	
	// 动态渲染主内容区
	{
		let htmlStr = document.querySelector('.content').innerHTML,
			colorHtmlStr = "",
			typeHtmlStr = "";
		goods.forEach(function(item) {
			colorHtmlStr = "";
			for(let i = 0; i < item.color.length; ++i) {
				colorHtmlStr += `
					<span class="${i === 0 ? 'selected' : ''}" data-colorid=${i}>${item.color[i]}</span>
				`;
			}
			typeHtmlStr = "";
			for(let i = 0; i < item.type.length; ++i) {
				typeHtmlStr += `
					<span class="${i === 0 ? 'selected' : ''}" data-typeid=${i}>${item.type[i]}</span>
				`;
			}
			hrefStr = "";
			if(item.name === '美术馆斗柜') {
				hrefStr = '../html/detail_other.html'
			} else if(item.name === '随形桌') {
				hrefStr = '../html/detail.html';
			}
			htmlStr += `
				<div class="content-item" data-id=${item.id}>
					<span class="checkbox"></span>
					<div class="goods-wrapper">
						<a href="${hrefStr}"><img class="avatar" src="${item.avatar}" alt=""></a>
						<div class="goods"><a href=""></a><h6 class="name">${item.name}</h6><span class="type">${item.type.length === 0 ? item.color[item.colorSelected] : item.color[item.colorSelected] + '/' + item.type[item.typeSelected]}</span></div>
					</div>
					<span class="time">预计${item.time}前发货</span>
					<span class="price">￥${item.price * item.count}</span>
					<div class="count-wrapper">
						<span class="decrease ${item.count === 1 ? '' : 'active'}">-</span><span class="count">${item.count}</span><span class="increase  ${item.count === item.maxCount ? '' : 'active'}">+</span>
					</div>
					<div class="option"><span class="update">修改</span><span class="remove">删除</span></div>
					
					<div class="update-module">
						<span class="cancel">×</span>
						<div class="avatar-wrapper"><img src="${item.avatar}" alt=""></div>
						<div class="module-content">
							<h6>￥${item.price}</h6>
							<span class="note">今天下单，将于${item.time}号发货，大件家具会致电确认</span>
							${colorHtmlStr.length === 0 ? '' : '<div class="module-item color"><span class="sub-title">颜色：</span>'+ colorHtmlStr + '</div>'}
							${typeHtmlStr.length === 0 ? '' :' <div class="module-item type"><span class="sub-title">款型：</span>'+ typeHtmlStr + '</div>'}
							<div class="determine">确认修改</div>
						</div>
					</div>
				</div>
			`;
		});
		document.querySelector('.content').innerHTML = htmlStr;
	}
	
	// 数量更改、修改、删除商品事件委托
	{
		let checkBoxHandler = function(target) {
			// 翻转自身checked
			// 在主内容区所有checkbox中寻找所有未被选中的checkbox并保存到unchecked中。控制选中全选按钮与unchecked长度定向绑定
			// 更新bottomBar
			target.classList.toggle('checked');
			let unchecked = document.querySelectorAll('.container span.checkbox:not(.checked)');
			document.querySelector('span.checkbox.all').classList.toggle('checked', unchecked.length === 0);
			updateBottomBar();
		}
		document.querySelector('span.checkbox.all').onclick = function() {
			// 全选按钮点击响应事件
			// 翻转自身checked
			// 将每个主内容区checkbox checked与全选按钮定向绑定
			// 更新bottomBar
			this.classList.toggle('checked');
			let isChecked = this.classList.contains('checked');
			document.querySelectorAll('.container span.checkbox').forEach(function(item) {
				item.checked = isChecked;
				item.classList.toggle('checked', isChecked);
			});
			updateBottomBar();
		}
		let removeHandler = function(target) {
			if(!confirm("确定删除吗？")) return;
			let id = parseInt(target.parentNode.parentNode.dataset.id);
			console.log(goods);
			goods.splice(goods.findIndex(function(item) {
				return item.id === id;
			}), 1);
			console.log(goods);
			document.querySelector('.content').classList.toggle('hidden', goods.length === 0);
			target.parentNode.parentNode.parentNode.removeChild(target.parentNode.parentNode);
			alert('删除成功');
		};
		let beginUpdateHandler = function(target) {
			target.parentNode.parentNode.querySelector('.update-module').classList.add('active');
			checkModulePos(target);
			let id = parseInt(target.parentNode.parentNode.dataset.id);			
			console.log('curgoods\'s id = '+ id);
			let pos = goods.findIndex(function(item) {
				return item.id === id;
			});
			let colorid = goods[pos].colorSelected, typeid = goods[pos].typeSelected;
			// 商品颜色按钮点击修改事件
			target.parentNode.parentNode.querySelectorAll('.module-item.color>span:not(.sub-title)').forEach(function(item) {
				item.onclick = function() {
					if(this.classList.contains('active')) return;
					colorid = parseInt(this.dataset.colorid);
					this.parentNode.querySelector('span.selected').classList.remove('selected');
					this.classList.toggle('selected');
				};
			});
			// 商品种类按钮点击修改事件
			target.parentNode.parentNode.querySelectorAll('.module-item.type>span:not(.sub-title)').forEach(function(item) {
				item.onclick = function() {
					if(this.classList.contains('active')) return;
					typeid = parseInt(this.dataset.typeid);
					this.parentNode.querySelector('span.selected').classList.remove('selected');
					this.classList.toggle('selected');
				};
			});
			// 确认修改
			target.parentNode.parentNode.querySelector('.update-module .determine').onclick = function() {
				console.log('determine update');
				// 若colorid === -1 或 typeid === -1，说明数据中不存在该类选项
				goods[pos].colorSelected = colorid;
				goods[pos].typeSelected = typeid;
				let str = '';
				if(colorid !== -1) {
					str += goods[pos].color[colorid];
				}
				if(typeid !== -1) {
					str += colorid === -1 ? goods[pos].type[typeid] : '/' + goods[pos].type[typeid];
				}
				this.parentNode.parentNode.parentNode.querySelector('span.type').innerText = str;
				this.parentNode.parentNode.classList.remove('active');
			};
		};
		// update弹窗关闭绑定事件
		document.querySelectorAll('.update-module span.cancel').forEach(function(item) {
			item.onclick = function() {
				console.log('cancel update');
				this.parentNode.classList.remove('active');
			}
		});
		let decreaseHandler = function(target) {
			target.parentNode.querySelector('span.increase').classList.add('active');
			let curItem = target.parentNode.parentNode;
			let count = parseInt(target.parentNode.querySelector('span.count').innerText);
			let id = parseInt(curItem.dataset.id);
			let curGoods = goods.find(function(item) {
				return item.id === id;
			});
			if(count === 1) return;
			curGoods.count = count - 1;
			target.classList.toggle('active', curGoods.count > 1);
			curItem.querySelector('span.count').innerText = count - 1;
			curItem.querySelector('span.price').innerText = '￥' + curGoods.count * curGoods.price;
			curItem.querySelector('span.checkbox').classList.add('checked');
			updateBottomBar();
		};
		let increaseHandler = function(target) {
			target.parentNode.querySelector('span.decrease').classList.add('active');
			let curItem = target.parentNode.parentNode;
			let count = parseInt(target.parentNode.querySelector('span.count').innerText);
			let id = parseInt(curItem.dataset.id);
			let curGoods = goods.find(function(item) {
				return item.id === id;
			});
			if(count === curGoods.maxCount) return;
			curGoods.count = count + 1;
			target.classList.toggle('active', curGoods.count < curGoods.maxCount);
			curItem.querySelector('span.count').innerText = count + 1;
			curItem.querySelector('span.price').innerText = '￥' + curGoods.count * curGoods.price;
			curItem.querySelector('span.checkbox').classList.add('checked');
			updateBottomBar();
		};
		
		let updateBottomBar = function() {
			// 更新底部工具栏
			// 获取主内容区checked商品项，利用id找到该项在goods数组中的相应数据分别累加
			let totalCount = 0,
				oldTotalPrice = 0,
				totalPreferential = 0,
				totalPrice = 0;
			let id = 0, curGoods = null;
			let checkedboxes = document.querySelectorAll('.container span.checkbox.checked')
			if(checkedboxes.length !== 0) {
				checkedboxes.forEach(function(item) {
					id = parseInt(item.parentNode.dataset.id);
					curGoods = goods.find(function(item) {
						return item.id === id;
					});
					totalCount += curGoods.count;
					oldTotalPrice += curGoods.oldPrice * curGoods.count;
					totalPreferential += curGoods.preferential * curGoods.count;
					totalPrice += curGoods.price * curGoods.count;
				});
			}
			document.querySelector('span.total-count').innerText = checkedboxes.length === 0 ? '0' : totalCount;
			document.querySelector('span.old-total-price').innerText = checkedboxes.length === 0 ? '0' : oldTotalPrice;
			document.querySelector('span.preferential').innerText = checkedboxes.length === 0 ? '0' : totalPreferential;
			document.querySelector('span.total-price').innerText = checkedboxes.length === 0 ? '0' : totalPrice;
			document.querySelector('span.tips').classList.toggle('active', checkedboxes.length !== 0);
			document.querySelector('.btn-place-order').classList.toggle('active', checkedboxes.length !== 0);
		};
		
		// 事件委托
		document.querySelector('.container').onclick = function(e) {
			if(e.target.classList.contains('checkbox')) {
				checkBoxHandler(e.target);
			} else if(e.target.classList.contains('remove')) {
				removeHandler(e.target);
			} else if(e.target.classList.contains('update')) {
				beginUpdateHandler(e.target);
			} else if(e.target.classList.contains('decrease')) {
				decreaseHandler(e.target);
			} else if(e.target.classList.contains('increase')) {
				increaseHandler(e.target);
			}
		};
			
	}
	
	// 页面跳转
	{
		document.querySelector('.btn-place-order').onclick = function() {
			if(!this.classList.contains('active')) return;
			window.location.href = '../html/order_confirm.html';
		};
	}
};


// 设定修改弹窗位置
function checkModulePos(target) {
	let module = target.parentNode.parentNode.querySelector('.update-module');
	let bottomBarTop = document.querySelector('.bottom-bar').getBoundingClientRect().top;
	let curTop = module.getBoundingClientRect().top;
	if(bottomBarTop - curTop < 200) {
		module.style.bottom = '50%';
		// console.log('down');
	} else {
		module.style.top = '50%';
		// console.log('up');
	}
}
