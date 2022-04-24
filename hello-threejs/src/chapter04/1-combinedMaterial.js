function init() {
    let scene = new THREE.Scene();
    let camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 35, 150);
    camera.position.set(-50, 40, 50);
    camera.lookAt(scene.position);
    let renderer = new THREE.WebGLRenderer();
    // 设置渲染器阴影
    renderer.shadowMap.enabled = true;
    renderer.shadowMapSoft = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    renderer.setClearColor(new THREE.Color('#000000'));
    renderer.setSize(window.innerWidth, window.innerHeight);
    document.getElementById("webgl-output").appendChild(renderer.domElement);

    let controls = new function() {
        this.cameraNear = camera.near;
        this.cameraFar = camera.far;
        this.rotationSpeed = 0.02;
        this.color = '#00ff00';
        this.numberOfObjects = scene.children.length;

        this.removeCube = function() {
            let allChildren = scene.children;
            let lastChildren = allChildren[allChildren.length - 1];
            if (lastChildren instanceof THREE.Group) {
                scene.remove(lastChildren);
                this.numberOfObjects = scene.children.length;
            }
        };
        this.addCube = function() {
            let cubeSize = Math.ceil(3 + (Math.random() * 3)); // 随机指定大小
            let cubeGeometry = new THREE.BoxGeometry(cubeSize, cubeSize, cubeSize);
            // 联合材质
            let cubeMaterial = new THREE.MeshDepthMaterial();
            let colorMaterial = new THREE.MeshBasicMaterial({
                color: controls.color, // 指定颜色
                transparent: true, // 设为true将检查blending
                blending: THREE.MultiplyBlending // 融合模式
            });
            let cube = new THREE.SceneUtils.createMultiMaterialObject(cubeGeometry, [colorMaterial, cubeMaterial]); // 返回网格组
            cube.children[1].scale.set(0.99, 0.99, 0.99);
            cube.castShadow = true;
            // 随机指定位置
            cube.position.x = -60 + Math.round((Math.random() * 100));;
            cube.position.y = Math.round((Math.random() * 10));
            cube.position.z = -100 + Math.round((Math.random() * 150));

            scene.add(cube);
            this.numberOfObjects = scene.children.length;
        };
    };

    let gui = new dat.GUI();
    gui.add(controls, 'addCube');
    gui.add(controls, 'removeCube');
    gui.add(controls, 'cameraNear', 0, 50).onChange(e => {
        camera.near = e;
        camera.updateProjectionMatrix();
    });
    gui.add(controls, 'cameraFar', 50, 200).onChange(e => {
        camera.far = e;
        camera.updateProjectionMatrix();
    });

    for (let i = 0; i < 10; i++) {
        controls.addCube();
    }
    render();

    function render() {
        // 遍历scene元素，若为cube则旋转（当前场景仅有一个组）
        scene.traverse(e => {
            if (e instanceof THREE.Group) {
                e.rotation.x += controls.rotationSpeed;
                e.rotation.y += controls.rotationSpeed;
                e.rotation.z += controls.rotationSpeed;
            }
        });
        requestAnimationFrame(render);
        renderer.render(scene, camera);
    };
}