function init() {
    const width = window.innerWidth,
        height = window.innerHeight,
        gridSize = 80;
    let ctx, lctx, tctx, toctx, tfctx; // canvas上下文：基础/画线/画三角形/三角形单像素填充/三角形填充

    ctx = initCanvas('basic-canvas');
    let { rowLines, colLines } = drawGrid(width, height, gridSize, ctx);
    lctx = initCanvas('line-canvas');
    tctx = initCanvas('triangle-canvas');
    toctx = initCanvas('triangle-one-pixel-canvas');
    tfctx = initCanvas('triangle-fill-canvas');
    bindControls();

    // functions
    function initCanvas(id) {
        let canvasDom = document.createElement('canvas');
        canvasDom.id = id;
        document.querySelector('.canvas-container').appendChild(canvasDom);
        let canvas = document.querySelector('#' + id);
        canvas.style.position = 'absolute';
        canvas.style.top = '0';
        canvas.style.left = '0';
        canvas.style.display = 'block';
        canvas.width = width;
        canvas.height = height;
        return canvas.getContext('2d');
    }

    function bindControls() {
        const drawLineBtn = document.querySelector('.draw-line-btn'),
            drawTriangleBtn = document.querySelector('.draw-triangle-btn'),
            triangleOnePixelBtn = document.querySelector('.triangle-one-pixel-btn'),
            triangleFillBtn = document.querySelector('.triangle-fill-btn');

        triangleOnePixelBtn.style.visibility = 'hidden';
        triangleFillBtn.style.visibility = 'hidden';
        // 画线按钮点击事件
        drawLineBtn.addEventListener('click', () => {
            resetCanvas();
            drawLineBtn.style.visibility = 'hidden';
            drawTriangleBtn.style.visibility = 'visible';
            triangleOnePixelBtn.style.visibility = 'hidden';
            triangleFillBtn.style.visibility = 'hidden';
            drawRasterizationLine(width, height, gridSize, rowLines, colLines, lctx);
        }, false);
        // 画三角形按钮点击事件
        drawTriangleBtn.addEventListener('click', () => {
            resetCanvas();
            drawLineBtn.style.visibility = 'visible';
            drawTriangleBtn.style.visibility = 'hidden';
            drawRasterizationTriangle(width, height, gridSize, rowLines, colLines, tctx, toctx, tfctx)
        }, false);

        function resetCanvas() {
            lctx.clearRect(0, 0, width, height);
            tctx.clearRect(0, 0, width, height);
            toctx.clearRect(0, 0, width, height);
            tfctx.clearRect(0, 0, width, height);
        }
    }
}