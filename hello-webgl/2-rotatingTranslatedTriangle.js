// 绕原点匀速旋转的三角形动画（使用矩阵）
const VSHADER_SOURCE = `
    attribute vec4 a_Position;
    uniform mat4 u_ModelMatrix;
    void main() {
        gl_Position = u_ModelMatrix * a_Position;
    }
`;
const FSHADER_SOURCE = `
    void main() {
        gl_FragColor = vec4(1.0, 0.0, 0.0, 1.0);
    }
`;
const ANGLE_STEP = 45.0;// 旋转角度

window.onload = function() {
    let canvas = document.querySelector('canvas#webgl');
    let gl = getWebGLContext(canvas);
    if(!gl) {
        console.log('获取webGL上下文失败，您的浏览器可能不支持webGL');
        return;
    }
    if(!initShaders(gl, VSHADER_SOURCE, FSHADER_SOURCE)) {
        console.log('初始化着色器失败');
        return;
    }
    let n = initVertexBuffer(gl);
    if(n < 0) {
        console.log('设置顶点信息失败');
        return;
    }
    gl.clearColor(0.0, 0.0, 0.0, 1.0);// 设置canvas背景色
    
    let u_ModelMatrix = gl.getUniformLocation(gl.program, 'u_ModelMatrix');
    if(!u_ModelMatrix) {
        console.log('获取uniform变量存储位置失败');
        return;
    }
    let currentAngle = 0.0;// 当前旋转角度
    let modelMatrix = new Matrix4();// 变换矩阵
    let tick = function() {
        currentAngle = animate(currentAngle);// 更改旋转角度
        draw(gl, n, currentAngle, modelMatrix, u_ModelMatrix);// 绘制
        requestAnimationFrame(tick, canvas);// 请求下一次调用
    };
    tick();
};

// 缓冲区
function initVertexBuffer(gl) {
    let vertices = new Float32Array([
        0, 0.5, -0.5, -0.5, 0.5, -0.5
    ]);
    let n = 3;

    let vertexBuffer = gl.createBuffer();
    if(!vertexBuffer) {
        console.log('建立缓冲区对象失败');
        return;
    }
    gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);// 绑定缓冲区对象和target
    gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW);// 向target中写数据
    let a_Position = gl.getAttribLocation(gl.program, 'a_Position');
    if(a_Position < 0) {
        console.log('获取attribute变量存储位置失败');
        return;
    }
    gl.vertexAttribPointer(a_Position, 2, gl.FLOAT, false, 0, 0);// 为attribute变量赋值
    gl.enableVertexAttribArray(a_Position);// 开启attribute变量
    return n;
};

// 擦除并绘制新的三角形
function draw(gl, n, currentAngle, modelMatrix, u_ModelMatrix) {
    modelMatrix.setRotate(currentAngle, 0, 0, 1);
    modelMatrix.translate(0.35, 0, 0);

    gl.uniformMatrix4fv(u_ModelMatrix, false, modelMatrix.elements);// 为uniform变量赋值
    gl.clear(gl.COLOR_BUFFER_BIT);// 清空canvas
    gl.drawArrays(gl.TRIANGLES, 0, n);// 绘制三角形
};

// 更改旋转角度
var g_last = Date.now();
function animate(angle) {
    let now = Date.now();
    let elapsed = now - g_last;// 由于两次tick之间调用时间间隔不确定，故使用差值保证匀速旋转
    g_last = now;
    let newAngle = angle + (ANGLE_STEP * elapsed) / 1000.0;// 度/秒
    return newAngle %= 360;
};