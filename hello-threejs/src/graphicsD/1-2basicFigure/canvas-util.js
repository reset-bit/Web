function drawLine(ctx, startX, startY, endX, endY, color, lineWidth) {
    ctx.beginPath();
    ctx.moveTo(startX, startY);
    ctx.lineTo(endX, endY);
    ctx.strokeStyle = typeof(color) !== 'undefined' ? color : '#000';
    ctx.lineWidth = typeof(lineWidth) !== 'undefined' ? lineWidth : 2;
    ctx.stroke();
}

function drawPoint(ctx, x, y, radius, color) {
    ctx.beginPath();
    ctx.arc(x, y, radius, 0, Math.PI * 2);
    ctx.fillStyle = typeof(color) !== 'undefined' ? color : '#000';
    ctx.fill();
}

function drawCircle(ctx, x, y, radius, color, lineWidth) {
    ctx.beginPath();
    ctx.arc(x, y, radius, 0, Math.PI * 2);
    ctx.strokeStyle = typeof(color) !== 'undefined' ? color : '#000';
    ctx.lineWidth = typeof(lineWidth) !== 'undefined' ? lineWidth : 2;
    ctx.stroke();
}

function drawRect(ctx, x, y, width, height, color, lineWidth) {
    ctx.beginPath();
    ctx.rect(x, y, width, height);
    ctx.strokeStyle = typeof(color) !== 'undefined' ? color : '#000';
    ctx.lineWidth = typeof(lineWidth) !== 'undefined' ? lineWidth : 2;
    ctx.stroke();
}

function fillRect(ctx, x, y, width, height, color) {
    ctx.beginPath();
    ctx.fillStyle = typeof(color) !== 'undefined' ? color : '#000';
    ctx.fillRect(x, y, width, height);
}

function drawGrid(width, height, gridSize, ctx) {
    let rowLines = [],
        colLines = [];
    let xTotal = Math.ceil(height / gridSize),
        yTotal = Math.ceil(width / gridSize);
    for (let i = 0; i < xTotal; ++i) { // 横线
        drawLine(ctx, 0, gridSize * i - 0.5, width, gridSize * i - 0.5, '#ccc');
        rowLines.push(gridSize * i);
    }
    for (let i = 0; i < yTotal; ++i) { // 竖线
        drawLine(ctx, gridSize * i, 0, gridSize * i, height, '#ccc');
        colLines.push(gridSize * i);
    }
    console.log('rowlines:' + rowLines);
    console.log('collines:' + colLines);
    return { rowLines, colLines };
}

function drawVector(ctx, p1, p2, color, lineWidth) {
    typeof(color) === 'undefined' && (color = '#000');
    typeof(lineWidth) === 'undefined' && (lineWidth = 2);

    drawLine(ctx, p1.x, p1.y, p2.x, p2.y, color, lineWidth);
    // 计算p1p2相对于x轴俯角，移动旋转canvas坐标轴与p2p1重合，绘制完毕后相反操作还原上下文
    let theta = Math.atan(Math.abs(p1.x - p2.x) / Math.abs(p1.y - p2.y)),
        arrowLength = 10;

    // console.log(theta / Math.PI * 180);
    ctx.translate(p2.x, p2.y);
    if (p1.x >= p2.x && p1.y <= p2.y) { // p1在p2右上角
        // console.log('p1在p2右上角');
        ctx.rotate(-Math.PI / 2 + theta);
        drawLine(ctx, 0, 0, arrowLength, -arrowLength, color, lineWidth);
        drawLine(ctx, 0, 0, arrowLength, arrowLength, color, lineWidth);
        ctx.rotate(Math.PI / 2 - theta);
    } else if (p1.x < p2.x && p1.y < p2.y) { // 左上角
        // console.log('p1在p2左上角');
        ctx.rotate(-Math.PI / 2 - theta);
        drawLine(ctx, 0, 0, arrowLength, -arrowLength, color, lineWidth);
        drawLine(ctx, 0, 0, arrowLength, arrowLength, color, lineWidth);
        ctx.rotate(Math.PI / 2 + theta);
    } else if (p1.x < p2.x && p1.y > p2.y) { // 左下角
        // console.log('p1在p2左下角');
        ctx.rotate(Math.PI / 2 + theta);
        drawLine(ctx, 0, 0, arrowLength, -arrowLength, color, lineWidth);
        drawLine(ctx, 0, 0, arrowLength, arrowLength, color, lineWidth);
        ctx.rotate(-Math.PI / 2 - theta);
    } else if (p1.x > p2.x && p1.y > p2.y) { // 右下角
        // console.log('p1在p2右下角');
        ctx.rotate(Math.PI / 2 - theta);
        drawLine(ctx, 0, 0, arrowLength, -arrowLength, color, lineWidth);
        drawLine(ctx, 0, 0, arrowLength, arrowLength, color, lineWidth);
        ctx.rotate(-Math.PI / 2 + theta);
    }
    ctx.translate(-p2.x, -p2.y);
}

function getVector(p1, p2) {
    return { x: p2.x - p1.x, y: p2.y - p1.y };
}

function computeVectorMultiCross(p1, p2) {
    // 二维向量叉乘，结果仍为向量，其它维为0
    return p1.x * p2.y - p2.x * p1.y;
}