function init() {
    let scene = new THREE.Scene();
    let camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.set(-30, 40, 30);
    camera.lookAt(scene.position);
    let renderer = new THREE.WebGLRenderer();
    renderer.shadowMap.enabled = true;
    renderer.shadowMapSoft = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    renderer.setClearColor(new THREE.Color('#000000'));
    renderer.setSize(window.innerWidth, window.innerHeight);
    document.querySelector('#webgl-output').appendChild(renderer.domElement);

    let spotLight = new THREE.SpotLight('#ffffff');
    spotLight.position.set(-40, 60, -10);
    spotLight.castShadow = true;
    scene.add(spotLight);

    // 3*3立方体相同着色
    let group = new THREE.Mesh(); // 网格组
    let mats = [];
    ['#009e60', '#0051ba', '#ffd500', '#ff5800', '#c41e3a', '#ffffff'].forEach(c => {
        mats.push(new THREE.MeshBasicMaterial({ color: c }));
    });
    for (let x = 0; x < 3; x++) {
        for (let y = 0; y < 3; y++) {
            for (let z = 0; z < 3; z++) {
                let cubeGeometry = new THREE.BoxGeometry(2.9, 2.9, 2.9);
                let cube = new THREE.Mesh(cubeGeometry, mats);
                cube.position.set(x * 3 - 3, y * 3 - 3, z * 3 - 3); // 确保放在中心点周围
                group.add(cube);
            }
        }
    }
    group.scale.copy(new THREE.Vector3(2, 2, 2)); // 设置整组缩放大小
    scene.add(group);

    let step = 0;
    render();

    function render() {
        group.rotation.y = (step += 0.01);
        group.rotation.z = (step -= 0.01);
        group.rotation.x = (step += 0.01);

        requestAnimationFrame(render);
        renderer.render(scene, camera);
    };
}