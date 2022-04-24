// 点光源，漫反射+环境反射，逐片元光照，匀速旋转动画
// 点光源使用位置+颜色来描述，通过位置矢量计算在顶点处的入射光方向
// 漫反射光颜色=<入射光颜色>*<表面基底色>*(<法线方向>*<入射光方向>)；环境反射光颜色=<入射光颜色>*<表面基底色>
// 顶点颜色=漫反射光颜色+环境反射光颜色

// 法向量、漫反射光、环境光、顶点世界坐标均为3维向量
const VSHADER_SOURCE = `
    attribute vec4 a_Position;// 顶点位置（齐次）
    varying vec3 v_Position;
    attribute vec4 a_Color;// 顶点颜色
    varying vec4 v_Color;
    attribute vec4 a_Normal;// 顶点法向量（齐次）
    varying vec3 v_Normal;

    uniform mat4 u_MvpMatrix;// MVP
    uniform mat4 u_ModelMatrix;
    uniform mat4 u_NormalMatrix;// 用于计算变换后顶点法向量（每个顶点对应3个法向量）

    void main() {
        gl_Position = u_MvpMatrix * a_Position;
        v_Position = vec3(u_ModelMatrix * a_Position);// 顶点世界坐标
        v_Color = a_Color;
        v_Normal = normalize(vec3(u_NormalMatrix * a_Normal));// 计算顶点法向量并归一化
    }
`;
const FSHADER_SOURCE = `
    precision mediump float;

    varying vec4 v_Color;
    varying vec3 v_Normal;
    varying vec3 v_Position;
    uniform vec3 u_LightPosition;// 漫反射光位置
    uniform vec3 u_LightColor;// 漫反射光颜色
    uniform vec3 u_AmbientLightColor;// 环境光颜色

    void main() {
        vec3 normal = normalize(v_Normal);
        vec3 lightDirection = normalize(u_LightPosition - v_Position);
        float nDotL = max(dot(lightDirection, normal), 0.0);
        
        vec3 diffuse = u_LightColor * v_Color.rgb * nDotL;// 漫反射光
        vec3 ambient = u_AmbientLightColor * v_Color.rgb;// 环境光
        gl_FragColor = vec4(diffuse + ambient, v_Color.a);
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
    gl.enable(gl.DEPTH_TEST);

    let u_ModelMatrix = gl.getUniformLocation(gl.program, 'u_ModelMatrix');
    let u_MvpMatrix = gl.getUniformLocation(gl.program, 'u_MvpMatrix');
    let u_NormalMatrix = gl.getUniformLocation(gl.program, 'u_NormalMatrix');
    let u_LightColor = gl.getUniformLocation(gl.program, 'u_LightColor');
    let u_LightPosition = gl.getUniformLocation(gl.program, 'u_LightPosition');
    let u_AmbientLightColor = gl.getUniformLocation(gl.program, 'u_AmbientLightColor');
    if(!u_ModelMatrix || !u_MvpMatrix || !u_NormalMatrix || !u_LightColor || !u_LightPosition || !u_AmbientLightColor) {
        console.log('获取uniform变量位置信息失败');
        return;
    }
    gl.uniform3f(u_LightColor, 1.0, 1.0, 1.0);
    gl.uniform3f(u_LightPosition, 2.3, 4.0, 3.5);
    gl.uniform3f(u_AmbientLightColor, 0.2, 0.2, 0.2);
    let modelMatrix = new Matrix4();
    let mvpMatrix = new Matrix4();
    let normalMatrix = new Matrix4();
    let currentAngle = 0.0;
    let vpMatrix = new Matrix4();// MVP逆向操作：投影矩阵->视图矩阵->模型矩阵
    vpMatrix.setPerspective(30, canvas.width / canvas.clientHeight, 1, 100);
    vpMatrix.lookAt(6, 6, 14, 0, 0, 0, 0, 1, 0);
    let tick = function() {
        currentAngle = animate(currentAngle);
        
        modelMatrix.setRotate(currentAngle, 0, 1, 0);
        mvpMatrix.set(vpMatrix).multiply(modelMatrix);
        normalMatrix.setInverseOf(modelMatrix);// modelMatrix逆矩阵
        normalMatrix.transpose();// 矩阵转置
        gl.uniformMatrix4fv(u_ModelMatrix, false, modelMatrix.elements);
        gl.uniformMatrix4fv(u_MvpMatrix, false, mvpMatrix.elements);
        gl.uniformMatrix4fv(u_NormalMatrix, false, normalMatrix.elements);

        gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
        gl.drawElements(gl.TRIANGLES, n, gl.UNSIGNED_BYTE, 0);

        requestAnimationFrame(tick, canvas);
    };
    tick();
}

function initVertexBuffers(gl) {
    let vertices = new Float32Array([
        2.0, 2.0, 2.0,  -2.0, 2.0, 2.0,  -2.0,-2.0, 2.0,   2.0,-2.0, 2.0, // v0-v1-v2-v3 front
        2.0, 2.0, 2.0,   2.0,-2.0, 2.0,   2.0,-2.0,-2.0,   2.0, 2.0,-2.0, // v0-v3-v4-v5 right
        2.0, 2.0, 2.0,   2.0, 2.0,-2.0,  -2.0, 2.0,-2.0,  -2.0, 2.0, 2.0, // v0-v5-v6-v1 up
       -2.0, 2.0, 2.0,  -2.0, 2.0,-2.0,  -2.0,-2.0,-2.0,  -2.0,-2.0, 2.0, // v1-v6-v7-v2 left
       -2.0,-2.0,-2.0,   2.0,-2.0,-2.0,   2.0,-2.0, 2.0,  -2.0,-2.0, 2.0, // v7-v4-v3-v2 down
        2.0,-2.0,-2.0,  -2.0,-2.0,-2.0,  -2.0, 2.0,-2.0,   2.0, 2.0,-2.0  // v4-v7-v6-v5 back
    ]);
    let colors = new Float32Array([
        1, 0, 0,   1, 0, 0,   1, 0, 0,  1, 0, 0,     // v0-v1-v2-v3 front
        1, 0, 0,   1, 0, 0,   1, 0, 0,  1, 0, 0,     // v0-v3-v4-v5 right
        1, 0, 0,   1, 0, 0,   1, 0, 0,  1, 0, 0,     // v0-v5-v6-v1 up
        1, 0, 0,   1, 0, 0,   1, 0, 0,  1, 0, 0,     // v1-v6-v7-v2 left
        1, 0, 0,   1, 0, 0,   1, 0, 0,  1, 0, 0,     // v7-v4-v3-v2 down
        1, 0, 0,   1, 0, 0,   1, 0, 0,  1, 0, 0　    // v4-v7-v6-v5 back
    ]);
    let indices = new Uint8Array([
        0, 1, 2,   0, 2, 3,    // front
        4, 5, 6,   4, 6, 7,    // right
        8, 9,10,   8,10,11,    // up
       12,13,14,  12,14,15,    // left
       16,17,18,  16,18,19,    // down
       20,21,22,  20,22,23     // back
    ]);
    let normals = new Float32Array([
        0.0, 0.0, 1.0,   0.0, 0.0, 1.0,   0.0, 0.0, 1.0,   0.0, 0.0, 1.0,  // v0-v1-v2-v3 front
        1.0, 0.0, 0.0,   1.0, 0.0, 0.0,   1.0, 0.0, 0.0,   1.0, 0.0, 0.0,  // v0-v3-v4-v5 right
        0.0, 1.0, 0.0,   0.0, 1.0, 0.0,   0.0, 1.0, 0.0,   0.0, 1.0, 0.0,  // v0-v5-v6-v1 up
       -1.0, 0.0, 0.0,  -1.0, 0.0, 0.0,  -1.0, 0.0, 0.0,  -1.0, 0.0, 0.0,  // v1-v6-v7-v2 left
        0.0,-1.0, 0.0,   0.0,-1.0, 0.0,   0.0,-1.0, 0.0,   0.0,-1.0, 0.0,  // v7-v4-v3-v2 down
        0.0, 0.0,-1.0,   0.0, 0.0,-1.0,   0.0, 0.0,-1.0,   0.0, 0.0,-1.0   // v4-v7-v6-v5 back
    ]);

    let indexBuffer = gl.createBuffer();
    if(!indexBuffer) {
        console.log('初始化缓冲区失败');
        return;
    }
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexBuffer);
    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, indices, gl.STATIC_DRAW);
    if(!initArrayBuffer(gl, vertices, 3, gl.FLOAT, 'a_Position')) { return; }
    if(!initArrayBuffer(gl, colors, 3, gl.FLOAT, 'a_Color')) { return; }
    if(!initArrayBuffer(gl, normals, 3, gl.FLOAT, 'a_Normal')) { return; }
    return indices.length;
}
function initArrayBuffer(gl, data, num, type, attribute) {
    let dataBuffer = gl.createBuffer();
    if(!dataBuffer) {
        console.log('初始化缓冲区失败');
        return;
    }
    gl.bindBuffer(gl.ARRAY_BUFFER, dataBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, data, gl.STATIC_DRAW);

    let a_Attribute = gl.getAttribLocation(gl.program, attribute);
    if(a_Attribute < 0) {
        console.log('获取attribute变量位置信息失败');
        return;
    }
    gl.vertexAttribPointer(a_Attribute, num, type, false, 0, 0);
    gl.enableVertexAttribArray(a_Attribute);
    return true;
}
// 动画：得到当前动画与上次动画之间的差值，乘需要旋转的角度，除1000化为度/秒
const ANGLE_STEP = 30.0;
var g_last = Date.now();
function animate(angle) {
    let now = Date.now();// 毫秒
    let elapsed = now - g_last;
    g_last = now;
    let newAngle = angle + (ANGLE_STEP * elapsed) / 1000.0;
    return newAngle %= 360;
}