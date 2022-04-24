function drawRasterizationTriangle(width, height, gridSize, rowLines, colLines, ctx, octx, fctx) {
    let p1, p2, p3, q;
    let boundingBoxWidth, boundingBoxHeight, boundingBoxLTPointX, boundingBoxLTPointY, boundingBoxHorizontalPixelNums, boundingBoxVerticalPixelNums;
    let startTime = -1,
        lastPixelNo = -1, // 上次动画遍历到的像素总编号
        fps = 4, // 每秒1帧
        interval = 1000 / fps; // 每帧时长
    const images = [document.querySelector('#p1Img'), document.querySelector('#p2Img'), document.querySelector('#p3Img')],
        triangleOnePixelBtn = document.querySelector('.triangle-one-pixel-btn'),
        triangleFillBtn = document.querySelector('.triangle-fill-btn');

    triangleOnePixelBtn.style.visibility = 'visible';
    triangleFillBtn.style.visibility = 'visible';

    // 绘制三角形（逆时针定义顶点）、包围盒及盒内像素
    p1 = { x: colLines[Math.floor(colLines.length / 2)], y: gridSize + 20 };
    p2 = { x: gridSize * 3 + 20, y: rowLines[rowLines.length - 3] - 20 };
    p3 = { x: colLines[colLines.length - 4], y: rowLines[rowLines.length - 1] };
    getBoundingBoxAbout();
    drawTriangleAndBoundingBox(p1, p2, p3, '#336699', 3);
    // 标记顶点
    drawPoint(ctx, p1.x, p1.y, 3, '#000');
    drawPoint(ctx, p2.x, p2.y, 3, '#000');
    drawPoint(ctx, p3.x, p3.y, 3, '#000');
    ctx.font = '16px Consolas';
    ctx.fillStyle = '#000';
    ctx.fillText('P1', p1.x + 10, p1.y - 6);
    ctx.fillText('P2', p2.x - 16, p2.y - 10);
    ctx.fillText('P3', p3.x + 10, p3.y);
    // 单像素判断
    q = { x: boundingBoxLTPointX + gridSize * 1.5, y: boundingBoxLTPointY + gridSize * 1.5 };
    triangleOnePixelBtn.addEventListener('click', () => {
        octx.clearRect(0, 0, width, height);
        fctx.clearRect(0, 0, width, height);
        triangleFillBtn.disabled = 'true';

        octx.fillText('Q', q.x + 10, q.y); // 标记q
        // 获取右手法则示意
        getResultOfRightHandRuleByThreePoint(octx, p1, p2, q, '#FF9999', 1); // p1p2-p1q 顶点标号1
        setTimeout(() => { getResultOfRightHandRuleByThreePoint(octx, p2, p3, q, '#FFCC33', 2); }, 1000); // p2p3-p2q 顶点标号2
        setTimeout(() => { getResultOfRightHandRuleByThreePoint(octx, p3, p1, q, '#9999CC', 3); }, 2000); // p3p1-p3q 顶点标号3
        // 填充当前判断像素最终结果
        setTimeout(() => {
            let pointColor = '',
                rectColor = '';
            if (computeVectorMultiCross(getVector(p1, p2), getVector(p1, q)) *
                computeVectorMultiCross(getVector(p2, p3), getVector(p2, q)) *
                computeVectorMultiCross(getVector(p3, p1), getVector(p3, q)) <= 0) {
                pointColor = '#99cc33';
                rectColor = 'rgba(220, 220, 220, 0.3)';
            } else {
                pointColor = '#ccc';
                rectColor = 'rgba(220, 220, 220, 0.1)';
            }
            drawPoint(octx, q.x, q.y, 4, pointColor);
            fillRect(octx, q.x - gridSize / 2, q.y - gridSize / 2, gridSize, gridSize, rectColor);
            triangleFillBtn.disabled = '';
        }, 3000);

        function getResultOfRightHandRuleByThreePoint(ctx, p1, p2, q, color, no) {
            drawVector(ctx, p1, p2, color, 3);
            drawVector(ctx, p1, q, color, 3);
            let img = images[no - 1];
            img.src = computeVectorMultiCross(getVector(p1, p2), getVector(p1, q)) <= 0 ? './palm-right-out.gif' : './palm-right-in.gif';
            img.style.left = (p1.x + 50) + 'px';
            img.style.top = (p1.y - 50) + 'px';
            img.style.visibility = 'visible';
        }
    });
    // 逐像素处理动画
    triangleFillBtn.addEventListener('click', () => {
        octx.clearRect(0, 0, width, height);
        fctx.clearRect(0, 0, width, height);
        images.forEach(item => {
            item.style.visibility = 'hidden';
        });
        startTime = lastPixelNo = -1;
        triangleOnePixelBtn.disabled = 'true';
        requestAnimationFrame(fillTriangleStep); // 使用requestAnimation传入currentTime
    });


    // functions

    function drawTriangleAndBoundingBox(p1, p2, p3, color, lineWidth) {
        ctx.beginPath();
        ctx.moveTo(p1.x, p1.y); // p1
        ctx.lineTo(p2.x, p2.y); // p2
        ctx.lineTo(p3.x, p3.y); // p3
        ctx.lineTo(p1.x, p1.y);
        ctx.strokeStyle = color;
        typeof(lineWidth) !== 'undefined' && (ctx.lineWidth = 3);
        ctx.stroke();
        drawRect(ctx, boundingBoxLTPointX, boundingBoxLTPointY, boundingBoxWidth, boundingBoxHeight, '#888', 2);
        for (let i = boundingBoxLTPointX; i < (boundingBoxLTPointX + boundingBoxWidth); i += gridSize) {
            for (let j = boundingBoxLTPointY; j < (boundingBoxLTPointY + boundingBoxHeight); j += gridSize) {
                let q = { x: i + gridSize / 2, y: j + gridSize / 2 };
                drawCircle(ctx, q.x, q.y, 4, '#aaa', 1);
            }
        }
    }

    function getBoundingBoxAbout() {
        let p1x = Math.floor(p1.x / gridSize) * gridSize,
            p1y = Math.floor(p1.y / gridSize) * gridSize,
            p2x = Math.floor(p2.x / gridSize) * gridSize,
            p2y = Math.floor(p2.y / gridSize) * gridSize,
            p3x = Math.floor(p3.x / gridSize) * gridSize,
            p3y = Math.floor(p3.y / gridSize) * gridSize;
        boundingBoxWidth = Math.max(Math.abs(p1x - p2x), Math.abs(p2x - p3x), Math.abs(p3x - p1x));
        boundingBoxHeight = Math.max(Math.abs(p1y - p2y), Math.abs(p2y - p3y), Math.abs(p3y - p1y));
        boundingBoxLTPointX = Math.min(p1x, p2x, p3x);
        boundingBoxLTPointY = Math.min(p1y, p2y, p3y);
        boundingBoxHorizontalPixelNums = boundingBoxWidth / gridSize;
        boundingBoxVerticalPixelNums = boundingBoxHeight / gridSize;
    }

    /**
     * 逐像素填充三角形单步操作
     * 
     * （当前时刻-开始时刻）/单帧时间间隔=当前填充的像素总序号，范围为[0, 包围盒像素总数-1]
     * 使用总序号得横纵坐标，进而获取像素中心点坐标。
     * 使用右手法则判断，当前像素中心点是否在三边同侧。是则填充选中态，否则填充未选中态。
     * */
    function fillTriangleStep(currentTime) {
        (startTime === -1) && (startTime = currentTime) // startTime初始化
        curPixelNo = Math.floor((currentTime - startTime) / interval); // 已经过去的时间，0-23
        if (curPixelNo > lastPixelNo) {
            lastPixelNo = curPixelNo;
            let x = curPixelNo % boundingBoxHorizontalPixelNums,
                y = Math.floor(curPixelNo / boundingBoxHorizontalPixelNums);
            // console.log(curPixelNo, x, y);
            // 填充像素
            fillRect(fctx, boundingBoxLTPointX + x * gridSize, boundingBoxLTPointY + y * gridSize, gridSize, gridSize, 'rgba(220, 220, 220, 0.1)');
            // 绘制圆点
            let q = { x: boundingBoxLTPointX + x * gridSize + gridSize / 2, y: boundingBoxLTPointY + y * gridSize + gridSize / 2 },
                color;
            let p1p2 = getVector(p1, p2),
                p2p3 = getVector(p2, p3),
                p3p1 = getVector(p3, p1),
                p1q = getVector(p1, q),
                p2q = getVector(p2, q),
                p3q = getVector(p3, q);
            if (computeVectorMultiCross(p1p2, p1q) * computeVectorMultiCross(p2p3, p2q) * computeVectorMultiCross(p3p1, p3q) <= 0) { // 同侧
                color = '#99cc33';
                fillRect(fctx, boundingBoxLTPointX + x * gridSize, boundingBoxLTPointY + y * gridSize, gridSize, gridSize, 'rgba(220, 220, 220, 0.3)');
            } else {
                color = '#ccc';
            }
            drawPoint(fctx, q.x, q.y, 4, color);
        }
        // 逐帧请求动画
        if ((curPixelNo + 1) < boundingBoxHorizontalPixelNums * boundingBoxVerticalPixelNums) {
            requestAnimationFrame(fillTriangleStep);
        } else {
            console.log('fill end');
            triangleOnePixelBtn.disabled = '';
        }
    };
}