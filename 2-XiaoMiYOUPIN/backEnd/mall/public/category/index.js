// 请求一级菜单并渲染
$.ajax({
	type: 'get',
	url: '/category/list/0',
	success: function(res) {
		if(res.code !== 200) {
			console.log(res.msg);
			return;
		}
		let htmlStr = '';
		res.data.forEach(function(item) {
			htmlStr += `
				<li data-id=${item.id} data-avatar=${item.avatar}><span>${item.name}</span></li>
			`;
		});
		$('ul.list-main').html(htmlStr).children(':first').trigger('click');
	}
});

// 请求二级菜单并渲染
$('ul.list-main').on('click', function(e) {
	let $li = e.target.tagName === 'LI' ? $(e.target) : $(e.target).parent();
	$li.addClass('active').siblings('.active').removeClass('active');
	$('img.avatar').attr('src', $li.attr('data-avatar'));
	$.ajax({
		type: 'get',
		url: '/category/list/' + $li.attr('data-id'),
		success: function(res) {
			if(res.code !== 200) {
				console.log(res.msg);
				return;
			}
			$('ul.list-sub').empty();
			let htmlStr = '';
			if(res.data.length) {
				res.data.forEach(function(item) {
					htmlStr += `
						<li data-id=${item.id}>
							<a href="/list/index.html?cid=${item.id}&cName=${item.name}&pid=${$li.attr('data-id')}"><img src="${item.avatar}"><span>${item.name}</span></a>
						</li>
					`;
				});
				$('ul.list-sub').html(htmlStr).show();
				$('p.tip').hide();
			} else {// empty data
				$('p.tip').show();
				$('ul.list-sub').hide();
			}
		}
	});
});
