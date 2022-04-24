function init() {
    let scene = new THREE.Scene();
    let camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.set(30, 40, 30);
    camera.lookAt(scene.position);
    let renderer = new THREE.WebGLRenderer();
    renderer.shadowMap.enabled = true;
    renderer.shadowMapSoft = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    renderer.setClearColor(new THREE.Color('#000'));
    renderer.setSize(window.innerWidth, window.innerHeight);
    document.querySelector('#webgl-output').appendChild(renderer.domElement);
    let trackballControls = initTrackballControls(camera, renderer);
    let clock = new THREE.Clock();

    let controls = new function() {
        // 粒子选项
        this.size = 4;
        this.transparent = true; // 根据opacity确定粒子透明度
        this.opacity = .6;
        this.vertexColors = true; // 融合color和vertexColor
        this.color = '#fff'; // 粒子本身颜色
        this.vertexColor = '#0f0';
        this.sizeAttenuation = true; // 粒子的大小取决于离摄像机的远近
        this.rotate = true;

        this.redraw = function() {
            if (scene.getObjectByName('particles')) {
                scene.remove(scene.getObjectByName('particles'));
            }
            createParticles(controls.size, controls.transparent, controls.opacity, controls.vertexColors,
                controls.color, controls.vertexColor, controls.sizeAttenuation);
        }
    }
    let gui = new dat.GUI();
    gui.addColor(controls, 'color').onChange(controls.redraw);
    gui.addColor(controls, 'vertexColor').onChange(controls.redraw);

    let step = 0;
    controls.redraw();
    render();

    function createParticles(size, transparent, opacity, vertexColors, colorValue, vertexColorValue, sizeAttenuation) {
        let gemo = new THREE.Geometry(); // 粒子将添加进该几何体中
        let material = new THREE.PointsMaterial({
            size,
            transparent,
            opacity,
            vertexColors,
            sizeAttenuation,
            color: new THREE.Color(colorValue)
        });

        let range = 500;
        for (let i = 0; i < 15000; i++) {
            // 定义粒子位置
            let particle = new THREE.Vector3(Math.random() * range - range / 2, Math.random() * range - range / 2, Math.random() * range - range / 2);
            gemo.vertices.push(particle);
            // 定义粒子颜色（自定义亮度）
            let color = new THREE.Color(vertexColorValue);
            let asHSL = {};
            color.getHSL(asHSL);
            color.setHSL(asHSL.h, asHSL.s, asHSL.l * Math.random());
            gemo.colors.push(color);
        }
        cloud = new THREE.Points(gemo, material);
        cloud.name = 'particles';
        scene.add(cloud);
    }

    function render() {
        trackballControls.update(clock.getDelta());
        if (controls.rotate) {
            step += 0.01;
            cloud.rotation.x = step;
            cloud.rotation.z = step;
        }
        requestAnimationFrame(render);
        renderer.render(scene, camera);
    }
}