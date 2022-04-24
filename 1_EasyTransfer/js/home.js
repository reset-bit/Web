function init() {
    let width = window.document.body.clientWidth;
    let height = window.document.body.clientHeight;
    console.log(width + "px" + height + "px");
    document.getElementById('content').style.width = width - 230 + "px";
    document.getElementById('content').style.height = height - 100 + "px";
    // 根据窗口尺寸控制【我的好友】文件发送窗口是否显示
    if (width < 800) {
        document.getElementById('contact-detail-ori').style.display = 'block';
        document.getElementsByClassName('contact-detail-ori')[0].style.width = width - 230 - 300 + "px"; //content基础上-search-contact
        document.getElementById('contact-detail').style.display = 'none';
    } else {
        document.getElementById('contact-detail-ori').style.display = 'none';
        document.getElementById('contact-detail').style.display = 'block';
        document.getElementsByClassName('contact-detail')[0].style.width = width - 230 - 300 + "px"; //content基础上-search-contact
        document.getElementsByClassName('contact-detail-window')[0].style.height = height - 100 - 180 + "px"; //content基础上-contact-detail-topbar、-contact-detail-sender
    }
}

window.onresize = function() { init(); };

window.onload = function() { init(); };

function controlList() {
    let status = document.getElementsByClassName('dropdown-content')[0].style.display;
    if (status == 'none') {
        document.getElementsByClassName('dropdown-content')[0].style.display = 'block';
        document.getElementsByClassName('dropdown')[0].style.transform = 'rotate(180deg)';
    } else {
        document.getElementsByClassName('dropdown-content')[0].style.display = 'none';
        document.getElementsByClassName('dropdown')[0].style.transform = 'rotate(360deg)';
    }
}

function changeView(id) {
    let index = 0;
    if (id == 'my-documents-btn') {
        index = 0;
    } else if (id == 'my-friends-btn') {
        index = 1;
    } else if (id == 'my-inbox-btn') {
        index = 2;
    }
    for (let i = 0; i < 3; ++i) {
        document.getElementsByClassName('content-item')[i].style.display = 'none';
        document.getElementsByClassName('menu-item')[i].style.backgroundColor = '#fff';
        document.getElementsByClassName('menu-item')[i].style.borderRight = 'none';
        document.getElementsByClassName('menu-item')[i].style.color = 'grey';
    }
    document.getElementsByClassName('content-item')[index].style.display = 'block';
    document.getElementById(id).style.backgroundColor = 'whitesmoke';
    document.getElementById(id).style.borderRightWidth = '2px';
    document.getElementById(id).style.borderRightStyle = 'solid';
    document.getElementById(id).style.borderRightColor = '#3296FA';
    document.getElementById(id).style.color = '#3296FA';
}

function selectDoc(name) {
    // console.log(name);
    let status = document.getElementsByName(name)[0].checked;
    if (name == 'allMyDoc') {
        let all = document.getElementsByName('myDoc');
        for (let i = 0; i < all.length; ++i) {
            if (status == true) {
                all[i].checked = 'checked';
            } else {
                all[i].checked = null;
            }
        }
    } else if (name == 'allRecDoc') {
        let all = document.getElementsByName('recDoc');
        for (let i = 0; i < all.length; ++i) {
            if (status == true) {
                all[i].checked = 'checked';
            } else {
                all[i].checked = null;
            }
        }
    }
}