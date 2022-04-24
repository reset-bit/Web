function init() {
    // 定义场景、摄像机、着色器
    let scene = new THREE.Scene();
    let camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 1000); // 视场、长宽比、近面距离、远面距离
    let renderer = new THREE.WebGLRenderer();
    renderer.setClearColor(new THREE.Color(0x000)); // 背景色
    renderer.setSize(window.innerWidth, window.innerHeight); // 场景大小

    // 创建坐标轴对象
    let axes = new THREE.AxesHelper(20); // 轴线粗细20
    scene.add(axes);

    // 创建平面、方块、球
    let planeGeometry = new THREE.PlaneGeometry(60, 20);
    let planeMaterial = new THREE.MeshBasicMaterial({ color: 0xAAAAAA });
    let plane = new THREE.Mesh(planeGeometry, planeMaterial);
    plane.rotation.x = -0.5 * Math.PI;
    plane.position.set(15, 0, 0);
    scene.add(plane);
    let cubeGeometry = new THREE.BoxGeometry(4, 4, 4);
    let cubeMaterial = new THREE.MeshBasicMaterial({
        color: 0xFF0000,
        wireframe: true // 开启线框模式
    });
    let cube = new THREE.Mesh(cubeGeometry, cubeMaterial);
    cube.position.set(-4, 3, 0);
    scene.add(cube);
    let sphereGeometry = new THREE.SphereGeometry(4, 20, 20);
    let sphereMaterial = new THREE.MeshBasicMaterial({
        color: 0x7777FF,
        wireframe: true
    });
    let sphere = new THREE.Mesh(sphereGeometry, sphereMaterial);
    sphere.position.set(20, 4, 2);
    scene.add(sphere);

    // 设置摄像机
    camera.position.set(-30, 40, 30);
    camera.lookAt(scene.position); // 默认状态下指向(0, 0, 0)

    // 添加至dom
    document.querySelector('.webgl-output').appendChild(renderer.domElement);
    renderer.render(scene, camera);
}