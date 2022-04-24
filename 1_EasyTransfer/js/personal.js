function init() {
    let width = window.document.body.clientWidth;
    document.getElementsByClassName('right')[0].style.width = width - 300 + 'px';
    document.getElementById('linkid').href = 'css/personal-light.css';
}

window.onload = function() { init(); }
window.onresize = function() { init(); }

// 进度条动画添加
function scrollFunction() {
    let all = document.getElementsByClassName('used');
    if (document.body.scrollTop > 400 || document.documentElement.scrollTop > 400) {
        for (let i = 0; i < all.length; ++i) {
            all[i].style.animation = 'used-processbar 2s ease-in-out';
        }
    }
}

window.onscroll = function() { scrollFunction(); }

// return按钮动画添加
function addAnimation() {
    document.getElementById('returnArrow').style.animation = 'goback 1s linear 2';
    setTimeout(function() {
        document.getElementById('returnArrow').style.animation = 'none';
    }, 2000);
}

// 更换主题
function changeTopic() {
    let curTpoic = document.getElementById('linkid').href;
    let index = curTpoic.indexOf('css');
    curTpoic = curTpoic.substring(index, curTpoic.length);
    console.log(curTpoic);
    if (curTpoic == 'css/personal-light.css' || curTpoic == '') {
        document.getElementById('linkid').href = 'css/personal-dark.css';
    } else {
        document.getElementById('linkid').href = 'css/personal-light.css';
    }
}