// 防抖
function debounce(f, delay) {
	let timer = null;
	return function() {
		if(timer) {
			clearTimerout(timer);//计时过程中又触发了相同事件，重新开始计时
			timer = null;
		}
		timer = setTimeout(f, delay);
	}
}

// 返回顶部
(function() {
	let topBtn = document.querySelector('a.go-top'),
		threshold = 600,
		top = 0,
		timer = null;
		
	let onscrollHandler = window.onscroll;
	window.onscroll = function() {
		if(onscrollHandler !== null) {
			onscrollHandler();
		}
		top = document.documentElement.scrollTop || window.scrollYOffset || document.body.scrollTop;
		topBtn.classList.toggle('active', top >= threshold);
	};
	window.onmousewheel = function() {
		if(timer !== null) {
			clearInterval(timer);
			timer = null;
		}
	};
	topBtn.onclick = function() {
		timer = setInterval(function() {
			top = document.documentElement.scrollTop || window.scrollYOffset || document.body.scrollTop;
			if(top <= 2) {
				clearInterval(timer);
				timer = null;
				window.scrollTo(0, 0);
				return;
			}
			window.scrollTo(0, top * 0.9);			
		}, 20);
	};
})();

