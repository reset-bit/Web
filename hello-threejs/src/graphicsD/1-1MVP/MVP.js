function init() {
    let scene, camera, viewCamera, renderer, trackballControls, transformControls, clock;
    let teapot,
        cameraGroup,
        cameraOuterMesh, // 包含cameraGroup
        objectsGroup, // 包含teapot/cameraOuterMesh
        pointingY, pointingZ, // cameraGroup指示点
        perspCylinder, orthCylinder, // 透视投影与正交投影视见体
        minVisualRange = 10,
        maxVisualRange = 100; // 最近可视距离 最远可视距离
    let isViewTransform = false, // 是否已经视图变换过
        controls = { // 控制项
            // 模型变换
            teapotRotationX: -90,
            teapotRotationY: 0,
            teapotRotationZ: 0,
            // 视图变换
            viewTransform: function() {
                if (isViewTransform) { return; }
                isViewTransform = true;
                changeTransformationStatus('projection');
                translateAndRotateToAppoint(1000);
            },
            // 投影变换
            cameraType: 'Perspective Camera',
            viewFrustumVisible: false
        };

    // 自定义事件监听：等待模型全部加载完成之后渲染
    let totalObjNums = 2;
    let loadedObjNums = 0;
    let loaded = new Event('loaded');

    initScene();
    initContent();
    document.addEventListener('loaded', changeLoadedObjectsStatus, false);
    window.addEventListener('resize', onWindowResize, false);

    function changeLoadedObjectsStatus() {
        loadedObjNums++;
        if (loadedObjNums === totalObjNums) {
            initObjectsPosition();
            initClock();
            initControls();
            render();
        }
    }
    window.onunload = () => { document.removeEventListener('loaded', changeLoadedObjectsStatus, false); }

    // functions

    function initScene() {
        scene = new THREE.Scene();

        camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 10000);
        camera.position.set(-60, 100, -80); // 30, 40, 60 -60, 40, -100
        viewCamera = new THREE.PerspectiveCamera(90, window.innerWidth / window.innerHeight, 1, 10000);
        scene.add(viewCamera);
        addViewFrustum();

        renderer = new THREE.WebGLRenderer();
        renderer.shadowMap.enabled = true;
        renderer.shadowMap.type = THREE.PCFSoftShadowMap;
        renderer.setSize(window.innerWidth, window.innerHeight);
        renderer.autoClear = false; // 关闭自动清除（深度缓存、颜色缓存、模板缓存），便于多次画面叠加
        document.querySelector('#webgl-output').appendChild(renderer.domElement);
    }

    function initContent() {
        let axes = new THREE.AxesHelper(100);
        scene.add(axes);
        let plane = new THREE.Mesh(new THREE.PlaneGeometry(800, 800), new THREE.MeshLambertMaterial({
            color: 0xcccccc,
            transparent: true,
            opacity: 0.7
        }));
        plane.rotation.x = -0.5 * Math.PI;
        plane.position.set(0, 0, 0);
        plane.name = 'plane';
        plane.receiveShadow = true;
        scene.add(plane);

        // get utah teapot
        new THREE.ObjectLoader().load('./utah-teapot.json',
            obj => {
                teapot = obj.children[0];
                teapot.scale.set(0.8, 0.8, 0.8);
                teapot.castShadow = true;

                document.dispatchEvent(loaded); // 触发模型加载完成事件
            }
        );
        // get camera model
        new THREE.MTLLoader().load('./camera.mtl',
            material => {
                material.preload();
                let loader = new THREE.OBJLoader();
                loader.setMaterials(material);
                loader.load('./camera.obj',
                    obj => {
                        cameraGroup = obj;
                        // 坐标轴
                        let axes = new THREE.AxesHelper(2);
                        cameraGroup.add(axes);
                        // 透明指示点（两点确定一个平面，保证camereGroup完全与坐标轴重合）
                        let pointingGeometry = new THREE.BoxGeometry(0.1, 0.1, 0.1);
                        let material = new THREE.MeshBasicMaterial({
                            color: 0xffffff,
                            alphaMap: new THREE.TextureLoader().load('./alpha.png'), // alpha透明贴图
                            alphaTest: 0.5
                        });
                        pointingZ = new THREE.Mesh(pointingGeometry, material);
                        pointingZ.position.set(0, 0, 1);
                        pointingZ.name = 'pointingZ';
                        cameraGroup.add(pointingZ);
                        pointingY = new THREE.Mesh(pointingGeometry, material);
                        pointingY.position.set(0, 1, 0);
                        pointingY.name = 'pointingY';
                        cameraGroup.add(pointingY);
                        // cameraGroup
                        cameraGroup.children[0].geometry.computeBoundingBox();
                        cameraGroup.scale.set(12, 12, 12);
                        cameraGroup.name = 'camera_group';
                        // 在cameraGroup外包裹cameraOuterMesh，移动cameraOuterMesh的同时移动cameraGroup
                        let box = new THREE.Box3(); // 数学方法，包含属性：isBox3/min/max
                        box.expandByObject(cameraGroup);
                        let cameraSize = new THREE.Vector3();;
                        box.getSize(cameraSize);
                        let boxGeometry = new THREE.BoxGeometry(cameraSize.x, cameraSize.y, cameraSize.z);
                        cameraOuterMesh = new THREE.Mesh(boxGeometry, material);
                        cameraOuterMesh.name = 'camera_outer_mesh';

                        document.dispatchEvent(loaded); // 触发模型加载完成事件
                    }
                );
            }
        );

        let directionalLight = new THREE.DirectionalLight('#bbb'); // 平行光
        directionalLight.position.set(-40, 200, -10); // -40, 60, -10
        directionalLight.castShadow = true;
        directionalLight.shadow.camera.near = 0; // 产生阴影的最近距离
        directionalLight.shadow.camera.far = 400; // 产生阴影的最远距离
        directionalLight.shadow.camera.left = -400; // 产生阴影距离位置的最左边位置
        directionalLight.shadow.camera.right = 400; // 最右边
        directionalLight.shadow.camera.top = 1000; // 最上边
        directionalLight.shadow.camera.bottom = -500; // 最下面
        directionalLight.distance = 0;
        directionalLight.intensity = 0.5;
        directionalLight.shadow.mapSize.width = 1024; // 设置阴影分辨率
        directionalLight.shadow.mapSize.height = 1024;
        scene.add(directionalLight);
        let ambient = new THREE.AmbientLight('#fff');
        scene.add(ambient);
    }

    function initObjectsPosition() {
        objectsGroup = new THREE.Group();

        teapot.position.set(0, 0, 0); // 组内位置
        objectsGroup.add(teapot);

        cameraGroup.position.set(30, 30, 30); // 组内位置
        cameraGroup.lookAt(teapot.position);
        objectsGroup.add(cameraGroup);

        cameraOuterMesh.position.copy(cameraGroup.position);
        objectsGroup.add(cameraOuterMesh);

        viewCamera.position.copy(cameraGroup.position);
        viewCamera.lookAt(teapot.position);
        objectsGroup.add(viewCamera);

        objectsGroup.name = 'objects_group';
        scene.add(objectsGroup);
    }

    function initClock() {
        clock = new THREE.Clock();
    }

    function initControls() {
        // 轨迹球控件
        trackballControls = new THREE.TrackballControls(camera, renderer.domElement);
        trackballControls.zoomSpeed = 0.8; // 缩放速度
        trackballControls.staticMoving = false; // 开启惯性
        trackballControls.minDistance = 50;
        trackballControls.maxDistance = 1000;

        let gui = new dat.GUI({ autoPlace: false });
        gui.domElement.id = 'gui';
        document.querySelector('#gui-container').appendChild(gui.domElement);
        // 状态记忆
        gui.remember(controls);
        document.querySelectorAll('li.save-row>*').forEach(item => {
            if (item.className === 'button revert') {
                item.innerHTML = '复位';
                item.parentNode.style.cssText = 'display: flex;';
                item.style.cssText = 'display: flex; align-items: center; justify-content: center; width: 100%; line-height: 0; padding: 0; margin: 0;';
                item.addEventListener('click', e => {
                    isViewTransform = false;
                    changeTransformationStatus('view');
                    initObjectsPosition();
                });
            } else {
                item.style.display = 'none';
            }
        });
        // gui组件
        let folder1 = gui.addFolder('模型变换');
        folder1.add(controls, 'teapotRotationX', -180, 180).name('茶壶x轴旋转角度');
        folder1.add(controls, 'teapotRotationY', -180, 180).name('茶壶y轴旋转角度');
        folder1.add(controls, 'teapotRotationZ', -180, 180).name('茶壶z轴旋转角度');
        folder1.open();
        let folder2 = gui.addFolder('视图变换');
        folder2.add(controls, 'viewTransform').name('开始视图变换');
        folder2.open();
        let folder3 = gui.addFolder('投影变换');
        folder3.add(controls, 'cameraType', ['Perspective Camera', 'Orthographic Camera'])
            .onChange(value => {
                changeCameraType(value);
                changeViewFrustum(controls.viewFrustumVisible);
            })
            .name('相机类型');
        folder3.add(controls, 'viewFrustumVisible')
            .onChange(value => { changeViewFrustum(value); })
            .name('显示视见体');
        folder3.open();
        // 初始化禁止投影变换
        changeTransformationStatus('view');

        // 鼠标操作物体移动、缩放、旋转控件
        transformControls = new THREE.TransformControls(camera, renderer.domElement);
        transformControls.name = 'transform_contorls';
        scene.add(transformControls);

        // 拖拽控件
        let dragControls = new THREE.DragControls([teapot, cameraOuterMesh], camera, renderer.domElement);
        dragControls.addEventListener('hoveron', e => { // 绑定物体
            transformControls.attach(e.object);
        });
        dragControls.addEventListener('dragstart', e => { // 拖拽开始
            dragControls.enabled = false;
        });
        dragControls.addEventListener('dragend', e => { // 拖拽结束
            dragControls.enabled = true;
            if (e.object.name === 'camera_outer_mesh') {
                let { x, y, z } = e.object.position;
                cameraGroup.position.set(x, y, z);
                viewCamera.position.set(x, y, z);
            }
            cameraGroup.lookAt(teapot.position);
            viewCamera.lookAt(teapot.position);
        });
    }

    function render() {
        // 控制器等更新
        TWEEN.update();
        trackballControls.update(clock.getDelta());
        teapot.rotation.x = controls.teapotRotationX * 2 * Math.PI / 360;
        teapot.rotation.y = controls.teapotRotationY * 2 * Math.PI / 360;
        teapot.rotation.z = controls.teapotRotationZ * 2 * Math.PI / 360;

        // 画面更新
        // 世界视角
        cameraGroup.visible = true;
        renderer.setViewport(0, 0, window.innerWidth, window.innerHeight);
        renderer.render(scene, camera);
        // 相机视角
        cameraGroup.visible = false;
        renderer.setViewport(0, 0, window.innerWidth / 4, window.innerHeight / 4);
        renderer.render(scene, viewCamera);
        requestAnimationFrame(render);
    }

    /**
     * 经过time，移动group到原点并朝向-z
     * 
     * 移动：group位于原点，cameraGroup.position为组内位置。
     *      将group沿cameraGroup位置反向移动，可将camereGroup移到原点。
     *      teapot由于同组保持相对位置不变。
     * 朝向-z：分为对齐-z、对齐y两步操作，过程思想相同。
     *        在group外套group容器，默认位置为原点。由于移动后cameraGroup位于原点，故此时旋转中心为cameraGroup。
     *        获取对应知识点位置向量、需要对齐的轴向量，归一化后获取四元数。
     *        使用tween+四元数slerp插值实现动画过程。
     * 平移或旋转过后需要更新指示点世界坐标。
     * 不能使用tween.chain：js非阻塞，获取指示点坐标时不能保证上一次的onComplete回调函数执行完成
     * 不能连续两次对统一组进行四元数旋转操作：四元数对象与欧拉对象都用于保存对象旋转信息，连续两次设置将会产生覆盖
     */
    function translateAndRotateToAppoint(time) {
        let vectorZ = new THREE.Vector3(),
            vectorY = new THREE.Vector3(); // 保存指示点世界坐标
        // console.log('objectsGroup:' + objectsGroup);
        // 移动
        new TWEEN.Tween(objectsGroup.position)
            .to({
                x: -1 * cameraGroup.position.x,
                y: -1 * cameraGroup.position.y,
                z: -1 * cameraGroup.position.z
            }, time)
            .start()
            .onComplete(() => {
                pointingZ.getWorldPosition(vectorZ);
                pointingY.getWorldPosition(vectorY);
                // console.log('after translate pointingZ: ', vectorZ);
                // console.log('after translate pointingY: ', vectorY);

                // 对齐-z轴
                let outGroup = new THREE.Group();
                outGroup.add(objectsGroup);
                scene.add(outGroup);
                let quaternion = new THREE.Quaternion().setFromUnitVectors(vectorZ.normalize(), new THREE.Vector3(0, 0, -1).normalize());
                new TWEEN.Tween({})
                    .to({}, 1000)
                    .start()
                    .onUpdate(() => {
                        outGroup.quaternion.slerp(quaternion, 0.2);
                    })
                    .onComplete(() => {
                        pointingZ.getWorldPosition(vectorZ);
                        pointingY.getWorldPosition(vectorY);
                        // 使用vectorZ.round()四舍五入，可发现z世界坐标为0
                        // console.log('after rotate pointingZ: ', vectorZ);
                        // console.log('after rotate pointingY: ', vectorY);

                        // 对齐y轴
                        let oOutGroup = new THREE.Group();
                        oOutGroup.add(outGroup);
                        scene.add(oOutGroup);
                        let quaternion = new THREE.Quaternion().setFromUnitVectors(vectorY.normalize(), new THREE.Vector3(0, 1, 0).normalize());
                        new TWEEN.Tween({})
                            .to({}, 1000)
                            .start()
                            .onUpdate(() => {
                                oOutGroup.quaternion.slerp(quaternion, 0.2);
                            })
                            .onComplete(() => {
                                scene.remove(transformControls); // 禁用模型拖拽
                            });
                    });
            });
    }

    /**
     * 切换相机类型
     * 
     * 新建viewCamera，重新设置位置与朝向，移除原有相机，更换视见体
     * */
    function changeCameraType(curValue) {
        viewCamera = curValue === 'Orthographic Camera' ?
            new THREE.OrthographicCamera(window.innerWidth / -12, window.innerWidth / 12, window.innerHeight / 12, window.innerHeight / -12, minVisualRange, maxVisualRange) // left right top bottom near far
            :
            new THREE.PerspectiveCamera(90, window.innerWidth / window.innerHeight, minVisualRange, maxVisualRange); // fov aspect near far
        viewCamera.position.copy(cameraGroup.position);
        viewCamera.lookAt(teapot.position);
        objectsGroup.remove(objectsGroup.children.filter(item => { return item.type === 'PerspectiveCamera' || item.type === 'OrthographicCamera' })[0]);
        objectsGroup.add(viewCamera);
    }

    /**
     * 向场景中添加视见体
     * */
    function addViewFrustum() {
        // Perspective Camera
        let aspect = window.innerWidth / window.innerHeight;
        let radiusTop = getRadiusByHeightAndAspect(minVisualRange, aspect);
        let radiusBottom = getRadiusByHeightAndAspect(maxVisualRange, aspect);
        let perspCylinderGeometry = new THREE.CylinderGeometry(radiusTop, radiusBottom, maxVisualRange, 4); // radiusTop radiusBottom height radialSegments
        // Orthographic Camera
        let radiusTopAndBottom = getRadiusBytblr(window.innerWidth / -12, window.innerWidth / 12, window.innerHeight / 12, window.innerHeight / -12);
        let orthCylinderGeometry = new THREE.CylinderGeometry(radiusTopAndBottom, radiusTopAndBottom, maxVisualRange, 4); // radiusTop radiusBottom height radialSegments

        let metarial = new THREE.MeshBasicMaterial({
            color: 0xffffff,
            transparent: true,
            opacity: 0.4
        });
        perspCylinder = new THREE.Mesh(perspCylinderGeometry, metarial);
        perspCylinder.position.set(0, -1 * maxVisualRange / 2 - minVisualRange, 0); // 移动顶点到原点
        perspCylinder.rotation.y = 0.25 * Math.PI;
        perspCylinder.visible = false;
        perspCylinder.name = 'perspective_view_frustum';
        orthCylinder = new THREE.Mesh(orthCylinderGeometry, metarial);
        orthCylinder.position.copy(perspCylinder.position);
        orthCylinder.rotation.y = 0.25 * Math.PI;
        orthCylinder.visible = false;
        orthCylinder.name = 'orthographic_view_frustum';
        let group = new THREE.Group();
        group.add(perspCylinder, orthCylinder);
        group.rotation.x = 0.5 * Math.PI;
        group.name = 'view_frustum';
        scene.add(group);


        function getRadiusByHeightAndAspect(height, aspect) {
            let length = Math.round(2 * height * Math.sqrt(1 / (aspect * aspect - 1)));
            let radius = Math.round(length / 2 * Math.sqrt(aspect * aspect + 1));
            return radius;
        }

        function getRadiusBytblr(top, bottom, left, right) {
            let length = top - bottom,
                width = right - left;
            let radius = Math.round(Math.sqrt(Math.pow(length / 2, 2) + Math.pow(width / 2, 2)));
            return radius;
        }
    }

    /**
     * 改变视见体类型
     */
    function changeViewFrustum(value) {
        if (!value) {
            perspCylinder.visible = false;
            orthCylinder.visible = false;
        } else if (controls.cameraType === 'Perspective Camera') {
            perspCylinder.visible = true;
            orthCylinder.visible = false;
        } else if (controls.cameraType === 'Orthographic Camera') {
            perspCylinder.visible = false;
            orthCylinder.visible = true;
        }
    }

    /**
     * 切换视图变换与投影变换状态，更新相关dom
     * 
     * 视图变换与投影变换不能同时开启
     * */
    function changeTransformationStatus(bannedType) {
        if (bannedType === 'view') {
            document.querySelectorAll('#gui>ul>li:nth-child(3) li.cr span.property-name').forEach(item => { // 开启视图变换
                item.style.color = '#fff';
            });
            document.querySelectorAll('#gui>ul>li:nth-child(4) li.cr span.property-name').forEach(item => { // 禁止投影变换
                item.style.color = '#ccc';
            });
            document.querySelector('#gui>ul>li:nth-child(4) select').disabled = 'disabled';
            document.querySelector('#gui>ul>li:nth-child(4) select').style.backgroundColor = '#eee';
            document.querySelector('#gui>ul>li:nth-child(4) input').disabled = 'disabled';
        } else if (bannedType === 'projection') {
            document.querySelectorAll('#gui>ul>li:nth-child(3) li.cr span.property-name').forEach(item => { // 禁止视图变换
                item.style.color = '#ccc';
            });
            document.querySelectorAll('#gui>ul>li:nth-child(4) li.cr span.property-name').forEach(item => { // 开启投影变换
                item.style.color = '#fff';
            });
            document.querySelector('#gui>ul>li:nth-child(4) select').disabled = '';
            document.querySelector('#gui>ul>li:nth-child(4) select').style.backgroundColor = '#fff';
            document.querySelector('#gui>ul>li:nth-child(4) input').disabled = '';
        }
    }

    function onWindowResize() {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);

        viewCamera.aspect = window.innerWidth / window.innerHeight;
        viewCamera.updateProjectionMatrix();
    }
}