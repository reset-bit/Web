// 动态渲染
function getHtmlStr(item) {
	return  `
		<li data-id=${item.id} class="${item.isDefault ? 'default' : ''}">
			<p>
				<span class="receive-name">${item.receiveName}</span><span class="receive-phone">${item.receivePhone}</span>
			</p>
			<p>
				<span class="is-default">默认</span><span class="receive-region">${item.receiveRegion}</span> <span class="receive-detail">${item.receiveDetail}</span>
			</p>
			<i class="iconfont icon-edit"></i>
		</li>
	`;
}
{
	$.ajax({
		type: 'get',
		headers: {Authorization:Cookies.get('token')},
		url: '/address/list',
		success: function(res) {
			if(res.code !== 200) {
				console.log(res.msg);
				return;
			}
			// console.log(res);
			let htmlStr = '';
			res.data.forEach(function(item) {
				htmlStr += getHtmlStr(item);
			});
			$(htmlStr).appendTo('ul.list');
		}
	});
}


{
	let id = 0;
	// 新增
	$('.btn-add').on('click', function() {
		id = 0;
		$('form')[0].reset();
		$('span.module-title').text('新增地址');
		$('.layui-form-switch').removeClass('layui-form-onswitch');
		$('span.btn-remove').css('display', 'none');
		$('.edit-module').addClass('active');
	});
	// 修改
	$('ul.list').on('click', 'i.icon-edit', function() {
		let that = this;
		$.ajax({
			type: 'get',
			headers: {Authorization: Cookies.get('token')},
			url: '/address/model/' + $(that).parent().attr('data-id'),
			success: function(res) {
				if(res.code !== 200) {
					console.log(res.msg);
					return;
				}
				// console.log(res);
				$('input.receive-name').val(res.data.receiveName);
				$('input.receive-phone').val(res.data.receivePhone);
				$('input.receive-region').val(res.data.receiveRegion);
				$('input.receive-detail').val(res.data.receiveDetail);
				if(res.data.isDefault === 1) {
					$('.layui-form-switch').addClass('layui-form-onswitch');
				} else {
					$('.layui-form-switch').removeClass('layui-form-onswitch');
				}
				id = $(that).closest('li').attr('data-id');
				$('span.module-title').text('编辑地址');
				$('span.btn-remove').css('display', 'inline-block');
				$('.edit-module').addClass('active');
			}
		});
	});
	// 删除
	$('span.btn-remove').on('click', function() {
		console.log(id);
		$.ajax({
			type: 'get',
			headers: {Authorization: Cookies.get('token')},
			url: '/address/remove/' + id,
			success: function(res) {
				if(res.code !== 200) {
					console.log(res.msg);
					return;
				}
			}
		});
		$(`ul.list>li[data-id=${id}]`).remove();
		layer.msg('操作成功', {time: 1000});
		setTimeout(function() {
			$('.edit-module').removeClass('active');
		}, 1000);
	});
	// 默认地址
	let isDefault = false;
	layui.use('form', function() {
		var form = layui.form;
		form.on('switch', function(data) {
			isDefault = data.elem.checked;
		});
	});
	
	$('.module-header>i.icon-back').on('click', function() {
		$('.edit-module').removeClass('active');
	});
	$('.btn-save').on('click', function() {
		let receiveName = $('input.receive-name').val().trim();
		let receivePhone = $('input.receive-phone').val().trim();
		let receiveRegion = $('input.receive-region').val().trim();
		let receiveDetail = $('input.receive-detail').val().trim();
		if(id === 0) {// 新增
			if(receiveName.length === 0 || receivePhone === 0 || receiveRegion === 0 || receiveDetail === 0) {
				layer.msg('输入不能为空，请检查');
				return;
			} else if(!/1[3-9]\d{9}/.test(receivePhone)) {
				layer.msg('电话号码不合法');
				return;
			} else {
				$.ajax({
					type: 'post',
					headers: {Authorization:Cookies.get('token')},
					url: '/address/add',
					data: {receiveName, receivePhone, receiveRegion, receiveDetail},
					success: function(res) {
						if(res.code !== 200) {
							console.log(res.code);
							return;
						}
						let id = res.data;
						let address = {id,receiveName,receivePhone,receiveRegion,receiveDetail};
						$(getHtmlStr(address)).appendTo('ul.list');
					}
				});
				layer.msg('新增成功', {time:1000});
			}
		} else {// 修改（不包括默认地址）
			$.ajax({
				type: 'post',
				headers: {Authorization: Cookies.get('token')},
				url: '/address/update',
				data: {id,receiveName, receivePhone, receiveRegion, receiveDetail},
				success: function(res) {
					if(res.code !== 200) {
						console.log(res.msg);
						return;
					}
				}
			});
			let address = {
				id: id,
				receiveName: receiveName,
				receivePhone: receivePhone,
				receiveRegion: receiveRegion,
				receiveDetail: receiveDetail
			}
			$(`ul.list>li[data-id=${id}]`).replaceWith(getHtmlStr(address));
			layer.msg('修改成功', {time:1000});
		}
		if(isDefault) {// 修改默认地址
			$.ajax({
				type: 'get',
				headers: {Authorization: Cookies.get('token')},
				url: '/address/get_default',
				success: function(res) {
					if(res.code !== 200) {
						console.log(res.msg);
						return;
					}
					// console.log(res);
					$(`ul.list>li[data-id=${res.data.id}]`).removeClass('default');
				}
			});
			$.ajax({
				type: 'get',
				headers: {Authorization: Cookies.get('token')},
				url: '/address/set_default/' + id,
				success: function(res) {
					if(res.code !== 200) {
						console.log(res.msg);
						return;
					}
					$(`ul.list>li[data-id=${id}]`).addClass('default');
				}
			});
			layer.msg('修改成功', {time:1000});
		} 
		setTimeout(function() {
			$('.edit-module').removeClass('active');
		}, 1000);
	});
	
}
