// 着色器--GLSL
// 顶点着色器
const VSHADER_SOURCE = `
    attribute vec4 a_Position;
    void main() {
        gl_Position = a_Position;
        gl_PointSize = 10.0;
    }
`;

// 片元着色器
const FSHADER_SOURCE = `
    void main() {
        gl_FragColor = vec4(1.0, 0.0, 0.0, 1.0);
    }
`;

window.onload = function() {
    let canvas = document.querySelector('canvas#webgl');
    // 初始化webGL上下文
    let gl = getWebGLContext(canvas);
    if(!gl) {
        console.log('获取webGL上下文失败，您的浏览器可能不支持webGL');
        return;
    }
    // 初始化着色器
    if(!initShaders(gl, VSHADER_SOURCE, FSHADER_SOURCE)) {
        console.log('初始化着色器失败');
        return;
    }

    // 获取attribute变量（传输顶点相关信息）的存储位置
    let a_Position = gl.getAttribLocation(gl.program, 'a_Position');
    if(a_Position < 0) {
        console.log('获取attribute变量存储位置失败');
        return;
    }

    canvas.onmousedown = function(e) {
        click(e, gl, canvas, a_Position);
    };

    // 设置canvas背景色
    gl.clearColor(0.0, 0.0, 0.0, 1.0);
    // 清除canvas
    gl.clear(gl.COLOR_BUFFER_BIT);
};

// 鼠标点击响应事件
var g_points = [];
function click(e, gl, canvas, a_Position) {
    let x = e.clientX;
    let y = e.clientY;
    let rectOfCanvas = e.target.getBoundingClientRect();

    // 浏览器坐标->canvas坐标->webGL坐标
    x = ((x - rectOfCanvas.left) - canvas.width / 2) / (canvas.width / 2);
    y = (canvas.height / 2 - (y - rectOfCanvas.top)) / (canvas.height / 2);
    g_points.push([x, y]);

    // 清空画布，每次都从第一个点开始画
    gl.clear(gl.COLOR_BUFFER_BIT);
    for(xy of g_points) {
        // 将具体坐标赋值给attribute变量
        gl.vertexAttrib3f(a_Position, xy[0], xy[1], 0.0);
        // 绘制（从第零个点，绘制一个）
        gl.drawArrays(gl.POINTS, 0, 1);
    }
};
