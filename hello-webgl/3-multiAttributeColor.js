// 绘制3个大小颜色都不相同的点
// gl.vertexAttribPointer()步进与偏移量、varying变量

// 创建attribute变量并赋值给varying变量，片元着色器会自动获取顶点着色器中同名varying变量值
// 顶点着色器->图形装配->光栅化->片元着色器，光栅化后逐片元调用片元着色器
const VSHADER_SOURCE = `
    attribute vec4 a_Position;
    attribute float a_PointSize;
    attribute vec4 a_Color;
    varying vec4 v_Color;
    void main() {
        gl_Position = a_Position;
        gl_PointSize = a_PointSize;
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
    gl.clear(gl.COLOR_BUFFER_BIT);
    gl.drawArrays(gl.POINTS, 0.0, n);
};

function initVertexBuffers(gl) {
    let n = 3;
    let verticesSizes = new Float32Array([
        // position-x position-y size color-r color-g color-b
        0.0, 0.5, 10.0, 1.0, 0.0, 0.0,
        -0.5, -0.5, 20.0, 0.0, 1.0, 0.0,
        0.5, -0.5, 30.0, 0.0, 0.0, 1.0
    ]);

    let vertexSizeBuffer = gl.createBuffer();
    if(!vertexSizeBuffer) {
        console.log('初始化缓冲区失败');
        return;
    }
    gl.bindBuffer(gl.ARRAY_BUFFER, vertexSizeBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, verticesSizes, gl.STATIC_DRAW);

    const FSIZE = verticesSizes.BYTES_PER_ELEMENT;
    // 绑定顶点坐标
    let a_Position = gl.getAttribLocation(gl.program, 'a_Position');
    if(a_Position < 0) {
        console.log('获取attribute变量（顶点坐标）位置信息失败');
        return;
    }
    // 2个数据， 数据类型为float，非标准化，单个顶点的全部数据（步进参数），偏移量
    gl.vertexAttribPointer(a_Position, 2, gl.FLOAT, false, FSIZE * 6, 0);
    gl.enableVertexAttribArray(a_Position);
    
    // 绑定顶点大小
    let a_PointSize = gl.getAttribLocation(gl.program, 'a_PointSize');
    if(a_PointSize < 0) {
        console.log('获取attribute变量（顶点大小）位置信息失败');
        return;
    }
    gl.vertexAttribPointer(a_PointSize, 1, gl.FLOAT, false, FSIZE * 6, FSIZE * 2);
    gl.enableVertexAttribArray(a_PointSize);

    // 绑定顶点颜色
    let a_Color = gl.getAttribLocation(gl.program, 'a_Color');
    if(a_Color < 0) {
        console.log('获取attribute变量（顶点颜色）位置信息失败');
        return;
    }
    gl.vertexAttribPointer(a_Color, 3, gl.FLOAT, false, FSIZE * 6, FSIZE * 3);
    gl.enableVertexAttribArray(a_Color);

    gl.bindBuffer(gl.ARRAY_BUFFER, null);// 解除缓冲区绑定
    return n;
}