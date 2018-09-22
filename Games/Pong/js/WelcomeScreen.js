let canvas = document.getElementById("main-canvas");
let ctx = canvas.getContext("2d");

//the player 1 plays with w&s whereas player 2 plays with the up and down keys
//for player1
let isWPressed = false,
    isSPressed = false;
//for player2
let isUpPressed = false,
    isDownPressed = false;
let Ball = {
    x: canvas.width / 2,
    y: canvas.height - 30
}

let Player1 = {
    x: 0,
    y: canvas.height / 2,
    score: 0
}
let Player2 = {
    x: canvas.width - 9,
    y: canvas.height / 2,
    score: 0
}

let playerHeight = 30;


let dx = 2,
    dy = -2,
    ballRadius = 3;

let drawBall = () => {
    ctx.beginPath();
    ctx.arc(Ball.x, Ball.y, ballRadius, 0, Math.PI * 2);
    ctx.fillStyle = "#fff";
    ctx.fill();
    ctx.closePath();
}

//draws the individual reactangle for the players
let drawPlayer = (playerX, playerY, width, height) => {
    ctx.beginPath();
    ctx.rect(playerX, playerY, width, height);
    ctx.fillStyle = "#fff";
    ctx.fill();
    ctx.closePath();
}

let drawPlayers = () => {
    //player1
    drawPlayer(Player1.x + 2, Player1.y, Player1.x + 7, playerHeight);
    //player2
    drawPlayer(Player2.x, Player2.y, 7, playerHeight);

}
let showScore = () => {
    ctx.font = "5px";
    ctx.fillText(Player1.score, 30, 20);
    ctx.fillText(Player2.score, canvas.width - 30, 20);
}

let changeAccordingToFlags = () => {
    if (isWPressed) {
        Player1.y -= 5;
    } else if (isSPressed) {
        Player1.y += 5;
    }
    if (isUpPressed) {
        Player2.y -= 5;
    } else if (isDownPressed) {
        Player2.y += 5;
    }
}

let checkIfPlayerIsBeyondScreen = () => {
    if (Player1.y < 0) Player1.y += 5;
    if (Player1.y + playerHeight > canvas.height) Player1.y -= 5;
    if (Player2.y < 0) Player2.y += 5;
    if (Player2.y + playerHeight > canvas.height) Player2.y -= 5;
}

let changeCoordinates = () => {
    //the coordinates are changed as per flags
    changeAccordingToFlags();

    // to stop the players from moving beyond the canvas , revert the changes 
    checkIfPlayerIsBeyondScreen();
}

let drawElements = () => {
    //CLEARING THE SCREEN BEFORE EACH UPDDATE
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    //changes the coordinates of the player as per the input flags 
    changeCoordinates();

    drawBall();
    drawPlayers();
    showScore();
}


let changePosition = () => {
    Ball.x += dx;
    Ball.y += dy;
}

let checkTopBottomCollision = () => {
    if (Ball.y + dy > canvas.height - ballRadius || Ball.y + dy < ballRadius) {
        dy = -dy;
    }
}
let checkBallPlayerCollision = () => {
    //change variable changes the orientation of the ball everytime a player hits it
    let change = Math.floor(Math.random() * 3);

    //checking ball collision for left player
    if ((Ball.x - ballRadius) <= (Player1.x + 9) &&
        (Ball.y + ballRadius >= (Player1.y)) &&
        (Ball.y + ballRadius <= Player1.y + playerHeight)) {
        //changing the direction of the ball
        dx = -dx;
        //changing the angle the ball is returned
        dy += change;
    }

    //checking ball collison for right player
    if ((Ball.x + ballRadius) >= (Player2.x) &&
        (Ball.y + ballRadius >= (Player2.y)) &&
        (Ball.y + ballRadius <= Player2.y + playerHeight)) {
             //changing the direction of the ball
        dx = -dx;
         //changing the angle the ball is returned
        dy += change;
    }

}
let resetBallLocation = direction => {

    Ball.x = canvas.width / 2;
    Ball.y = Math.floor(Math.random() * canvas.height);



    if (direction === "left") {
        dx = 2;
        dy = -2;
    } else {
        dx = -2;
        dy = 2;
    }
}
let checkRightLeftCollision = () => {
    if (Ball.x + dx > canvas.width - ballRadius) {
        resetBallLocation("right");
        Player1.score++;
    }
    if (Ball.x + dx < ballRadius) {
        resetBallLocation("left");
        Player2.score++;
    }
}

//checks collision and changes the direction of the incomming ball
let checkCollision = () => {
    //checking top and bottom collisons of the ball
    checkTopBottomCollision();

    //checking for ball collision with the players
    checkBallPlayerCollision();

    //checking left and right collisons and updating Score if the ball hits the wall
    checkRightLeftCollision();

}

let gameLoop = () => {
    drawElements();
    //updates the position of the ball with the velocity
    changePosition();
    checkCollision();

}

//handling user inputs
function keyDownHandler(e) {

    if (e.keyCode == 87) {
        isWPressed = true;
    } else if (e.keyCode == 83) {
        isSPressed = true;
    } else if (e.keyCode == 38) {
        isUpPressed = true;
    } else if (e.keyCode == 40) {
        isDownPressed = true;
    }
}

function keyUpHandler(e) {
    if (e.keyCode == 87) {
        isWPressed = false;
    } else if (e.keyCode == 83) {
        isSPressed = false;
    } else if (e.keyCode == 38) {
        isUpPressed = false;
    } else if (e.keyCode == 40) {
        isDownPressed = false;
    }
}

document.addEventListener("keydown", keyDownHandler, false);
document.addEventListener("keyup", keyUpHandler, false);

setInterval(gameLoop, 10);