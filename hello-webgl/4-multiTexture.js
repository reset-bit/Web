// 贴图（多纹理 promise版）
const VSHADER_SOURCE = `
    attribute vec4 a_Position;
    attribute vec2 a_TexCoord;
    varying vec2 v_TexCoord;
    void main() {
        gl_Position = a_Position;
        v_TexCoord = a_TexCoord;
    }
`;
// 使用二维纹理gl.TEXTURE_2D，所以uniform变量类型为sampler2D
// 使用两个纹素计算最终的片元颜色，有多重方法，这里使用颜色矢量的分量乘法
// 逐片元调用：texture2D参数纹理单元+纹理坐标
const FSHADER_SOURCE = `
    precision mediump float;
    uniform sampler2D u_Sampler0;
    uniform sampler2D u_Sampler1;
    varying vec2 v_TexCoord;
    void main() {
        vec4 color0 = texture2D(u_Sampler0, v_TexCoord);
        vec4 color1 = texture2D(u_Sampler1, v_TexCoord);
        gl_FragColor = color0 * color1;
    }
`;

window.onload = function() {
    let canvas = document.querySelector('canvas#webgl');
    let gl = getWebGLContext(canvas);
    if(!gl) {
        console.log('初始化webGL上下文失败，您的浏览器可能不支持webGL');
        return;
    }
    if(!initShaders(gl, VSHADER_SOURCE, FSHADER_SOURCE)) {
        console.log('初始化着色器失败');
        return;
    }
    let n = initVertexBuffers(gl);
    if(n < 0) {
        console.log('初始化顶点信息失败');
        return;
    }
    gl.clearColor(0.0, 0.0, 0.0, 1.0);
    if(!initTextures(gl, n)) {
        console.log('初始化纹理失败');
        return;
    }
}

// 缓冲区
function initVertexBuffers(gl) {
    let n = 4;
    let verticesTexCoords = new Float32Array([
        -0.5, 0.5, 0.0, 1.0,
        -0.5, -0.5, 0.0, 0.0,
        0.5, 0.5, 1.0, 1.0,
        0.5, -0.5, 1.0, 0.0
    ]);

    let vertexTexCoordBuffer = gl.createBuffer();
    if(!vertexTexCoordBuffer) {
        console.log('建立缓冲区对象失败');
        return;
    }
    gl.bindBuffer(gl.ARRAY_BUFFER, vertexTexCoordBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, verticesTexCoords, gl.STATIC_DRAW);

    const FSIZE = verticesTexCoords.BYTES_PER_ELEMENT;
    let a_Position = gl.getAttribLocation(gl.program, 'a_Position');
    if(a_Position < 0) {
        console.log('获取attribute变量（顶点坐标）位置信息失败');
        return;
    }
    gl.vertexAttribPointer(a_Position, 2, gl.FLOAT, false, FSIZE * 4, 0);
    gl.enableVertexAttribArray(a_Position);
    let a_TexCoord = gl.getAttribLocation(gl.program, 'a_TexCoord');
    if(a_TexCoord < 0) {
        console.log('获取attribute变量（纹理坐标）位置信息失败');
        return;
    }
    gl.vertexAttribPointer(a_TexCoord, 2, gl.FLOAT, false, FSIZE * 4, FSIZE * 2);
    gl.enableVertexAttribArray(a_TexCoord);

    return n;
}
// 纹理
// 创建纹理与图片对象，并在图片加载回调函数中将纹理单元号传递给着色器
// （使用对象操作图片 or 缓冲区）
function initTextures(gl, n) {
    let texture0 = gl.createTexture();
    let texture1 = gl.createTexture();
    if(!texture0 || !texture1) {
        console.log('创建纹理对象失败');
        return;
    }
    let u_Sampler0 = gl.getUniformLocation(gl.program, 'u_Sampler0');
    let u_Sampler1 = gl.getUniformLocation(gl.program, 'u_Sampler1');
    if(!u_Sampler0 || !u_Sampler1) {
        console.log('获取uniform变量位置信息失败');
        return;
    }
    // 图片加载完成->设置纹理信息->绘制
    let p0 = loadImg('resources/sky.jpg');
    p0.then((image) => {
        loadTexture(gl, texture0, u_Sampler0, image, 0);
    });
    let p1 = loadImg('resources/circle.gif');
    p1.then((image) => {
        loadTexture(gl, texture1, u_Sampler1, image, 1);
    });
    Promise.all([p0, p1]).then(() => {
        gl.drawArrays(gl.TRIANGLE_STRIP, 0, n);
    });
    return true;
}
// 加载图片，加载成功后返回promise
function loadImg(url) {
    let image = new Image();
    image.src = url;
    return new Promise((resolve, reject) => {
        image.onload = () => { resolve(image); }
    });
}
// 等待图片加载到纹理单元后设置纹理信息，并将纹理单元号传递给着色器
function loadTexture(gl, texture, u_Sampler, image, texUnit) {
    // 翻转y轴（纹理坐标系为st坐标系，原点左下；图片坐标系原点左上）
    gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, 1);

    // 激活对应纹理单元（对应一张图像，通过操作纹理单元来控制纹理图像）
    texUnit === 0 ? gl.activeTexture(gl.TEXTURE0) : gl.activeTexture(gl.TEXTURE1);
    // 绑定纹理对象与纹理单元
    gl.bindTexture(gl.TEXTURE_2D, texture);
    // 设置纹理对象参数：纹理缩小
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
    // 分配纹理图像给纹理对象--bug webGL error INVAILD_VALUE
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, image);
    // 为uniform变量赋值（将纹理单元号传给着色器）
    gl.uniform1i(u_Sampler, texUnit);

    gl.clear(gl.COLOR_BUFFER_BIT);
}