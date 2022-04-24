function init() {
    let stats = initStats();

    let scene = new THREE.Scene();
    let camera = initCamera();
    let renderer = initRenderer();

    let { plane, cube, sphere, ambientLight } = initScene(scene);
    // 可控制聚光灯光源
    let spotLight = new THREE.SpotLight('#ffffff');
    spotLight.position.set(-40, 60, -10);
    spotLight.castShadow = true;
    spotLight.shadow.camera.near = 1; // 投影近点
    spotLight.shadow.camera.far = 100; // 投影远点
    spotLight.shadow.camera.fov = 120; // 投影视场
    spotLight.target = plane;
    spotLight.distance = 0; // 光源照射距离
    spotLight.angle = 0.4; // 光束宽度
    scene.add(spotLight);
    // 可控制点光源
    let pointLight = new THREE.PointLight('#f5d800');
    pointLight.decay = 1; // 衰减
    pointLight.castShadow = true;
    scene.add(pointLight);

    // 辅助线（默认不添加）
    let debugCamera = new THREE.CameraHelper(spotLight.shadow.camera); // 聚光灯相机
    let debugSpotLight = new THREE.SpotLightHelper(spotLight); // 聚光灯光源 形状与朝向
    let debugPointLight = new THREE.PointLightHelper(pointLight);
    // 光源标注点-聚光灯
    let sphereSpotLightGeometry = new THREE.SphereGeometry(0.5);
    let sphereSpotLightMaterial = new THREE.MeshBasicMaterial({ color: 0xffffff });
    let sphereSpotLight = new THREE.Mesh(sphereSpotLightGeometry, sphereSpotLightMaterial);
    sphereSpotLight.position = new THREE.Vector3(3, 20, 3);
    scene.add(sphereSpotLight);
    // 光源标注点-点光源
    let spherePointLightGeometry = new THREE.SphereGeometry(0.4);
    let spherePointLightMaterial = new THREE.MeshBasicMaterial({ color: 0xac6c25 });
    let spherePointLight = new THREE.Mesh(spherePointLightGeometry, spherePointLightMaterial);
    spherePointLight.position = new THREE.Vector3(3, 10, 5);
    scene.add(spherePointLight);

    // 鼠标控制页面
    let trackballControls = initTrackballControls(camera, renderer);
    let clock = new THREE.Clock();
    // 动画
    let step = 0;
    let invert = 1;
    let phase = 0;
    let controls = setupControls();
    render();

    function render() {
        stats.update();
        trackballControls.update(clock.getDelta());

        cube.rotation.x += controls.rotationSpeed;
        cube.rotation.y += controls.rotationSpeed;
        cube.rotation.z += controls.rotationSpeed;
        step += controls.bouncingSpeed;
        sphere.position.x = 20 + (10 * (Math.cos(step)));
        sphere.position.y = 2 + (10 * Math.abs(Math.sin(step)));

        if (!controls.stopMovingSpotLight || !controls.stopMovingPointLight) {
            if (phase > 2 * Math.PI) {
                invert = invert * -1;
                phase -= 2 * Math.PI;
            } else {
                phase += controls.rotationSpeed;
            }

            if (!controls.stopMovingSpotLight) {
                sphereSpotLight.position.z = +(7 * (Math.sin(phase)));
                sphereSpotLight.position.x = +(14 * (Math.cos(phase)));
                sphereSpotLight.position.y = 15;

                if (invert < 0) {
                    var pivot = 14;
                    sphereSpotLight.position.x = (invert * (sphereSpotLight.position.x - pivot)) + pivot;
                }
                spotLight.position.copy(sphereSpotLight.position);
            }
            if (!controls.stopMovingPointLight) {
                spherePointLight.position.z = +(25 * (Math.sin(phase)));
                spherePointLight.position.x = +(14 * (Math.cos(phase)));
                spherePointLight.position.y = 5;

                if (invert < 0) {
                    var pivot = 14;
                    spherePointLight.position.x = (invert * (spherePointLight.position.x - pivot)) + pivot;
                }
                pointLight.position.copy(spherePointLight.position);
            }
        }
        debugSpotLight.update();
        debugPointLight.update();
        requestAnimationFrame(render);
        renderer.render(scene, camera);
    }

    function setupControls() {
        let controls = new function() {
            this.rotationSpeed = 0.03;
            this.bouncingSpeed = 0.03;

            this.ambientColor = '#000000';
            this.spotColor = spotLight.color.getStyle();
            this.pointColor = '#f5d800';
            this.angle = 0.1;
            this.intensity = 1;
            this.penumbra = 0; // 半影区
            this.distance = 0;
            this.target = "Plane";
            this.spotLightDebug = false;
            this.pointLightDebug = false;
            this.shadowDebug = false;
            this.castShadow = true;
            this.stopMovingSpotLight = false;
            this.stopMovingPointLight = false;
        }

        let gui = new dat.GUI();
        gui.addColor(controls, 'ambientColor').onChange(function(e) {
            ambientLight.color = new THREE.Color(e);
        })
        gui.addColor(controls, 'spotColor').onChange(function(e) {
            spotLight.color = new THREE.Color(e);
        });
        gui.addColor(controls, 'pointColor').onChange(function(e) {
            pointLight.color = new THREE.Color(e);
        });
        gui.add(controls, 'angle', 0, Math.PI * 2).onChange(function(e) {
            spotLight.angle = e;
        });
        gui.add(controls, 'intensity', 0, 5).onChange(function(e) {
            spotLight.intensity = e;
        });
        gui.add(controls, 'penumbra', 0, 1).onChange(function(e) {
            spotLight.penumbra = e;
        });
        gui.add(controls, 'distance', 0, 200).onChange(function(e) {
            spotLight.distance = e;
        });
        gui.add(controls, 'target', ['Plane', 'Sphere', 'Cube']).onChange(function(e) {
            switch (e) {
                case "Plane":
                    spotLight.target = plane;
                    break;
                case "Sphere":
                    spotLight.target = sphere;
                    break;
                case "Cube":
                    spotLight.target = cube;
                    break;
            }
        });
        gui.add(controls, 'spotLightDebug').onChange(function(e) {
            if (e) {
                scene.add(debugSpotLight);
            } else {
                scene.remove(debugSpotLight);
            }
        });
        gui.add(controls, 'pointLightDebug').onChange(function(e) {
            if (e) {
                scene.add(debugPointLight);
            } else {
                scene.remove(debugPointLight);
            }
        });
        gui.add(controls, 'shadowDebug').onChange(function(e) {
            if (e) {
                scene.add(debugCamera);
            } else {
                scene.remove(debugCamera);
            }
        });
        gui.add(controls, 'castShadow').onChange(function(e) {
            spotLight.castShadow = e;
        });
        gui.add(controls, 'stopMovingSpotLight').onChange(function(e) {
            stopMovingSpotLight = e;
        });
        gui.add(controls, 'stopMovingPointLight').onChange(function(e) {
            stopMovingPointLight = e;
        });
        return controls;
    }

    // 自适应窗口大小
    window.addEventListener('resize', onResize, false);

    function onResize() {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
    }
}