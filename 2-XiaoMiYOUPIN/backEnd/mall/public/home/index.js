// 轮播图
{
	new Swiper('.banner', {
		loop: true,
		autoplay: {
			disableOnInteraction: false
		},
		pagination: {
			el: '.banner>.swiper-pagination',
			type: 'bullets'
		}
	});
	
}

// 倒计时
{
	let date = new Date();
	let end = new Date(date.getFullYear(), date.getMonth(), date.getDate(), date.getHours() + 1, 0, 0);
	let diff = 0;
	let str = '';
	let second = 0, minute = 0, hour = 0;
	str = format(second, minute, hour);
	showSecKill();
	let timer = null;
	timer = setInterval(function() {
		if(str === '00:00:00') {
			clearInterval(timer);
			timer = null;
			return;
		}
		showSecKill();
	}, 1000);
	
	function showSecKill() {
		$('span.hour').text(date.getHours() + 1);
		date = new Date();
		diff = Math.ceil((end.getTime() - date.getTime()) / 1000);
		second = Math.ceil(diff % 60);
		minute = Math.floor(diff / 60);
		// console.log(second, minute, hour);
		str = format(second, minute, hour);
		$('span.sec').text(str);
	}
	function format(sec, min, hour) {
		let str = '0' + hour;
		str += ':' + (min >= 10 ? min : '0' + min);
		str += ':' + (sec >= 10 ? sec : '0' + sec);
		return str;
	}
}
