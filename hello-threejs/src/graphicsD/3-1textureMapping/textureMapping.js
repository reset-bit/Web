function init() {
    let scene, camera, renderer;
    let orbitControls, clock = new THREE.Clock();

    initScene();
    initContent();
    render();
    window.addEventListener('resize', onWindowResize, false);

    function initScene() {
        scene = new THREE.Scene();

        camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 10000);
        camera.position.set(30, 20, 50);
        camera.lookAt(new THREE.Vector3(0, 0, 0));

        renderer = new THREE.WebGLRenderer();
        renderer.setSize(window.innerWidth, window.innerHeight);
        renderer.autoClear = false;
        document.querySelector('#webgl-output').appendChild(renderer.domElement);

        orbitControls = new THREE.OrbitControls(camera);
        orbitControls.enbalePan = false; // 禁用右键拖拽
        orbitControls.enableZoom = false; // 禁用滚轮缩放
        orbitControls.keyPanSpeed = 140; // 方向键移动速度
    }

    function initContent() {
        let sphereGeometry = new THREE.SphereGeometry(1000, 50, 50);
        let sphere = new THREE.Mesh(sphereGeometry, new THREE.MeshBasicMaterial({
            map: new THREE.TextureLoader().load('./env.jpg'),
            side: THREE.BackSide
        }));
        scene.add(sphere);
    }

    function render() {
        orbitControls.update(clock.getDelta());
        renderer.render(scene, camera);
        requestAnimationFrame(render);
    }

    function onWindowResize() {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
    }
}