var SEPARATION = 100, //粒子群距离视口远近
    AMOUNTX = 70, //x数量
    AMOUNTY = 50; //y数量

var container; //dom对象
var camera, scene, renderer; //场景，相机，渲染器

var particles, particle, count = 0; //粒子数组，粒子

//mouseX是DisplayObject的属性，只需鼠标移动，移到哪个可视对象的哪个位置，就得到哪个可视对象的内部坐标
var mouseX = 85,
    mouseY = -200; //-342，负数在上方

var windowHalfX = window.innerWidth / 2;
var windowHalfY = window.innerHeight / 2;

init();
animate();

function init() {
    //动态创建div并添加至body
    container = document.createElement('div');
    container.style.zIndex = -1;
    document.body.appendChild(container);

    //创建透视摄像机：视野角度 长宽比 近截面 远截面
    //当物体某些部分比摄像机的远截面远或者比近截面近的时候，该这些部分将不会被渲染到场景中。
    camera = new THREE.PerspectiveCamera(120, window.innerWidth / window.innerHeight, 1, 10000);
    camera.position.z = 1000;

    //设置场景
    scene = new THREE.Scene();

    //创建材质
    var PI2 = Math.PI * 2;
    var material = new THREE.ParticleCanvasMaterial({
        color: 0xe1e1e1,
        program: function(context) {
            context.beginPath();
            context.arc(0, 0, .6, 0, PI2, true);
            context.fill();
        }
    });

    var i = 0;
    particles = new Array(); //粒子数组，仅相对于CanvasRenderer渲染器
    for (var ix = 0; ix < AMOUNTX; ix++) {
        for (var iy = 0; iy < AMOUNTY; iy++) {
            particle = particles[i++] = new THREE.Particle(material);
            particle.position.x = ix * SEPARATION - ((AMOUNTX * SEPARATION) / 2);
            particle.position.z = iy * SEPARATION - ((AMOUNTY * SEPARATION) / 2);
            scene.add(particle); //默认情况下，当调用scene.add()的时候，物体将会被添加到(0,0,0)坐标
        }
    }

    //设置渲染器
    renderer = new THREE.CanvasRenderer();
    renderer.setSize(window.innerWidth, window.innerHeight);
    container.appendChild(renderer.domElement); //添加渲染器到dom

    //相关事件响应函数绑定
    window.addEventListener('resize', onWindowResize, false);
    // document.addEventListener('mousemove', onDocumentMouseMove, false); //鼠标移动事件
    document.addEventListener('touchstart', onDocumentTouchStart, false); //鼠标触摸事件
    document.addEventListener('touchmove', onDocumentTouchMove, false); //鼠标滑动事件，滑动连续触发
}

//window.resize响应函数
function onWindowResize() {
    windowHalfX = window.innerWidth / 2;
    windowHalfY = window.innerHeight / 2;

    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();

    renderer.setSize(window.innerWidth, window.innerHeight);
}

//document.mousemove响应函数
function onDocumentMouseMove(event) {
    mouseX = event.clientX - windowHalfX;
    mouseY = event.clientY - windowHalfY;
}

//document.touchstart响应函数
function onDocumentTouchStart(event) {
    if (event.touches.length === 1) {
        event.preventDefault(); //阻止滚动
        mouseX = event.touches[0].pageX - windowHalfX; //pageX：触摸目标在页面中的x坐标
        mouseY = event.touches[0].pageY - windowHalfY; //pageY：触摸目标在页面中的y坐标
    }

}

//document.touchmove响应函数
function onDocumentTouchMove(event) {
    if (event.touches.length === 1) {
        event.preventDefault();
        mouseX = event.touches[0].pageX - windowHalfX;
        mouseY = event.touches[0].pageY - windowHalfY;
    }
}

//渲染循环，使渲染器能够在每次屏幕刷新时，对场景进行绘制（大多数屏幕刷新频率=60次/s）
function animate() {
    requestAnimationFrame(animate); //当用户切换到其它的标签页时，它会暂停，不会浪费处理器资源，也不会损耗电池使用寿命
    render();
}

function render() {
    camera.position.x += (mouseX - camera.position.x) * .05; //控制旋转
    camera.position.y += (-mouseY - camera.position.y) * .05;
    camera.lookAt(scene.position);
    var i = 0;
    for (var ix = 0; ix < AMOUNTX; ix++) {
        for (var iy = 0; iy < AMOUNTY; iy++) {
            particle = particles[i++];
            particle.position.y = (Math.sin((ix + count) * 0.3) * 50) + (Math.sin((iy + count) * 0.5) * 50);
            particle.scale.x = particle.scale.y = (Math.sin((ix + count) * 0.3) + 1) * 2 + (Math.sin((iy + count) * 0.5) + 1) * 2;
        }
    }
    renderer.render(scene, camera); //！
    count += 0.1;
}