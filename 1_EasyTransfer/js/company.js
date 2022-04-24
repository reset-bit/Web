// 顶部按钮相关
window.onscroll = function() { scrollFunction(); };

function scrollFunction() {
    if (document.body.scrollTop > 600 || document.documentElement.scrollTop > 600) {
        document.getElementById("return-top").style.display = "block";
    } else {
        document.getElementById("return-top").style.display = "none";
    }
    if (document.body.scrollTop > 400 || document.documentElement.scrollTop > 400) {
        document.getElementsByClassName("advantage-title")[0].style.animation = "bigger-appear 1s forwards";
    }
    if (document.body.scrollTop > 1000 || document.documentElement.scrollTop > 1000) {
        document.getElementsByClassName("vip-title")[0].style.animation = "bigger-appear 1s forwards";
    }
    if (document.body.scrollTop > 1200 || document.documentElement.scrollTop > 1200) {
        let all = document.getElementsByClassName('vip-item');
        for (let i = 0; i < all.length; ++i) {
            all[i].style.animation = "bigger-appear .8s forwards";
        }
    }
}

function returnTop() {
    document.body.scrollTop = 0;
    document.documentElement.scrollTop = 0;
}

window.onload = function() {
    returnTop();
};

// 鼠标移动到可伸缩item上触发事件
function expandItem(cur) {
    timer = setTimeout(function() {
        cur.style.animation = 'expand .5s forwards';
        cur.style.WebkitAnimation = 'expand .5s forwards';
        cur.children[0].style.color = '#fff';
        cur.children[1].style.display = 'block';
        let index = cur.id.substring(3);
        let id = 'divider' + index;
        document.getElementById(id).style.display = 'none';
        if (index != 1) {
            index--;
            id = 'divider' + index;
            document.getElementById(id).style.display = 'none';
        }
    }, 400);
}

// 鼠标移开到可伸缩item上触发事件
function restoreItem(cur) {
    clearTimeout(timer);
    cur.style.animiaion = 'restore .5s forwards';
    cur.style.WebkitAnimation = 'restore .5s forwards';
    cur.children[0].style.color = 'grey';
    cur.children[1].style.display = 'none';
    let index = cur.id.substring(3);
    let id = 'divider' + index;
    document.getElementById(id).style.display = 'inline';
    if (index != 1) {
        index--;
        id = 'divider' + index;
        document.getElementById(id).style.display = 'inline';
    }
}

// 鼠标移动到固定item上触发事件
function moverItem(cur) {
    cur.children[0].style.color = '#fff';
    cur.children[1].style.animation = 'mover .5s forwards';
}

// 鼠标移开到固定item上触发事件
function moutItem(cur) {
    cur.children[0].style.color = 'grey';
    cur.children[1].style.animation = 'mout .5s forwards';
}

// vip列表左右划
function leftVip() {
    let all = document.getElementsByClassName('vip-item');
    for (let i = 0; i < all.length; ++i) {
        let before = all[i].style.left;
        if (before == '') {
            all[i].style.left = '0px';
        } else {
            before = parseInt(before.substring(0, before.length - 2));
            if (before < 0) {
                before += 250;
            }
            all[i].style.left = before + 'px';
        }
    }
    runAnimation();
}

function rightVip() {
    let all = document.getElementsByClassName('vip-item');
    for (let i = 0; i < all.length; ++i) {
        let before = all[i].style.left;
        if (before == '') {
            all[i].style.left = '-250px';
        } else {
            before = parseInt(before.substring(0, before.length - 2));
            if (before > -750) {
                before -= 250;
            }
            all[i].style.left = before + 'px';
        }
    }
    runAnimation();
}

function runAnimation() {
    $('.vip-item').css({
        'animation': 'left-and-right 0.4s',
        '-webkit-animation': 'left-and-right 0.4s'
    });
    setTimeout(function() {
        $('.vip-item').css({
            'animation': 'none',
            '-webkit-animation': 'none'
        });
    }, 400);
}