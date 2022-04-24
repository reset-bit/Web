// 复杂关节层次模型
// mvp模型 环境光 透视投影
// 在draw()中做平移旋转等准备工作，在drawCube()中改变mvpMatrix并赋值给uniform变量进行绘制
const VSHADER_SOURCE = `
    attribute vec4 a_Position;
    attribute vec4 a_Normal;
    varying vec4 v_Color;
    uniform mat4 u_MvpMatrix;
    uniform mat4 u_NormalMatrix;
    void main() {
        gl_Position = u_MvpMatrix * a_Position;
        vec3 lightDirection = normalize(vec3(0.0, 0.5, 0.7));
        vec4 color = vec4(1.0, 0.4, 0.0, 1.0);// 表面固有色在此手动设置
        vec3 normal = normalize((u_NormalMatrix * a_Normal).xyz);// 计算变化后法向量并归一化
        float nDotL = max(dot(normal, lightDirection), 0.0);
        v_Color = vec4(color.rgb * nDotL + vec3(0.1), color.a);
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
        console.log('初始化webGL上下文失败，您的浏览器可能不支持webGL上下文');
        return;
    }
    if(!initShaders(gl, VSHADER_SOURCE, FSHADER_SOURCE)) {
        console.log('初始化着色器失败');
        return;
    }
    let n = initVertexBuffers(gl);
    if(n < 0) {
        console.log('设置顶点位置信息失败');
        return;
    }
    gl.clearColor(0.0, 0.0, 0.0, 1.0);
    gl.enable(gl.DEPTH_TEST);

    let u_MvpMatrix = gl.getUniformLocation(gl.program, 'u_MvpMatrix');
    let u_NormalMatrix = gl.getUniformLocation(gl.program, 'u_NormalMatrix');
    if(!u_MvpMatrix || !u_NormalMatrix) {
        console.log('获取uniform变量位置信息失败');
        return;
    }
    let viewProjMatrix = new Matrix4();
    viewProjMatrix.setPerspective(50.0, canvas.width / canvas.height, 1.0, 100.0);
    viewProjMatrix.lookAt(20.0, 10.0, 30.0, 0.0, 0.0, 0.0, 0.0, 1.0, 0.0);

    document.onkeydown = function(e) { keyDown(e, gl, n, viewProjMatrix, u_MvpMatrix, u_NormalMatrix); }
    draw(gl, n, viewProjMatrix, u_MvpMatrix, u_NormalMatrix);
}

function initVertexBuffers(gl) {
    let vertices = new Float32Array([
        0.5, 1.0, 0.5, -0.5, 1.0, 0.5, -0.5, 0.0, 0.5,  0.5, 0.0, 0.5, // v0-v1-v2-v3 front
        0.5, 1.0, 0.5,  0.5, 0.0, 0.5,  0.5, 0.0,-0.5,  0.5, 1.0,-0.5, // v0-v3-v4-v5 right
        0.5, 1.0, 0.5,  0.5, 1.0,-0.5, -0.5, 1.0,-0.5, -0.5, 1.0, 0.5, // v0-v5-v6-v1 up
       -0.5, 1.0, 0.5, -0.5, 1.0,-0.5, -0.5, 0.0,-0.5, -0.5, 0.0, 0.5, // v1-v6-v7-v2 left
       -0.5, 0.0,-0.5,  0.5, 0.0,-0.5,  0.5, 0.0, 0.5, -0.5, 0.0, 0.5, // v7-v4-v3-v2 down
        0.5, 0.0,-0.5, -0.5, 0.0,-0.5, -0.5, 1.0,-0.5,  0.5, 1.0,-0.5  // v4-v7-v6-v5 back
    ]);
    let normals = new Float32Array([
        0.0, 0.0, 1.0,  0.0, 0.0, 1.0,  0.0, 0.0, 1.0,  0.0, 0.0, 1.0, // v0-v1-v2-v3 front
        1.0, 0.0, 0.0,  1.0, 0.0, 0.0,  1.0, 0.0, 0.0,  1.0, 0.0, 0.0, // v0-v3-v4-v5 right
        0.0, 1.0, 0.0,  0.0, 1.0, 0.0,  0.0, 1.0, 0.0,  0.0, 1.0, 0.0, // v0-v5-v6-v1 up
       -1.0, 0.0, 0.0, -1.0, 0.0, 0.0, -1.0, 0.0, 0.0, -1.0, 0.0, 0.0, // v1-v6-v7-v2 left
        0.0,-1.0, 0.0,  0.0,-1.0, 0.0,  0.0,-1.0, 0.0,  0.0,-1.0, 0.0, // v7-v4-v3-v2 down
        0.0, 0.0,-1.0,  0.0, 0.0,-1.0,  0.0, 0.0,-1.0,  0.0, 0.0,-1.0  // v4-v7-v6-v5 back
    ]);
    let indices = new Uint8Array([
        0, 1, 2,   0, 2, 3,    // front
        4, 5, 6,   4, 6, 7,    // right
        8, 9,10,   8,10,11,    // up
       12,13,14,  12,14,15,    // left
       16,17,18,  16,18,19,    // down
       20,21,22,  20,22,23     // back
    ]);

    if(!initArrayBuffer(gl, vertices, 3, gl.FLOAT, 'a_Position')) { return; }
    if(!initArrayBuffer(gl, normals, 3, gl.FLOAT, 'a_Normal')) { return; }
    gl.bindBuffer(gl.ARRAY_BUFFER, null);

    let indexBuffer = gl.createBuffer();
    if(!indexBuffer) {
        console.log('初始化缓冲区失败');
        return;
    }
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexBuffer);
    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, indices, gl.STATIC_DRAW);

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

const ANGLE_STEP = 4.0;
var g_arm1Angle = 90.0;// 大臂
var g_joint1Angle = 45.0;// 小臂
var g_joint2Angle = 0.0;// 手掌
var g_joint3Angle = 0.0;// 手指
function keyDown(e, gl, n, viewProjMatrix, u_MvpMatrix, u_NormalMatrix) {
    switch(e.keyCode) {
        case 40:// ↑
            g_joint1Angle += (g_joint1Angle < 135.0 ? ANGLE_STEP : 0);
            break;
        case 38:// ↓
            g_joint1Angle -= (g_joint1Angle > -135.0 ? ANGLE_STEP : 0);
            break;
        case 39:// ←
            g_arm1Angle = (g_arm1Angle + ANGLE_STEP) % 360;
            break;
        case 37:// →
            g_arm1Angle = (g_arm1Angle - ANGLE_STEP) % 360;
            break;
        case 90:// z
            g_joint2Angle = (g_joint2Angle + ANGLE_STEP) % 360;
            break;
        case 88:// x
            g_joint2Angle = (g_joint2Angle - ANGLE_STEP) % 360;
            break;
        case 86:// c
            if(g_joint3Angle < 60.0) { g_joint3Angle = (g_joint3Angle + ANGLE_STEP) % 360; }
            break;
        case 67:// v
            if(g_joint3Angle > -60.0) { g_joint3Angle = (g_joint3Angle - ANGLE_STEP) % 360; }
            break;
        default:
            return;
    }
    draw(gl, n, viewProjMatrix, u_MvpMatrix, u_NormalMatrix);
}
var g_modelMatrix = new Matrix4(), g_mvpMatrix = new Matrix4(), g_normalMatrix = new Matrix4();
// 绘制
function draw(gl, n, viewProjMatrix, u_MvpMatrix, u_NormalMatrix) {
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
    
    // 底座
    let baseHeight = 2.0;
    g_modelMatrix.setTranslate(0.0, -12.0, 0.0);
    drawBox(gl, n, 10.0, baseHeight, 10.0, viewProjMatrix, u_MvpMatrix, u_NormalMatrix);
    // arm1 大臂
    let arm1Length = 10.0;
    g_modelMatrix.translate(0.0, baseHeight, 0.0);// 在base终止位置处平移
    g_modelMatrix.rotate(g_arm1Angle, 0.0, 1.0, 0.0);
    drawBox(gl, n, 3.0, arm1Length, 3.0, viewProjMatrix, u_MvpMatrix, u_NormalMatrix);
    // arm2 小臂
    let arm2Length = 10.0;
    g_modelMatrix.translate(0.0, arm1Length, 0.0);
    g_modelMatrix.rotate(g_joint1Angle, 0.0, 0.0, 1.0);
    drawBox(gl, n, 4.0, arm2Length, 4.0, viewProjMatrix, u_MvpMatrix, u_NormalMatrix);
    // palm 手掌
    let palmLength = 2.0;
    g_modelMatrix.translate(0.0, arm2Length, 0.0);
    g_modelMatrix.rotate(g_joint2Angle, 0.0, 1.0, 0.0);
    drawBox(gl, n, 2.0, palmLength, 6.0, viewProjMatrix, u_MvpMatrix, u_NormalMatrix);
    // finger 手指
    // 使用数组代替栈，用来保存对每个finger皆适用的modelMatrix
    g_modelMatrix.translate(0.0, palmLength, 0.0);
    pushMatrix(g_modelMatrix);
    g_modelMatrix.translate(0.0, 0.0, 2.0);
    g_modelMatrix.rotate(g_joint3Angle, 1.0, 0.0, 0.0);
    drawBox(gl, n, 1.0, 2.0, 1.0, viewProjMatrix, u_MvpMatrix, u_NormalMatrix);
    g_modelMatrix = popMatrix();
    g_modelMatrix.translate(0.0, 0.0, -2.0);
    g_modelMatrix.rotate(g_joint3Angle, 1.0, 0.0, 0.0);
    drawBox(gl, n, 1.0, 2.0, 1.0, viewProjMatrix, u_MvpMatrix, u_NormalMatrix);
}
var g_matrixStack = [];
function pushMatrix(m) {
    g_matrixStack.push(new Matrix4(m));
}
function popMatrix() {
    return g_matrixStack.pop();
}
// 绘制单个长方体
function drawBox(gl, n, width, height, depth, viewProjMatrix, u_MvpMatrix, u_NormalMatrix) {
    pushMatrix(g_modelMatrix);
    g_modelMatrix.scale(width, height, depth);
    // mvp
    g_mvpMatrix.set(viewProjMatrix);
    g_mvpMatrix.multiply(g_modelMatrix);
    gl.uniformMatrix4fv(u_MvpMatrix, false, g_mvpMatrix.elements);
    // normal
    g_normalMatrix.setInverseOf(g_modelMatrix);
    g_normalMatrix.transpose();
    gl.uniformMatrix4fv(u_NormalMatrix, false, g_normalMatrix.elements);

    gl.drawElements(gl.TRIANGLES, n, gl.UNSIGNED_BYTE, 0);
    g_modelMatrix = popMatrix();
}