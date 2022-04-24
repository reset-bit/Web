/**
 * 初始化默认场景：平面、立方体、球体、漫反射光+聚光灯光
 * 
 * @param scene 场景对象
 * @returns {} 包含上述内容的对象
 */
function initScene(scene) {
    let planeGeometry = new THREE.PlaneGeometry(60, 20, 120, 120);
    let planeMaterial = new THREE.MeshPhongMaterial({
        color: 0xffffff
    });
    let plane = new THREE.Mesh(planeGeometry, planeMaterial);
    plane.position.set(15, 0, 0);
    plane.rotation.x = -0.5 * Math.PI;
    plane.receiveShadow = true;
    scene.add(plane);

    let cubeGeometry = new THREE.BoxGeometry(4, 4, 4);
    let cubeMaterial = new THREE.MeshLambertMaterial({
        color: 0xff0000
    });
    let cube = new THREE.Mesh(cubeGeometry, cubeMaterial);
    cube.position.set(-4, 4, 0);
    cube.castShadow = true;
    scene.add(cube);

    let sphereGeometry = new THREE.SphereGeometry(4, 20, 20);
    let sphereMaterial = new THREE.MeshLambertMaterial({
        color: 0x7777ff
    });
    let sphere = new THREE.Mesh(sphereGeometry, sphereMaterial);
    sphere.position.set(20, 0, 2);
    sphere.castShadow = true;
    scene.add(sphere);

    let ambientLight = new THREE.AmbientLight('#000000');
    scene.add(ambientLight);
    let spotLight0 = new THREE.SpotLight(0xcccccc); // 场景必要光照，聚光灯光源
    spotLight0.position.set(-40, 30, -10);
    spotLight0.lookAt(plane);
    scene.add(spotLight0);

    return { plane, cube, sphere, ambientLight };
}