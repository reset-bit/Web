function init() {
    let scene, camera, renderer;
    let model, ambientLight, spotLight,
        oriMaterial = new THREE.MeshLambertMaterial({ color: 0xffffff }),
        specularMaterial = new THREE.MeshPhongMaterial({ color: 0xffffff });
    let trackballControls, clock = new THREE.Clock();
    let controls = {
        isAmbientVisible: true,
        isDiffuseVisible: true,
        isSpecularVisible: true
    };

    initScene();
    initContent();
    initControls();
    render();
    window.addEventListener('resize', onWindowResize, false);

    function initScene() {
        scene = new THREE.Scene();

        camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 1, 100);
        camera.position.set(20, 30, 0);
        camera.lookAt(scene.position);

        renderer = new THREE.WebGLRenderer();
        renderer.setSize(window.innerWidth, window.innerHeight);
        document.querySelector('#webgl-output').appendChild(renderer.domElement);
    }

    function initContent() {
        let grid = new THREE.GridHelper(80, 30);
        scene.add(grid);
        new THREE.OBJLoader().load('./model.obj', obj => {
            model = obj.children[0];
            model.material = controls.isSpecularVisible ? specularMaterial : oriMaterial;;
            model.scale.set(0.03, 0.03, 0.03);
            scene.add(model);
        });

        ambientLight = new THREE.AmbientLight(0xaaaaaa);
        ambientLight.visible = controls.isAmbientVisible;
        scene.add(ambientLight);
        spotLight = new THREE.SpotLight(0xaaaaaa, 0.4);
        spotLight.position.set(-50, 100, 40);
        spotLight.visible = controls.isDiffuseVisible;
        scene.add(spotLight);
    }

    function initControls() {
        trackballControls = new THREE.TrackballControls(camera, renderer.domElement);
        trackballControls.zoomSpeed = 0.8;
        trackballControls.minDistance = 22;
        trackballControls.maxDistance = 70;

        let gui = new dat.GUI({ autoPlace: false });
        gui.domElement.id = 'gui';
        document.querySelector('#gui-container').appendChild(gui.domElement);
        gui.add(controls, 'isAmbientVisible')
            .onChange(value => { ambientLight.visible = controls.isAmbientVisible; })
            .name('漫反射光');
        gui.add(controls, 'isDiffuseVisible')
            .onChange(value => { spotLight.visible = controls.isDiffuseVisible; })
            .name('环境光');
        gui.add(controls, 'isSpecularVisible')
            .onChange(value => { model.material = value ? specularMaterial : oriMaterial; })
            .name('高光');
    }

    function render() {
        trackballControls.update(clock.getDelta());
        renderer.render(scene, camera);
        requestAnimationFrame(render);
    }

    function onWindowResize() {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
    }
}