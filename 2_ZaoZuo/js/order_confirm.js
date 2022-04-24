let addresses = [
	{ id: 1, user: 'zhangsan', receiveName: '张三', receivePhone: '13288889999', receiveRegion: '北京市 市辖区 东城区 东华门街道', receiveDetail: '金苑小区13#3-99', isDefault: true },
	{ id: 2, user: 'zhangsan', receiveName: '张三同学', receivePhone: '13288889999', receiveRegion: '重庆市 市辖区 永川区 中山路街道', receiveDetail: '紫苑小区13#3-99', isDefault: false }
];
window.onload = function() {
	// 地址及地址弹窗
	{
		let id = 0;
		let user = 'zhangsan';
		let form = document.forms['edit-module'];
		let addressModule = document.querySelector('.edit-address-module-wrapper'),
			addressWrapper = document.querySelector('.address-item-wrapper');
		let getHtmlStr = function(item) {
			return `
				<div class="address-item ${item.isDefault ? 'checked' : ''}" data-id=${item.id}>
					<div><span class="name">${item.receiveName}</span><span class="phone">${item.receivePhone}</span></div>
					<p class="region">${item.receiveRegion}</p>
					<p class="detail">${item.receiveDetail}</p>
					<div class="option-bar" data-id=${item.id}">
						<span class="default-wrapper ${item.isDefault ? 'default' : ''}"><span class="is-default">默认</span><span class="btn-default">设为默认</span></span>
						<span><span class="btn-remove">删除</span><span class="btn-update">修改</span></span>
					</div>
				</div>
			`;
		}
			
		// 动态渲染数据：地址+bottomBar
		let htmlStr = '';
		addresses.forEach(function(item) {
			htmlStr += getHtmlStr(item);
		});
		addressWrapper.innerHTML = htmlStr + addressWrapper.innerHTML;
		(function() {
			let address = addresses.find(function(item) {
				return item.user === user && item.isDefault;
			});
			if(address !== undefined) {
				document.querySelector('.bottom-address').innerHTML = `
					<div><span class="name">${address.receiveName}</span><span class="phone">${address.receivePhone}</span><p class="region">${address.receiveRegion}</p></div>
					<p class="detail">${address.receiveDetail}</p>
				`;
			}
		})();
		
		// 增删改
		let removeHandler = function(target) {
			id = parseInt(target.parentNode.parentNode.dataset.id);
			console.log('remove id='+id);
			addresses.splice(addresses.findIndex(function(item) {
				return item.id === id;
			}), 1);
			document.querySelector('.address-item-wrapper').removeChild(target.parentNode.parentNode.parentNode);
			if(addresses.find(function(item) {
				return item.user === user && item.isDefault;
			}) === undefined) {
				let address = {
					receiveName: '',
					receivePhone: '',
					receiveRegion: '',
					receiveDetail: '',
				};
				updateBottomBar(address);
			}
		};
		let beginUpdateHandler = function(target) {
			id = parseInt(target.parentNode.parentNode.dataset.id);
			console.log('begin update id='+id);
			let address = addresses.find(function(item) {
				return item.id === id;
			});
			form['receiveName'].value = address.receiveName;
			form['receivePhone'].value = address.receivePhone;
			regionPicker.set(address.receiveRegion);
			form['receiveDetail'].value = address.receiveDetail;
			addressModule.querySelector('span.btn-default').classList.toggle('checked', address.isDefault);
			addressModule.classList.add('active');
		};
		let beginAddHandler = function() {
			if(addressModule.classList.contains('warning')) {
				addressModule.classList.remove('warning');
			}
			id = 0;
			regionPicker.reset();
			form.reset();
			addressModule.querySelector('span.checkbox').classList.remove('checked');
			addressModule.classList.add('active');
		};
		let defaultHandler = function(target) {
			id = parseInt(target.parentNode.parentNode.dataset.id);
			console.log('default id='+id);
			let oldDefault = addresses.find(function(item) {
				return item.user === user && item.isDefault;
			});
			if(oldDefault !== undefined) {
				oldDefault.isDefault = false;
				addressWrapper.querySelector('span.default-wrapper.default').classList.remove('default');
			}
			addresses.find(function(item) {
				return item.id === id;
			}).isDefault = true;
			target.parentNode.classList.add('default');
		};
		let updateBottomBar = function(address) {
			let bottomBar = document.querySelector('.bottom-bar');
			bottomBar.querySelector('span.name').innerText = address.receiveName;
			bottomBar.querySelector('span.phone').innerText = address.receivePhone;
			bottomBar.querySelector('p.region').innerText = address.receiveRegion;
			bottomBar.querySelector('p.detail').innerText = address.receiveDetail;
		};
		let checkHandler = function(target) {
			id = parseInt(target.dataset.id);
			let address = addresses.find(function(item) {
				return item.id === id;
			});
			if(target.classList.contains('checked')) return;
			let oldChecked = addressWrapper.querySelector('.address-item.checked');
			if(oldChecked !== null) {
				oldChecked.classList.remove('checked');
			}
			updateBottomBar(address);
			target.classList.add('checked');
		};
		
		// 事件委托
		document.querySelector('.address-item-wrapper').onclick = function(e) {
			if(e.target.classList.contains('btn-remove')) {
				removeHandler(e.target);
			} else if(e.target.classList.contains('btn-update')) {
				beginUpdateHandler(e.target);
			} else if(e.target.classList.contains('btn-default')) {
				defaultHandler(e.target);
			} else if(e.target.classList.contains('btn-add')){
				beginAddHandler();
			} else {
				let target = e.target;
				while(!target.classList.contains('address-item')) {
					target = target.parentNode;
				}
				checkHandler(target);
			}
		};
		
		// 弹窗点击事件
		addressModule.querySelector('.btn-save').onclick = function() {
			let address = {
				id: id,
				user: user,
				receiveName: form['receiveName'].value,
				receivePhone: form['receivePhone'].value,
				receiveRegion: regionPicker.get(),
				receiveDetail: form['receiveDetail'].value,
				isDefault: addressModule.querySelector('span.btn-default').classList.contains('checked')
			};
			// 信息不全则警告
			if(address.receiveName === '' || address.receivePhone === '' || address.receiveDetail === '') {
				addressModule.classList.add('warning');
				return;
			}
			console.log('is default:'+address.isDefault);
			// 点击add一定取消原先选中原先的地址卡片
			let oldChecked = addressWrapper.querySelector('.address-item.checked');
			if(oldChecked !== null) {
				oldChecked.classList.remove('checked');
			}
			// 若新增地址为默认地址，则需要将原有默认地址取消
			if(address.isDefault) {
				let oldDefault = addresses.find(function(item) {
					return item.user === user && item.isDefault;
				});
				if(oldDefault !== undefined) {
					oldDefault.isDefault = false;
					addressWrapper.querySelector('span.default-wrapper.default').classList.remove('default');
				}
			}
			if(id === 0) {// add
				address.id = addresses[addresses.length - 1].id + 1;
				addresses.push(address);
				let htmlStr = getHtmlStr(address);
				addressWrapper.innerHTML = htmlStr + addressWrapper.innerHTML;
				addressWrapper.querySelector('.address-item:first-child').classList.add('checked');
			} else {// update
				addresses.splice(addresses.find(function(item) {
					return item.id === id;
				}), 1, address);
				let addressItem = addressWrapper.querySelector(`.address-item[data-id='${id}']`);
				// console.log(addressItem);
				addressItem.querySelector('span.name').innerText = address.receiveName;
				addressItem.querySelector('span.phone').innerText = address.receivePhone;
				addressItem.querySelector('p.region').innerText = address.receiveRegion;
				addressItem.querySelector('p.detail').innerText = address.receiveDetail;
				addressItem.querySelector('span.default-wrapper').classList.toggle('default', address.isDefault);
				addressItem.classList.add('checked');
			}
			updateBottomBar(address);
			addressModule.classList.remove('active');
		};
		addressModule.querySelector('.btn-cancel').onclick = function() {
			addressModule.classList.remove('active');
		};
		// 所有checkbox点击事件
		document.querySelectorAll('span.checkbox').forEach(function(item) {
			item.onclick = function() {
				this.classList.toggle('checked');
			};
		});
	}
	
	// 发票弹窗
	{
		let billModule = document.querySelector('.bill-module-wrapper');
		document.querySelector('span.btn-bill').onclick = function() {
			billModule.classList.add('active');
		};
		billModule.querySelector('span.btn-close').onclick = function() {
			this.parentNode.parentNode.classList.remove('active');
		};
		billModule.querySelector('span.btn-save').onclick = function() {
			document.querySelector('span.btn-bill').classList.add('checked');
			this.parentNode.parentNode.classList.remove('active');
		};
		billModule.querySelectorAll('span.radio').forEach(function(item) {
			item.onclick = function() {
				if(this.classList.contains('checked')) return;
				this.parentNode.parentNode.querySelector('span.radio.checked').classList.remove('checked');
				this.classList.add('checked');
			};
		});
	}

	// 页面跳转
	{
		document.querySelector('.btn-place-order').onclick = function() {
			if(document.querySelector('.address-item.checked') === null) {
				alert('请选择地址');
				return;
			}
			window.location.href = '../html/pay.html';
		};
	}
};