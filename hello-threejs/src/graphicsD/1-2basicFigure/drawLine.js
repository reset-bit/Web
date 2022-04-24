function drawRasterizationLine(width, height, gridSize, rowLines, colLines, ctx) {
    let startX = width / 4,
        startY = height / 4 * 3,
        endX = width / 4 * 3,
        endY = height / 4;
    let prevX = startX,
        prevY = startY,
        nextX, nextY;
    let startTime, prevXIndex, duration = 5000, // prevXIndex防止采样过高时重复绘制 pointNum交点数量
        precision = 2, // 动画过程中插值不一定取到网格线上，取值与动画速度有关
        textControl = {
            isTopPointFirstChecked: 2, // 2 未激活 1 第一次选中 0 非第一次选中
            isBottomPointFirstChecked: 2,
            checkedPointGroupNum: 0
        };
    const drawTriangleBtn = document.querySelector('.draw-triangle-btn');

    drawTriangleBtn.disabled = 'true';
    drawAxis();
    // 绘制直线及标志点        
    requestAnimationFrame(step); // 使用requestAnimation传入currentTime

    // functions

    function drawAxis() {
        let originX = gridSize * 2,
            originY = gridSize * (1 + rowLines.length - 2),
            width = gridSize * (colLines.length - 5),
            height = gridSize * (rowLines.length - 2);
        // 原点
        ctx.font = '16px Consolas';
        ctx.fillText('(0, 0)', originX - 28, originY + 20);
        drawPoint(ctx, originX, originY, 3, '#000');
        // 坐标轴
        let arrowLineSize = 10,
            arrowColor = '#000';
        drawLine(ctx, originX, originY, originX + width + gridSize / 2, originY, arrowColor, 2); // x
        drawLine(ctx, originX + width + gridSize / 2, originY, originX + width + gridSize / 2 - arrowLineSize, originY - arrowLineSize, arrowColor, 2);
        drawLine(ctx, originX + width + gridSize / 2, originY, originX + width + gridSize / 2 - arrowLineSize, originY + arrowLineSize, arrowColor, 2);
        drawLine(ctx, originX, originY, originX, originY - height - gridSize / 2, arrowColor, 2); // y
        drawLine(ctx, originX, originY - height - gridSize / 2, originX + arrowLineSize, originY - height - gridSize / 2 + arrowLineSize, arrowColor, 2);
        drawLine(ctx, originX, originY - height - gridSize / 2, originX - arrowLineSize, originY - height - gridSize / 2 + arrowLineSize, arrowColor, 2);
        // 框选屏幕空间
        drawRect(ctx, gridSize * 2, gridSize, width, height, '#336699', 1);
    }

    /**
     * 绘制直线单步操作
     * 
     * （当前时刻-开始时刻）/动画总时长=动画执行进度，范围为[0, 1]
     * 判断当前坐标是否与竖线存在交点，有则绘制交点、中点、上下网格线交点。
     * 若交点在中点之上，则填充右上色块；否则填充右方色块。
     * 选取第一个交点在中点之上、在中点之下的两组点，添加标志性文字。
     */
    function step(currentTime) {
        !startTime && (startTime = currentTime) // startTime初始化
        let timeElapsed = currentTime - startTime; // 已经过去的时间
        let progress = Math.min(timeElapsed / duration, 1); // 动画执行进度
        // 绘制直线
        ctx.beginPath();
        ctx.moveTo(prevX, prevY);
        prevX = nextX = startX + (endX - startX) * progress;
        prevY = nextY = startY + (endY - startY) * progress;
        ctx.lineTo(nextX, nextY);
        ctx.strokeStyle = '#336699';
        ctx.lineWidth = 3;
        ctx.stroke();
        // 绘制标注点
        let xIndex = colLines.findIndex(item => { // nextX与竖线相同的值
            let min = Math.floor(nextX - precision),
                max = Math.floor(nextX + precision);
            return item > min && item < max;
        });
        let biggerYIndex = rowLines.findIndex(item => { return item > nextY; }); // 第一个比nextY大的y值下标，用于绘制上下网格线交点
        let middleY = Math.floor((rowLines[biggerYIndex - 1] + rowLines[biggerYIndex]) / 2);
        let rectX, rectY;
        // 交点及像素色块处理
        if (xIndex !== -1 && xIndex !== prevXIndex) {
            // console.log(xIndex, nextX, nextY);
            // 绘制交点
            drawPoint(ctx, nextX, nextY, 5, '#99cc33');
            // 标记中点
            ctx.beginPath();
            ctx.moveTo(colLines[xIndex] - 2, middleY);
            ctx.lineTo(colLines[xIndex] + 2, middleY);
            ctx.lineWidth = 1;
            ctx.strokeStyle = '#000';
            ctx.stroke();
            // 绘制上下网格线交点
            rectX = colLines[xIndex]
            if (nextY < middleY) { // 取上方网格线交点
                rectY = rowLines[biggerYIndex - 1];
                drawPoint(ctx, colLines[xIndex], rowLines[biggerYIndex - 1], 2, '#000');
                textControl.isTopPointFirstChecked === 2 && (textControl.isTopPointFirstChecked--)
            } else { // 取下方网格线交点
                rectY = rowLines[biggerYIndex];
                drawPoint(ctx, colLines[xIndex], rowLines[biggerYIndex], 2, '#000');
                textControl.isBottomPointFirstChecked === 2 && (textControl.isBottomPointFirstChecked--)
            }
            drawCircle(ctx, colLines[xIndex], rowLines[biggerYIndex - 1], 4, '#888');
            drawCircle(ctx, colLines[xIndex], rowLines[biggerYIndex], 4, '#888');
            // 添加文字
            if (textControl.isTopPointFirstChecked === 1 || textControl.isBottomPointFirstChecked === 1) {
                textControl.checkedPointGroupNum++;
                textControl.isTopPointFirstChecked === 1 && (textControl.isTopPointFirstChecked--)
                textControl.isBottomPointFirstChecked === 1 && (textControl.isBottomPointFirstChecked--)
                let no = textControl.checkedPointGroupNum; // 需要添加文字的标志点组序号
                ctx.font = '16px Consolas';
                ctx.fillText('P' + (no * 2 - 1), colLines[xIndex] + 8, rowLines[biggerYIndex - 1] - 8);
                ctx.fillText('M' + no, colLines[xIndex] - 22, middleY + 8);
                ctx.fillStyle = '#99cc33';
                ctx.fillText('Q' + no, nextX + 8, nextY + 8);
                ctx.fillStyle = '#000';
                ctx.fillText('P' + (no * 2), colLines[xIndex] + 8, rowLines[biggerYIndex] + 14);
            }
            // 填充像素色块
            fillRect(ctx, rectX, rectY - gridSize, gridSize, gridSize, 'rgba(220, 220, 220, 0.3)');

            // 更新prevXIndex
            prevXIndex = xIndex;
        }
        // 逐帧请求动画
        progress < 1 ? requestAnimationFrame(step) : drawTriangleBtn.disabled = '';
    };

}