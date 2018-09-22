console.log('hello');
let canvas = document.getElementById("main-canvas");
let ctx = canvas.getContext("2d");

let x = canvas.width / 2;
let y = canvas.height - 30;

let dx = 3,
    dy = -3,
    ballRadius = 5;

let drawBall = () => {
    //CLEARING THE SCREEN BEFORE EACH UPDDATE
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.beginPath();
    ctx.arc(x, y, ballRadius, 0, Math.PI * 2);
    ctx.fillStyle = "#0095DD";
    ctx.fill();
    ctx.closePath();
}
let changePosition = () => {
    x += dx;
    y += dy;
}
let checkCollision = () => {

    //checking top and bottom collisons
    if (y + dy > canvas.height - ballRadius || y + dy < ballRadius) {
        dy = -dy;
    }
    //checking left and right collison
    if (x + dx > canvas.width - ballRadius || x + dx < ballRadius) {
        dx = -dx;
    }


}

let gameLoop = () => {
    drawBall();
    changePosition();
    checkCollision();

}

setInterval(gameLoop, 10);