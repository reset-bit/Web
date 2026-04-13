window.onload = function() {
	// 支付方式切换
	{
		let pay = document.querySelector('.btn-pay'),
			wechatPay = document.querySelector('.wechat-pay');
		document.querySelectorAll('.radio').forEach(function(item) {
			item.onclick = function() {
				this.parentNode.parentNode.querySelector('span.radio.checked').classList.remove('checked');
				this.classList.toggle('checked');
				let type = this.dataset.type;
				let reset = function() {
					document.querySelectorAll('span.huabei-type').forEach(function(item) {
						item.classList.remove('checked');
					});
					pay.style.display = 'block';
					wechatPay.style.display = 'none';
				};
				
				reset();
				if(type === 'wechat') {
					pay.style.display = 'none';
					wechatPay.style.display = 'inline-block';
				} else if(type === 'huabei') {
					document.querySelector('span.huabei-type:first-child').classList.add('checked');
				}
			};
		});
		
		document.querySelectorAll('span.huabei-type').forEach(function(item) {
			item.onclick = function() {
				document.querySelector('span.radio.checked').classList.remove('checked');
				document.querySelector('span.radio[data-type="huabei"]').classList.add('checked');
				pay.style.display = 'block';
				wechatPay.style.display = 'none';
				let oldChecked = this.parentNode.querySelector('span.huabei-type.checked');
				if(oldChecked !== null) {
					oldChecked.classList.remove('checked');
				}
				this.classList.add('checked');
			};
		});
	}
};