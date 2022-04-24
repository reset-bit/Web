function initFace() {
    let width = window.document.body.clientWidth;
    let aim = document.getElementById('avatar-area');
    if (aim) {
        aim.style.left = width / 2 - 60 + "px";
        console.log("already change avatar-area position");
    }
}

window.onload = function() {
    initFace();
    changeBtnStatus();
}
window.onresize = function() {
    let list = document.getElementById('avatar-area').classList;
    if (list.contains('acti-avatar-area')) {
        document.getElementById('avatar-area').style.left = "5%";
    } else {
        initFace();
    }

}

function chatInit() {
    document.getElementById('init').style.width = "50%"; //bnt-init
    document.getElementById('init').style.bottom = "14%";
    document.getElementById('init').classList.remove('btn-begin');
    document.getElementById('init-text').style.display = "none";
    document.getElementById('data').style.display = "inline"; //input
    document.getElementById('submit').style.display = "flex"; //btn-input
    document.getElementById('avatar-area').classList.add('acti-avatar-area');
    document.getElementById('avatar-area').style.left = "5%";
    let tmp = 'dec-red';
    document.getElementById(tmp).style.animation = "micro-wave 2s ease-in-out infinite";
    tmp = 'dec-green';
    document.getElementById(tmp).style.animation = "micro-wave 2s ease-in-out infinite";
    tmp = 'dec-blue';
    document.getElementById(tmp).style.animation = "micro-wave 2s ease-in-out infinite";
    document.getElementById('chat-area').style.display = "flex";
}

function concelChatInit() {
    document.getElementById('init').style.width = "12%"; //bnt-init
    document.getElementById('init').style.bottom = "34%";
    document.getElementById('init').classList.add('btn-begin');
    document.getElementById('init-text').style.display = "flex";
    document.getElementById('data').style.display = "none";
    document.getElementById('submit').style.display = "none";
    document.getElementById('avatar-area').classList.remove('acti-avatar-area');
    initFace();
    let tmp = 'dec-red';
    document.getElementById(tmp).style.animation = "none";
    tmp = 'dec-green';
    document.getElementById(tmp).style.animation = "none";
    tmp = 'dec-blue';
    document.getElementById(tmp).style.animation = "none";
    document.getElementById('chat-area').style.display = "none";
}

function beginChat() {
    let data = from.data.value;
    console.log(data);
    let div = document.createElement("div");
    div.innerHTML = data;
    div.className = "chat-bar right content_center";
    document.getElementById('chat-area').appendChild(div);
}

// 弹窗相关
let isUser = false; //标记用户是否登录
function changeBtnStatus() {
    if (isUser) {
        document.getElementById('login').style.color = "#c0b6ff";
        document.getElementById('login').onclick = "none";
        document.getElementById('exit').style.color = "#f5f5f5";
        document.getElementById('exit').onclick = function() { exit(); };
        document.getElementById('settings').style.color = "#f5f5f5";
        document.getElementById('settings').onclick = function() { settings(); };
    } else {
        document.getElementById('login').style.color = "#f5f5f5";
        document.getElementById('login').onclick = function() { login(); };
        document.getElementById('exit').style.color = "#c0b6ff";
        document.getElementById('exit').onclick = "none";
        document.getElementById('settings').style.color = "#c0b6ff";
        document.getElementById('settings').onclick = "none";
    }
}

// 关闭弹窗
function closeWindow(aim) {
    let area = document.getElementById(aim + "-area");
    area.style.animation = "disappear .4s ease-in-out forwards";
    setTimeout(function() {
        console.log("success remove area");
        document.getElementById("container").removeChild(area);
    }, 1000);
}
// -------------------------------------------------------------------------login
function login() {
    let loginArea = document.createElement("div");
    loginArea.className = "login-area tool-area";
    loginArea.id = "login-area";
    // title
    let loginTitle = document.createElement("div");
    loginTitle.innerHTML = "登录";
    loginTitle.className = "login-title tool-title";
    loginArea.appendChild(loginTitle);
    // form
    let form = document.createElement("form");
    form.name = "form";
    form.action = "#";
    // bar-username
    let username = document.createElement("input");
    username.name = "username";
    username.placeholder = "用户名/邮箱";
    form.appendChild(username);
    // bar-password
    let password = document.createElement("input");
    password.type = "password";
    password.name = "password";
    password.placeholder = "密码";
    form.appendChild(password);
    // register & forgot password
    let bar = document.createElement("div");
    bar.className = "bar";
    let registerBtn = document.createElement("div");
    registerBtn.className = "option";
    registerBtn.id = "register";
    registerBtn.innerHTML = "新用户注册";
    registerBtn.onclick = function() {
        register();
    };
    bar.appendChild(registerBtn);
    let forgotBtn = document.createElement("div");
    forgotBtn.className = "option";
    forgotBtn.id = "forgot";
    forgotBtn.innerHTML = "忘记密码";
    forgotBtn.onclick = function() {
        forgot();
    };
    bar.appendChild(forgotBtn);
    form.appendChild(bar);
    // btn-submit
    let submit = document.createElement("div");
    submit.id = "login-submit";
    submit.className = "content-center btn-big";
    submit.innerHTML = "登录";
    submit.onclick = function() {
        //check
        if (!checkIsNull()) {
            alert("输入内容不允许为空，请检查后再次输入");
        } else {
            //success
            isUser = true;
            console.log("isUser=" + isUser);
            changeBtnStatus();
            let div = document.createElement("div");
            div.className = "loading";
            for (let i = 0; i < 3; ++i) {
                let dot = document.createElement("div");
                dot.className = "loading-dot";
                dot.style.animationDelay = (i * 100) + "ms";
                div.appendChild(dot);
            }
            loginArea.appendChild(div);
            setTimeout(function() {
                closeWindow("login");
            }, 2000);
        }
    };
    loginArea.appendChild(form);
    loginArea.appendChild(submit);
    // btn-close
    let close = document.createElement("div");
    close.id = "close";
    close.className = "content-center";
    close.innerHTML = "×";
    close.onclick = function() {
        closeWindow("login");
    };
    loginArea.appendChild(close);
    // container->add
    document.getElementById('container').appendChild(loginArea);
}

function checkIsNull() {
    let usr = form.username.value;
    let pwd = form.password.value;
    if (usr.length == 0 || pwd.length == 0) {
        return false;
    }
    return true;
}
// -----------------------------------------------------------register
function register() {
    let registerArea = document.createElement("div");
    registerArea.className = "register-area tool-area";
    registerArea.id = "register-area";
    // title
    let registerTitle = document.createElement("div");
    registerTitle.innerHTML = "注册";
    registerTitle.className = "register-title tool-title";
    registerArea.appendChild(registerTitle);
    // form
    let form = document.createElement("form");
    form.action = "#";
    // bar-username
    let username = document.createElement("input");
    username.name = "username";
    username.placeholder = "用户名/邮箱";
    form.appendChild(username);
    // bar-password
    let password = document.createElement("input");
    password.type = "password";
    password.name = "password";
    password.placeholder = "密码";
    form.appendChild(password);
    // btn-submit
    let submit = document.createElement("div");
    submit.id = "register-submit";
    submit.className = "content-center btn-big";
    submit.innerHTML = "注册";
    submit.onclick = function() {
        let div = document.createElement("div");
        div.className = "loading";
        for (let i = 0; i < 3; ++i) {
            let dot = document.createElement("div");
            dot.className = "loading-dot";
            dot.style.animationDelay = (i * 100) + "ms";
            div.appendChild(dot);
        }
        registerArea.appendChild(div);
        setTimeout(function() {
            closeWindow("register");
        }, 2000);
    };
    registerArea.appendChild(form);
    registerArea.appendChild(submit);
    // btn-close
    let close = document.createElement("div");
    close.id = "close";
    close.className = "content-center";
    close.innerHTML = "×";
    close.onclick = function() {
        closeWindow("register");
    };
    registerArea.appendChild(close);
    // container->add
    document.getElementById('container').appendChild(registerArea);
}
// -----------------------------------------------------------register
// -----------------------------------------------------------forgot
function forgot() {
    let forgotArea = document.createElement("div");
    forgotArea.className = "forgot-area tool-area";
    forgotArea.id = "forgot-area";
    // title
    let forgotTitle = document.createElement("div");
    forgotTitle.innerHTML = "修改密码";
    forgotTitle.className = "forgot-title tool-title";
    forgotArea.appendChild(forgotTitle);
    // form
    let form = document.createElement("form");
    form.name = "form";
    form.action = "#";
    // bar-username
    let username = document.createElement("input");
    username.name = "username";
    username.placeholder = "用户名/邮箱";
    form.appendChild(username);
    // bar-password
    let password = document.createElement("input");
    password.type = "password";
    password.name = "password";
    password.placeholder = "密码";
    form.appendChild(password);
    // bar-new-password
    let newpassword = document.createElement("input");
    newpassword.type = "password";
    newpassword.name = "newpassword";
    newpassword.placeholder = "再次输入密码";
    form.appendChild(newpassword);
    // btn-submit
    let submit = document.createElement("div");
    submit.id = "forgot-submit";
    submit.className = "content-center btn-big";
    submit.innerHTML = "提交";
    submit.onclick = function() {
        if (!checkPassword()) {
            alert("两次输入密码不一致，请检查后再次提交");
        }
        closeWindow("forgot");
    };
    forgotArea.appendChild(form);
    forgotArea.appendChild(submit);
    // btn-close
    let close = document.createElement("div");
    close.id = "close";
    close.className = "content-center";
    close.innerHTML = "×";
    close.onclick = function() {
        closeWindow("forgot");
    };
    forgotArea.appendChild(close);
    // container->add
    document.getElementById('container').appendChild(forgotArea);
}

function checkPassword() {
    let pwd = form.password.value;
    let newpwd = form.newpassword.value;
    return pwd === newpwd;
}
// -----------------------------------------------------------forgot
// -------------------------------------------------------------------------login

// -------------------------------------------------------------------------exit
function exit() {
    let exitArea = document.createElement("div");
    exitArea.className = "exit-area tool-area";
    exitArea.id = "exit-area";
    // content
    let content = document.createElement("div");
    content.innerHTML = "确定退出吗？";
    content.className = "exit-content tool-content";
    exitArea.appendChild(content);
    // btn-submit
    let submit = document.createElement("div");
    submit.id = "exit-submit";
    submit.className = "content-center btn-big";
    submit.innerHTML = "退出";
    submit.onclick = function() {
        isUser = false;
        console.log("isUser=" + isUser);
        changeBtnStatus();
        closeWindow("exit");
    };
    exitArea.appendChild(submit);
    // btn-close
    let close = document.createElement("div");
    close.id = "close";
    close.className = "content-center";
    close.innerHTML = "×";
    close.onclick = function() {
        closeWindow("exit");
    };
    exitArea.appendChild(close);
    // container->add
    document.getElementById('container').appendChild(exitArea);
}
// -------------------------------------------------------------------------exit

// -------------------------------------------------------------------------settings
function settings() {
    let settingsArea = document.createElement("div");
    settingsArea.className = "settings-area tool-area";
    settingsArea.id = "settings-area";
    // content
    let content = document.createElement("div");
    content.innerHTML = "在这里进行您的个性化设置";
    content.className = "settings-content tool-content";
    settingsArea.appendChild(content);
    // form
    let form = document.createElement("form");
    form.action = "#";
    // username-input
    let bar1 = document.createElement("div");
    bar1.className = "login-bar content-center";
    let nametext = document.createElement("span");
    nametext.innerHTML = "用户名:";
    bar1.appendChild(nametext);
    let username = document.createElement("input");
    username.name = "username";
    bar1.appendChild(username);
    form.appendChild(bar1);
    // btn-submit
    let submit = document.createElement("div");
    submit.id = "save-submit";
    submit.className = "content-center btn-big";
    submit.innerHTML = "保存";
    settingsArea.appendChild(submit);
    // btn-close
    let close = document.createElement("div");
    close.id = "close";
    close.className = "content-center";
    close.innerHTML = "×";
    close.onclick = function() {
        closeWindow("settings");
    };
    settingsArea.appendChild(close);
    // container->add
    document.getElementById('container').appendChild(settingsArea);
}
// -------------------------------------------------------------------------settings