function changeOption(id) {
    document.getElementById(id).style.borderBottomWidth = '1px';
    document.getElementById(id).style.borderBottomStyle = 'solid';
    document.getElementById(id).style.borderBottomColor = 'grey';
    if (id == 'login-op') {
        document.getElementById('register-op').style.border = 'none';
        document.getElementById('login-btn').style.display = 'inherit';
        document.getElementById('register-btn').style.display = 'none';
        document.getElementsByClassName('tips')[0].style.display = 'flex';
    } else {
        document.getElementById('login-op').style.border = 'none';
        document.getElementById('login-btn').style.display = 'none';
        document.getElementById('register-btn').style.display = 'inherit';
        document.getElementsByClassName('tips')[0].style.display = 'none';
    }
}

let timer;

function showDocBtns() {
    if (timer) {
        clearTimeout(timer);
    }
    for (let i = 0; i < 2; ++i) {
        document.getElementsByClassName('docop')[i].style.display = 'flex';
        document.getElementsByClassName('docop')[i].style.animation = 'appear-big-btn .8s forwards';
        document.getElementsByClassName('docop')[i].style.WebkitAnimation = 'appear-big-btn .8s forwards';
    }
}

function unshowDocBtns() {
    timer = setTimeout(function() {
        for (let i = 0; i < 2; ++i) {
            document.getElementsByClassName('docop')[i].style.animation = 'disappear-big-btn .8s forwards';
            document.getElementsByClassName('docop')[i].style.WebkitAnimation = 'disappear-big-btn .8s forwards';
            document.getElementsByClassName('docop')[i].style.display = 'none';
        }
    }, 1000)
}

// login-wrapper翻转触发事件
$(document).ready(function() {
    $(".btn").click(function(e) {
        let id = e.toElement.id;
        // console.log(id);
        if (id === 'sender') {
            document.getElementById('back-sender').style.display = 'inline'; //显示
            document.getElementById('back-receiver').style.display = 'none'; //隐藏
            $('#login-wrapper').addClass('goback-wrapper');
        } else if (id === 'receiver') {
            document.getElementById('back-receiver').style.display = 'inline';
            document.getElementById('back-sender').style.display = 'none';
            $('#login-wrapper').addClass('goback-wrapper');
        }
    });

    // 正反面切换
    $('#login-wrapper').bind(function() {
        let classNames = document.getElementById('goback-wrapper').className;
        if (!classNames.contains('goback-wrapper')) {
            $('#login-wrapper').addClass('goback-wrapper');
        }
    });
    $(".return").click(function(e) {
        $('#login-wrapper').removeClass('goback-wrapper');
    });
});