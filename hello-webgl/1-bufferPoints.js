const VSHADER_SOURCE = `
    attribute vec4 a_Position;
    void main() {
        gl_Position = a_Position;
        gl_PointSize = 10.0;
    }
`;
const FSHADER_SOURCE = `
    void main() {
        gl_FragColor = vec4(1.0, 0.0, 0.0, 1.0);
    }
`;

window.onload = function() {
    let canvas = document.querySelector('canvas#webgl');
    let gl = getWebGLContext(canvas);
    if(!gl) {
        console.log('获取webGL上下文失败，您的浏览可能不支持webGL');
        return;
    }
    if(!initShaders(gl, VSHADER_SOURCE, FSHADER_SOURCE)) {
        console.log('初始化着色器失败');
        return;
    }

    let n = initVertexBuffers(gl);// 使用缓冲区设置点的坐标信息
    if(n < 0) {
        console.log('设置顶点失败');
        return;
    }

    gl.clearColor(0.0, 0.0, 0.0, 1.0);// 设置背景色
    gl.clear(gl.COLOR_BUFFER_BIT);// 清空canvas
    gl.drawArrays(gl.POINTS, 0, n);// 绘制，一次性绘制n个点
};

/**
 * @return n 缓冲区内顶点个数
 * @return -1 缓冲区内无顶点
 * 
*/
function initVertexBuffers(gl) {
    // 类型化数组
    let vertices = new Float32Array([
        0.0, 0.5, -0.5, -0.5, 0.5, -0.5
    ]);
    let n = 3;

    // 初始化缓冲区
    let vertexBuffer = gl.createBuffer();
    if(!vertexBuffer) {
        console.log('初始化缓冲区失败');
        return -1;
    }
    // 关联缓冲区与target
    gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);// 缓冲区内存放顶点数组
    // 向target写数据（只能）
    gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW);
    // 将缓冲区对象分配给attribute变量
    let a_Position = gl.getAttribLocation(gl.program, 'a_Position');
    if(a_Position < 0) {
        console.log('获取attribute变量存储位置失败');
        return;
    }
    gl.vertexAttribPointer(a_Position, 2, gl.FLOAT, false, 0, 0);
    // 开启attribute变量
    gl.enableVertexAttribArray(a_Position);
    return n;
}