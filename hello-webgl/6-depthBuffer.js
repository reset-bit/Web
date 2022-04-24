// 透视投影绘制颜色不相同的三角形
// MVP（模型矩阵+视图矩阵+投影矩阵）通过平移简化顶点个数，ZBuffer消隐
const VSHADER_SOURCE = `
    attribute vec4 a_Position;
    attribute vec4 a_Color;
    varying vec4 v_Color;
    uniform mat4 u_MvpMatrix;
    void main() {
        gl_Position = u_MvpMatrix * a_Position;
        v_Color = a_Color;
    }
`;
const FSHADER_SOURCE = `
    precision mediump float;
    varying vec4 v_Color;
    void main() {
        gl_FragColor = v_Color;
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
    gl.enable(gl.DEPTH_TEST);// 开启深度缓冲

    let modelMatrix = new Matrix4();
    let viewMatrix = new Matrix4();
    let projMatrix = new Matrix4();
    let mvpMatrix = new Matrix4();
    modelMatrix.setTranslate(0.75, 0, 0);// 模型矩阵（平移）
    viewMatrix.setLookAt(0, 0, 5, 0, 0, -100, 0, 1, 0);// 视图矩阵
    projMatrix.setPerspective(30, canvas.width / canvas.height, 1, 100);// 投影矩阵，垂直可视角 近裁剪面宽高比 近裁剪面 远裁剪面
    mvpMatrix.set(projMatrix).multiply(viewMatrix).multiply(modelMatrix);// 右乘
    
    let u_MvpMatrix = gl.getUniformLocation(gl.program, 'u_MvpMatrix');
    if(!u_MvpMatrix) {
        console.log('初始化uniform变量位置信息失败');
        return;
    }
    // one-side
    gl.uniformMatrix4fv(u_MvpMatrix, false, mvpMatrix.elements);
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);// 清除颜色缓冲区与深度缓冲区
    gl.drawArrays(gl.TRIANGLES, 0, n);
    // another-side
    modelMatrix.setTranslate(-0.75, 0, 0);
    mvpMatrix.set(projMatrix).multiply(viewMatrix).multiply(modelMatrix);
    gl.uniformMatrix4fv(u_MvpMatrix, false, mvpMatrix.elements);
    gl.drawArrays(gl.TRIANGLES, 0, n);
}

function initVertexBuffers(gl) {
    let n = 9;
    let vertices = new Float32Array([
        // position-x position-y position-z color-r color-g color-b
        0.0,  1.0,   0.0,  0.4,  0.4,  1.0,  // 最前 
        -0.5, -1.0,   0.0,  0.4,  0.4,  1.0,
        0.5, -1.0,   0.0,  1.0,  0.4,  0.4, 
    
        0.0,  1.0,  -2.0,  1.0,  1.0,  0.4, 
        -0.5, -1.0,  -2.0,  1.0,  1.0,  0.4,
        0.5, -1.0,  -2.0,  1.0,  0.4,  0.4,
    
        0.0,  1.0,  -4.0,  0.4,  1.0,  0.4, // 最后
        -0.5, -1.0,  -4.0,  0.4,  1.0,  0.4,
        0.5, -1.0,  -4.0,  1.0,  0.4,  0.4, 
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
    if(a_Position < 0) {
        console.log('获取attribute变量位置信息失败');
        return;
    }
    gl.vertexAttribPointer(a_Position, 3, gl.FLOAT, false, FSIZE * 6, 0);
    gl.enableVertexAttribArray(a_Position);
    let a_Color = gl.getAttribLocation(gl.program, 'a_Color');
    if(a_Color < 0) {
        console.log('获取attribute变量位置信息失败');
        return;
    }
    gl.vertexAttribPointer(a_Color, 3, gl.FLOAT, false, FSIZE * 6, FSIZE * 3);
    gl.enableVertexAttribArray(a_Color);

    return n;
}