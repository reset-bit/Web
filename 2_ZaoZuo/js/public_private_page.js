// 登录判断
{
	if(Cookies.get('user') === undefined) {
		window.location.replace('../html/login.html');
	}
}