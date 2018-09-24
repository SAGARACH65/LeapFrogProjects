let canvas = document.getElementById("main-canvas");
let ctx = canvas.getContext("2d");
let gridSize = 14;
let nodeLength = 20;
let spacing=1;
let grid = [];
let drawGrid = () => {

    grid = new Array(gridSize);
    x = 0;
    while (x < gridSize) {
        grid[x] = new Array(gridSize);
        y = 0
        while ((y < gridSize)) {
            grid[x][y] = 0 //specifying empty space
            ctx.strokeStyle = "#a66";
            ctx.strokeRect(x * (nodeLength + spacing), y * (nodeLength + spacing), nodeLength, nodeLength);
            y = y + 1
        }
        x = x + 1
    }

}
let gameLoop = () => {

    drawGrid();
}

setInterval(gameLoop, 10);