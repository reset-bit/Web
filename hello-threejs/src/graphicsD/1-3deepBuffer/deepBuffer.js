function init() {
    let scene, camera, renderer;
    let trackballControls, clock = new THREE.Clock();
    let controls = {
        isPlaneVisible: true,
        isCubeVisible: true
    };
    let plane, cube = new THREE.Group(),
        depthPlane, depthCube = new THREE.Group();

    initScene();
    initContent();
    initControls();
    render();
    window.addEventListener('resize', onWindowResize, false);

    function initScene() {
        scene = new THREE.Scene();

        camera = new THREE.PerspectiveCamera(45, (window.innerWidth / 2) / window.innerHeight, 0.1, 5);
        camera.position.set(0.1, 0.25, 0.2);
        camera.lookAt(scene.position);
        scene.add(camera);

        renderer = new THREE.WebGLRenderer();
        renderer.shadowMap.enabled = true;
        renderer.shadowMap.type = THREE.PCFSoftShadowMap;
        renderer.setSize(window.innerWidth, window.innerHeight);
        renderer.autoClear = false;
        document.querySelector('#webgl-output').appendChild(renderer.domElement);
    }

    function initContent() {
        // let axes = new THREE.AxesHelper(2);
        // scene.add(axes);
        let texture = new THREE.TextureLoader().load('./plane_bg.jpg');
        texture.wrapS = THREE.RepeatWrapping; // 水平方向，uv-u。将纹理简单的重复到无穷大
        texture.wrapT = THREE.RepeatWrapping; // 垂直方向，uv-v
        texture.repeat.set(6, 6); // 纹理重复次数
        // plane
        plane = new THREE.Mesh(new THREE.PlaneGeometry(1, 1), new THREE.MeshStandardMaterial({
            color: 0xffffff,
            map: texture,
            metalness: 0.6, // 金属感程度
            roughness: 1, // 粗糙程度 0-镜面反射 1-漫反射
        }));
        plane.rotation.x = -0.5 * Math.PI;
        plane.receiveShadow = true;
        scene.add(plane);
        depthPlane = new THREE.Mesh(new THREE.PlaneGeometry(1, 1), new THREE.MeshDepthMaterial({ color: 0xffffff }));
        depthPlane.rotation.x = -0.5 * Math.PI;
        scene.add(depthPlane);
        // cube
        new THREE.MTLLoader().load('./cube.mtl', material => {
            material.preload();
            let loader = new THREE.OBJLoader();
            loader.setMaterials(material);
            loader.load('./cube.obj', obj => {
                cube = obj;
                cube.castShadow = true;
                cube.scale.set(0.0003, 0.0003, 0.0003);
                cube.traverse(item => {
                    if (item.isMesh) {
                        item.castShadow = true;
                    }
                });
                scene.add(cube);
            });
        });
        new THREE.OBJLoader().load('./cube.obj', obj => {
            depthCube = obj;
            depthCube.castShadow = true;
            depthCube.scale.set(0.0003, 0.0003, 0.0003);
            depthCube.traverse(item => {
                if (item.isMesh) {
                    item.material = new THREE.MeshDepthMaterial();
                }
            });
            scene.add(depthCube);
        });

        let spotLight = new THREE.SpotLight(0xffffff, 1.2); // color intensity
        spotLight.position.set(-0.5, 0.75, 0.5);
        spotLight.castShadow = true;
        spotLight.target = cube;
        scene.add(spotLight);
    }

    function initControls() {
        trackballControls = new THREE.TrackballControls(camera, renderer.domElement);
        trackballControls.zoomSpeed = 0.8;
        trackballControls.minDistance = 0.2;
        trackballControls.maxDistance = 2;

        let gui = new dat.GUI({ autoPlace: false });
        gui.domElement.id = 'gui';
        document.querySelector('#gui-container').appendChild(gui.domElement);
        gui.add(controls, 'isPlaneVisible')
            .onChange(value => {
                if (!value && !controls.isCubeVisible) {
                    controls.isPlaneVisible = true;
                }
            })
            .name('地面');
        gui.add(controls, 'isCubeVisible')
            .onChange(value => {
                if (!value && !controls.isPlaneVisible) {
                    controls.isCubeVisible = true;
                }
            })
            .name('立方体');
    }

    function render() {
        let delta = clock.getDelta();
        trackballControls.update(delta);

        // left - frame buffer
        plane.visible = controls.isPlaneVisible;
        cube.visible = controls.isCubeVisible;
        depthPlane.visible = controls.isPlaneVisible === false ? false : !controls.isPlaneVisible;
        depthCube.visible = controls.isCubeVisible === false ? false : !controls.isCubeVisible;
        renderer.setViewport(0, 0, window.innerWidth / 2, window.innerHeight); // x y width height
        renderer.render(scene, camera);
        // right - depth buffer
        plane.visible = controls.isPlaneVisible === false ? false : !controls.isPlaneVisible;
        cube.visible = controls.isCubeVisible === false ? false : !controls.isCubeVisible;
        depthPlane.visible = controls.isPlaneVisible;
        depthCube.visible = controls.isCubeVisible;
        renderer.setViewport(window.innerWidth / 2, 0, window.innerWidth / 2, window.innerHeight); // x y width height
        renderer.render(scene, camera);

        requestAnimationFrame(render);
    }

    function onWindowResize() {
        camera.aspect = (window.innerWidth / 2) / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
    }

}