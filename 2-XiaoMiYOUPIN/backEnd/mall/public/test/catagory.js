$.ajax({
	type: 'get',
	url: 'http://localhost:3000/category/list/0',
	success: function(res) {
		if(res.code !== 200) {
			console.log(res.msg);
			return;
		}
		var htmlStr = '';
		res.data.forEach(function(item) {
			htmlStr += `
				<li data-id=${item.id} data-avatar="${item.avatar}"><span>${item.name}</span></li>
			`;
		});
		// 动态渲染 + 事件模拟
		// $('ul.list-main').html(htmlStr).find('li').eq(0).trigger('click');
		$('ul.list-main').html(htmlStr).children(':first').trigger('click');
	}
});
$('ul.list-main').on('click', function(e) {
	var $li = e.target.tagName === 'LI' ? $(e.target) : $(e.target).parent();
	if($li.hasClass('active')) return;
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
			if(res.data.length) {
				$('p.tip').hide();
				var htmlStr = '';
				res.data.forEach(function(item) {
					htmlStr += `
						<li>
							<a href="list.html?cid=${item.id}&cName=${item.name}"><img src="${item.avatar}" /><span>${item.name}</span></a>
						</li>
					`;
				});
				$('ul.list-sub').html(htmlStr).show();
			} else {// empty data
				$('p.tip').show();
				$('ul.list-sub').hide();
			}
		}
	});
});
