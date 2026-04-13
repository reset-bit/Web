let addresses = [
	{ id: 1, user: 'zhangsan', receiveName: '张三', receivePhone: '13288889999', receiveRegion: '北京市 市辖区 东城区 东华门街道', receiveDetail: '金苑小区13#3-99', isDefault: true },
	{ id: 2, user: 'zhangsan', receiveName: '张三同学', receivePhone: '13288889999', receiveRegion: '重庆市 市辖区 永川区 中山路街道', receiveDetail: '紫苑小区13#3-99', isDefault: false }
];
window.onload = function() {
	// 穿梭动画
	{
		let navs = document.querySelectorAll('.nav-bar>span:not(span:last-child)');
		let shuttle = document.querySelector('span.shuttle');
		shuttle.style.width = navs[5].querySelector('a').getBoundingClientRect().width + 'px';
		shuttle.style.left = navs[5].offsetLeft + 'px';
		
		navs.forEach(function(item) {
			item.onmouseover = function() {
				shuttle.style.width = this.querySelector('a').getBoundingClientRect().width + 'px';
				shuttle.style.left = this.offsetLeft + 'px';
			};
			item.onmouseout = function() {
				shuttle.style.width = navs[5].querySelector('a').getBoundingClientRect().width + 'px';
				shuttle.style.left = navs[5].offsetLeft + 'px';
			};
		});
	}
	
	function getHtmlStr(i, item) {
		return `
			<span class="address-item ${item.isDefault ? 'default' : ''}" data-id=${item.id}>
				<span class="address-info"><span class="index">${i}</span>：<span class="receiveAddress">${item.receiveRegion + ' ' + item.receiveDetail}</span> / 收货人：<span class="receiveName">${item.receiveName}</span> / <span class="receivePhone">${item.receivePhone}</span></span><span class="is-default">默认</span><span class="edit"></span><span class="btn-default">设为默认</span><span class="remove"></span>
			</span>
		`;
	}
	
	// 动态渲染地址数据
	{
		let htmlStr = '';
		for(let i = 0; i < addresses.length; ++i) {
			htmlStr += getHtmlStr(i + 1, addresses[i]);
		}
		document.querySelector('span.address-content').innerHTML = htmlStr;
	}
	
	// 地址增删改
	{
		let addressPop = document.querySelector('.edit-address-pop-wrapper');
		let id = 0;
		let user = 'zhangsan';
		let form = document.forms['edit-pop'];
		
		let removeHandler = function(target) {
			if(!confirm('确定删除吗？')) return;
			id = parseInt(target.parentNode.dataset.id);
			console.log('remove id='+id);
			console.log(addresses);
			addresses.splice(addresses.findIndex(function(item) {
				return item.id === id;
			}), 1);
			console.log(addresses);
			// 更新删除条目下方序号值
			let curIndex = parseInt(target.parentNode.querySelector('.index').innerText);
			let addressItems = target.parentNode.parentNode.querySelectorAll('span.address-item');
			for(let i = curIndex; i < addressItems.length; ++i) {
				addressItems[i].querySelector('span.index').innerText = i;
			}
			target.parentNode.parentNode.removeChild(target.parentNode);
		};
		let beginUpdateHandler = function(target) {
			id = parseInt(target.parentNode.dataset.id);
			console.log('update id='+id);
			document.querySelectorAll('span.pop-type').forEach(function(item) {
				item.innerText = '修改';
			});
			let address = addresses.find(function(item) {
				return item.id === id;
			});
			form['receiveName'].value = address.receiveName;
			form['receivePhone'].value = address.receivePhone;
			regionPicker.set(address.receiveRegion);
			form['receiveDetail'].value = address.receiveDetail;
			addressPop.classList.add('active');
		};
		let defaultHandler = function(target) {
			id = parseInt(target.parentNode.dataset.id);
			console.log('set default id='+id);
			let oldDefault = addresses.find(function(item) {
				return item.user === user && item.isDefault === true;
			})
			if(oldDefault !== undefined) {
				oldDefault.isDefault = false;
			}
			addresses.find(function(item) {
				return item.id === id;
			}).isDefault = true;
			let oldDefaultDom = document.querySelector('span.address-item.default');
			if(oldDefaultDom !== null) {
				oldDefaultDom.classList.remove('default');
			}
			target.parentNode.classList.add('default');
		};
		
		// 删除与修改--事件委托
		document.querySelector('span.address-content').onclick = function(e) {
			if(e.target.classList.contains('remove')) {
				removeHandler(e.target);
			} else if(e.target.classList.contains('edit')) {
				beginUpdateHandler(e.target);
			} else if(e.target.classList.contains('btn-default')) {
				defaultHandler(e.target);
			}
		};
		// 添加
		document.querySelector('.address span.btn-add').onclick = function() {
			id = 0;
			form.reset();
			regionPicker.reset();
			document.querySelectorAll('span.pop-type').forEach(function(item) {
				item.innerText = '添加';
			});
			addressPop.classList.add('active');
		};
		// 弹窗关闭
		addressPop.querySelector('.btn-cancel').onclick = function() {
			addressPop.classList.remove('active');
		};
		// 弹窗确定
		addressPop.querySelector('.btn-save').onclick = function() {
			let address = {
				id: id,
				user: user,
				receiveName: form['receiveName'].value,
				receivePhone: form['receivePhone'].value,
				receiveRegion: regionPicker.get(),
				receiveDetail: form['receiveDetail'].value
			};
			// console.log(address);
			if(id === 0) {// 新增
				if(address.receiveName === '' || address.receivePhone === '' || address.receiveDetail === '') {
					addressPop.classList.add('warning');
					return;
				}
				addressPop.classList.remove('warning');
				address.isDefault = false;
				address.id = addresses.length > 0 ? addresses[addresses.length - 1].id + 1 : 1;
				addresses.push(address);
				let htmlStr = document.querySelector('span.address-content').innerHTML;
				htmlStr += getHtmlStr(document.querySelectorAll('span.address-item').length + 1, address);
				document.querySelector('span.address-content').innerHTML = htmlStr;
			} else {// 修改
				address.isDefault = addresses.find(function(item) {
					return item.id === id;
				}).isDefault;
				addresses.splice(addresses.findIndex(function(item) {
					return item.id === address.id;
				}), 1, address);
				let addressItem = document.querySelector(`span.address-item[data-id='${address.id}']`);
				addressItem.querySelector('.receiveName').innerText = address.receiveName;
				addressItem.querySelector('.receivePhone').innerText = address.receivePhone;
				addressItem.querySelector('.receiveAddress').innerText = address.receiveRegion + address.receiveDetail;
			}
			addressPop.classList.remove('active');
		};
	}

};