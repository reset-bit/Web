function init() {
    let stats = initStats(); // 初始化帧统计模块

    let scene = new THREE.Scene();
    let camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 1000);
    let renderer = new THREE.WebGLRenderer();
    renderer.setClearColor(new THREE.Color(0x000));
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.shadowMap.enabled = true; // 需要阴影效果

    let planeGeometry = new THREE.PlaneGeometry(60, 20);
    let planeMaterial = new THREE.MeshLambertMaterial({ color: 0xffffff });
    let plane = new THREE.Mesh(planeGeometry, planeMaterial);
    plane.rotation.x = -0.5 * Math.PI;
    plane.position.set(15, 0, 0);
    plane.receiveShadow = true; // 接收阴影
    scene.add(plane);
    let cubeGeometry = new THREE.BoxGeometry(4, 4, 4);
    let cubeMaterial = new THREE.MeshLambertMaterial({ color: 0xff0000 });
    let cube = new THREE.Mesh(cubeGeometry, cubeMaterial);
    cube.position.set(-4, 4, 0);
    cube.castShadow = true; // 投射阴影
    scene.add(cube);
    let sphereGeometry = new THREE.SphereGeometry(4, 20, 20);
    let sphereMaterial = new THREE.MeshLambertMaterial({ color: 0x7777ff });
    let sphere = new THREE.Mesh(sphereGeometry, sphereMaterial);
    sphere.position.set(20, 0, 2);
    sphere.castShadow = true; // 投射阴影
    scene.add(sphere);

    // 相机
    camera.position.set(-30, 40, 30);
    camera.lookAt(scene.position);

    // 聚光灯光源
    let spotLight = new THREE.SpotLight(0xffffff);
    spotLight.position.set(-10, 20, -5);
    spotLight.castShadow = true; // 产生阴影
    // spotLight.shadow.mapSize = new THREE.Vector2(1024, 1024);
    // spotLight.shadow.camera.far = 130;
    // spotLight.shadow.camera.near = 40;
    scene.add(spotLight);
    // 环境光
    let ambientLight = new THREE.AmbientLight(0x353535);
    scene.add(ambientLight);

    document.querySelector('.webgl-output').appendChild(renderer.domElement);
    renderer.render(scene, camera);


    // 鼠标控制页面
    let trackballControls = initTrackballControls(camera, renderer);
    let clock = new THREE.Clock();

    // 动画
    let step = 0; // 弹跳速度
    renderScene();

    function renderScene() {
        stats.update(); // 更新帧数统计模块
        trackballControls.update(clock.getDelta()); // 更新鼠标控制模块

        cube.rotation.x += 0.02;
        cube.rotation.y += 0.02;
        cube.rotation.z += 0.02;
        step += 0.04;
        sphere.position.x = 20 + (10 * (Math.cos(step)));
        sphere.position.y = 2 + (10 * Math.abs(Math.sin(step)));

        requestAnimationFrame(renderScene);
        renderer.render(scene, camera);
    }

    // GUI
    let controls = new function() {
        this.rotationSpeed = 0.02;
        this.bouncingSpeed = 0.03;
    }
    let gui = new dat.GUI();
    gui.add(controls, 'rotationSpeed', 0, 0.5);
    gui.add(controls, 'bouncingSpeed', 0, 0.5);

    // 自适应窗口大小
    window.addEventListener('resize', onResize, false);

    function onResize() {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
    }
}