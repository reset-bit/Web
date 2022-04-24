// 平行投影+可见体
// 先进行视图变换，后设置可见空间
const VSHADER_SOURCE = `
    attribute vec4 a_Position;
    attribute vec4 a_PointColor;
    varying vec4 v_PointColor;
    uniform mat4 u_ViewMatrix;// 视点+观察目标点+上方向矩阵
    uniform mat4 u_ProjMatrix;// 可见空间矩阵
    void main() {
        gl_Position = u_ProjMatrix * u_ViewMatrix * a_Position;
        v_PointColor = a_PointColor;
    }
`;
const FSHADER_SOURCE = `
    precision mediump float;
    varying vec4 v_PointColor;
    void main() {
        gl_FragColor = v_PointColor;
    }
`;

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
    let n = initVertexBuffers(gl);
    if(n < 0) {
        console.log('设置顶点信息失败');
        return;
    }
    gl.clearColor(0.0, 0.0, 0.0, 1.0);

    let u_ViewMatrix = gl.getUniformLocation(gl.program, 'u_ViewMatrix');
    let u_ProjMatrix = gl.getUniformLocation(gl.program, 'u_ProjMatrix');
    if(!u_ViewMatrix || !u_ProjMatrix) {
        console.log('获取uniform变量位置信息失败');
        return;
    }
    let viewMatrix = new Matrix4();
    document.onkeydown = function(e) {
        keydown(e, gl, n, u_ViewMatrix, viewMatrix);
    };
    let projMatrix = new Matrix4();
    projMatrix.setOrtho(-1.0, 1.0, -1.0, 1.0, 0.0, 2.0);// 设置可见空间范围
    gl.uniformMatrix4fv(u_ProjMatrix, false, projMatrix.elements);

    draw(gl, n, u_ViewMatrix, viewMatrix);// 绘制初始画面
};

function initVertexBuffers(gl) {
    let n = 9;
    let vertices = new Float32Array([
        // position-x position-y position-z color-r color-g color-b
        0.0,  0.5,  -0.4,  0.4,  1.0,  0.4, // 最远
        -0.5, -0.5,  -0.4,  0.4,  1.0,  0.4,
        0.5, -0.5,  -0.4,  1.0,  0.4,  0.4, 
    
        0.5,  0.4,  -0.2,  1.0,  0.4,  0.4, 
        -0.5,  0.4,  -0.2,  1.0,  1.0,  0.4,
        0.0, -0.6,  -0.2,  1.0,  1.0,  0.4, 

        0.0,  0.5,   0.0,  0.4,  0.4,  1.0,  // 最近
        -0.5, -0.5,   0.0,  0.4,  0.4,  1.0,
        0.5, -0.5,   0.0,  1.0,  0.4,  0.4, 
    ]);

    let vertexBuffer = gl.createBuffer();
    if(!vertexBuffer) {
        console.log('初始化缓冲区失败');
        return;
    }
    gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW);

    const FSIZE = vertices.BYTES_PER_ELEMENT;
    let a_Position = gl.getAttribLocation(gl.program, 'a_Position');
    let a_PointColor = gl.getAttribLocation(gl.program, 'a_PointColor');
    if(a_Position < 0 || a_PointColor < 0) {
        console.log('获取attribute变量位置信息失败');
        return;
    }
    gl.vertexAttribPointer(a_Position, 3, gl.FLOAT, false, FSIZE * 6, 0);
    gl.enableVertexAttribArray(a_Position);
    gl.vertexAttribPointer(a_PointColor, 3, gl.FLOAT, false, FSIZE * 6, FSIZE * 3);
    gl.enableVertexAttribArray(a_PointColor);

    return n;
}
var g_eyeX = 0.2, g_eyeY = 0.25, g_eyeZ = 0.25;// 视点位置
function keydown(e, gl, n, u_ViewMatrix, viewMatrix) {
    if(e.keyCode == 39) {// →
        g_eyeX += 0.01;
    } else if(e.keyCode == 37) {// ←
        g_eyeX -= 0.01;
    } else {
        return;
    }
    draw(gl, n, u_ViewMatrix, viewMatrix);
}
function draw(gl, n, u_ViewMatrix, viewMatrix) {
    viewMatrix.setLookAt(g_eyeX, g_eyeY, g_eyeZ, 0, 0, 0, 0, 1, 0);// 视点+观察目标点+上方向
    gl.uniformMatrix4fv(u_ViewMatrix, false, viewMatrix.elements);

    gl.clear(gl.COLOR_BUFFER_BIT);
    gl.drawArrays(gl.TRIANGLES, 0, n);
}