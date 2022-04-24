let userInfo = {
	avatar: '',
	nikename: '',
	sex: '',
	birthday: ''
};

window.onload = function() {
	let avatarText = '', sexText = '';
	let isSexAbled = true;
	
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
	
	// 缩略图显示
	{
		// files[]读取用户选取的文件；URL.createObjectURL(obj)创建一个DOMString，包含obj的URL
		let avatar = document.querySelector('img.avatar');
		document.querySelector('input.btn-avatar').onchange = function() {
			// 为了阻止恶意软件猜测文件路径，字符串以 C:\fakepath\ 为前缀
			let img = this.files[0];
			// console.log(img);
			let url = URL.createObjectURL(img);
			avatar.src = url;
			avatarText = url;
		};
	}
	
	// 性别选项
	{
		let sex = document.querySelector('span.sex'),
			sexSelector = document.querySelector('.sex-select');
		let sexHandler = function() {
			if(!isSexAbled) return;
			sexSelector.classList.add('active');
		};
		let sexOptionHandler = function(target) {
			sex.innerText = target.innerText;
			sexText = target.innerText;
			sexSelector.classList.remove('active');
		};
		
		document.querySelector('body').onclick = function(e) {
			if(e.target.classList.contains('sex')) {
				sexHandler();
			} else if(e.target.classList.contains('sex-option')) {
				sexOptionHandler(e.target);
			} else {
				// 如果鼠标在性别选项处失焦，则隐藏选项
				sexSelector.classList.remove('active');
			}
		};
	}
	
	// 确认按钮点击事件
	{
		document.querySelector('.btn-save').onclick = function() {
			let form = document.forms['userInfo'];
			userInfo.avatar = avatarText;
			userInfo.nikename = form['nikename'].value;
			userInfo.sex = sexText;
			userInfo.birthday = form['birthday'].value;
			// console.log(userInfo);
			if(userInfo.sex !== '') {
				console.log('sexHandler=null');
				isSexAbled = false;
			}
			if(userInfo.birthday !== '') {
				form['birthday'].disabled = true;
			}
			// 动画开启
			document.querySelector('.animation-wrapper').classList.add('active');
			setTimeout(function() {
				document.querySelector('.animation-wrapper').classList.remove('active');
			}, 2400);
		};
	}
};