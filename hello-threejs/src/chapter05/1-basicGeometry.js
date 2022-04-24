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

    let ambientLight = new THREE.AmbientLight('#0c0c0c');
    scene.add(ambientLight);
    let spotLight = new THREE.SpotLight('#fff');
    spotLight.position.set(50, 40, -30);
    spotLight.castShadow = true;
    scene.add(spotLight);
    let axes = new THREE.AxesHelper(100);
    scene.add(axes);
    let groundGeometry = new THREE.PlaneGeometry(10000, 10000);
    let groundMaterial = new THREE.MeshPhongMaterial({ color: '#fff' });
    let ground = new THREE.Mesh(groundGeometry, groundMaterial);
    ground.receiveShadow = true;
    ground.rotation.x = -0.5 * Math.PI;
    ground.position.set(0, -16, 0);
    scene.add(ground);

    // 设置geometry
    let planeGeometry = new THREE.PlaneGeometry(10, 10);
    let circleGeometry = new THREE.CircleGeometry(10, 50); // radius segments
    let ringGeometry = new THREE.RingGeometry(5, 10, 50); // innerRadius outerRadius thetaSegments
    let boxGeometry = new THREE.BoxGeometry(4, 10, 10); // width height depth
    let sphereGeometry = new THREE.SphereGeometry(5, 10, 10, 0, 0.75 * Math.PI); // radius widthSegment heightSegment phiStart phiLength
    let cylinderGeometry = new THREE.CylinderGeometry(10, 10, 20, 50); // radiusTop radiusBottom height radialSegments
    let coneGeometry = new THREE.ConeGeometry(10, 20, 50); // radius height radialSegment
    let torusGeometry = new THREE.TorusGeometry(10, 6, 50, 50); // radius tube radiusSegments tubularSegments arc
    let torusKnotGeometry = new THREE.TorusKnotGeometry(10); // radius
    let icosahedronGeometry = new THREE.IcosahedronGeometry(10); // radius
    let tetrahedronGeometry = new THREE.TetrahedronGeometry(10); // 正四面体
    let octahedronGeometry = new THREE.OctahedronGeometry(10); // 正八面体
    let dodecahedronGeometry = new THREE.DodecahedronGeometry(10); // 正十六面体

    let material = new THREE.MeshPhongMaterial({ color: '#83cbac' });
    let mesh = new THREE.Mesh(planeGeometry, material);
    mesh.castShadow = true;
    scene.add(mesh);

    let step = 0;
    let controls = new function() {
        this.selectedGeometry = 'plane';
    }
    let gui = new dat.GUI();
    gui.add(controls, 'selectedGeometry', ['plane', 'circle', 'ring', 'box', 'sphere', 'cylinder', 'cone', 'torus', 'torus knot', 'icosahedron', 'tetrahedron', 'octahedron', 'dodecahedron']).onChange(e => {
        scene.remove(mesh);
        switch (e) {
            case 'plane':
                mesh = new THREE.Mesh(planeGeometry, material);
                break;
            case 'circle':
                mesh = new THREE.Mesh(circleGeometry, material);
                break;
            case 'ring':
                mesh = new THREE.Mesh(ringGeometry, material);
                break;
            case 'box':
                mesh = new THREE.Mesh(boxGeometry, material);
                break;
            case 'sphere':
                mesh = new THREE.Mesh(sphereGeometry, material);
                break;
            case 'cylinder':
                mesh = new THREE.Mesh(cylinderGeometry, material);
                break;
            case 'cone':
                mesh = new THREE.Mesh(coneGeometry, material);
                break;
            case 'torus':
                mesh = new THREE.Mesh(torusGeometry, material);
                break;
            case 'torus knot':
                mesh = new THREE.Mesh(torusKnotGeometry, material);
                break;
            case 'icosahedron':
                mesh = new THREE.Mesh(icosahedronGeometry, material);
                break;
            case 'tetrahedron':
                mesh = new THREE.Mesh(tetrahedronGeometry, material);
                break;
            case 'octahedron':
                mesh = new THREE.Mesh(octahedronGeometry, material);
                break;
            case 'dodecahedron':
                mesh = new THREE.Mesh(dodecahedronGeometry, material);
                break;
        }
        mesh.castShadow = true;
        scene.add(mesh);
    });

    render();

    function render() {
        mesh.rotation.y = (step += 0.01);
        mesh.rotation.x = step;
        mesh.rotation.z = step;
        requestAnimationFrame(render);
        renderer.render(scene, camera);
    }
}