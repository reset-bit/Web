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
    spotLight.position.set(-30, 60, 60);
    spotLight.castShadow = true;
    scene.add(spotLight);
    let axes = new THREE.AxesHelper(70); // xyz-rgb
    scene.add(axes);

    let groundGeometry = new THREE.PlaneGeometry(50, 50, 4, 4);
    let groundMesh = new THREE.Mesh(groundGeometry, new THREE.MeshBasicMaterial({ color: '#555' }));
    groundMesh.rotation.x = -Math.PI / 2;
    groundMesh.position.set(0, -10, 0); // 设定的是中心点坐标
    scene.add(groundMesh);

    // 设置材质
    let basicMaterial = new THREE.MeshBasicMaterial({ color: '#77f' });; // 基础的对光照无反应物体
    let lambertMaterial = new THREE.MeshLambertMaterial({ color: '#77f' }); // 暗淡的不发光物体
    let phoneMaterial = new THREE.MeshPhongMaterial({ color: '#77f' }); // 金属类明亮物体
    let toonMaterial = new THREE.MeshToonMaterial({ color: '#77f' }); // phong material进阶，更加卡通化
    let standardMaterial = new THREE.MeshStandardMaterial({ color: '#77f' }); // 基于物理计算光照的物体
    let physicalMaterial = new THREE.MeshPhysicalMaterial({ color: '#77f' }); // standard material进阶，提供清漆等选项

    // 加载obj
    let loader = new THREE.OBJLoader();
    let curMesh = groundMesh;
    new Promise(resolve => {
        loader.load('../../assets/models/gopher/gopher.obj', loadedMesh => {
            curMesh = loadedMesh;
            if (lambertMaterial) {
                // util.js
                computeNormalsGroup(curMesh);
                setMaterialGroup(basicMaterial, curMesh);
            }
            resolve(curMesh);
        });
    }).then(gopher => {
        gopher.scale.x = 3;
        gopher.scale.y = 3;
        gopher.scale.z = 3;
        // 设置3D模型位置位于原点
        // console.log(gopher);
        let box = new THREE.Box3();
        box.expandByObject(gopher); // 获取group最小包围盒
        gopher.position.y = -(box.max.y - box.min.y) / 2;
        scene.add(gopher);
    });

    let step = 0;
    let controls = new function() {
        this.selectedMaterial = 'basic';
    };
    // physical material相关选项
    let clearCoat = null,
        clearCoatRoughness = null,
        reflectivity = null;

    function removeItems() {
        gui.remove(clearCoat);
        gui.remove(clearCoatRoughness);
        gui.remove(reflectivity);
    }
    let gui = new dat.GUI();
    gui.add(controls, 'selectedMaterial', ['basic', 'lambert', 'phone', 'toon', 'standard', 'physical']).onChange(e => {
        if (curMesh === groundMesh) { return; }
        switch (e) {
            case 'basic':
                setMaterialGroup(basicMaterial, curMesh);
                break;
            case 'lambert':
                setMaterialGroup(lambertMaterial, curMesh);
                break;
            case 'phone':
                setMaterialGroup(phoneMaterial, curMesh);
                break;
            case 'toon':
                setMaterialGroup(toonMaterial, curMesh);
                break;
            case 'standard':
                setMaterialGroup(standardMaterial, curMesh);
                break;
            case 'physical':
                setMaterialGroup(physicalMaterial, curMesh);
                clearCoat = gui.add(physicalMaterial, 'clearCoat', 0, 1, 0.01);
                clearCoatRoughness = gui.add(physicalMaterial, 'clearCoatRoughness', 0, 1, 0.01);
                reflectivity = gui.add(physicalMaterial, 'reflectivity', 0, 1, 0.01);
                break;
            default:
                break;
        }
        if (e !== 'physical') { removeItems(); }
    });
    render();

    function render() {
        curMesh.rotation.y = (step += 0.01);
        requestAnimationFrame(render);
        renderer.render(scene, camera);
    }
}