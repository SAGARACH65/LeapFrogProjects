let canvas = document.getElementById("main-canvas");
let ctx = canvas.getContext("2d");

//the player 1 plays with w&s whereas player 2 plays with the up and down keys
//for player1
let isWPressed = false,
    isSPressed = false;
//for player2
let isUpPressed = false,
    isDownPressed = false;


let xBall = canvas.width / 2;
let yBall = canvas.height - 30;

let playerHeight = 30;
let player1StartingYPos = canvas.height / 2;
let player2StartingYPos = canvas.height / 2;

let player1StartingXPos = 0;
let player2StartingXPos = canvas.width - 9;
let scorePlayer1 = 0,
    scorePlayer2 = 0;

let dx = 2.5,
    dy = -2.5,
    ballRadius = 3;

let drawBall = () => {
    ctx.beginPath();
    ctx.arc(xBall, yBall, ballRadius, 0, Math.PI * 2);
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
    drawPlayer(player1StartingXPos + 2, player1StartingYPos, player1StartingXPos + 7, playerHeight);
    //player2
    drawPlayer(player2StartingXPos, player2StartingYPos, 7, playerHeight);

}
let showScore = () => {
    ctx.font = "5px";
    ctx.fillText(scorePlayer1, 30, 20);
    ctx.fillText(scorePlayer2, canvas.width - 30, 20);
}

let changeAccordingToFlags = () => {
    if (isWPressed) {
        player1StartingYPos -= 5;
    } else if (isSPressed) {
        player1StartingYPos += 5;
    }
    if (isUpPressed) {
        player2StartingYPos -= 5;
    } else if (isDownPressed) {
        player2StartingYPos += 5;
    }
}

let checkIfPlayerIsBeyondScreen = () => {
    if (player1StartingYPos < 0) player1StartingYPos += 5;
    if (player1StartingYPos + playerHeight > canvas.height) player1StartingYPos -= 5;
    if (player2StartingYPos < 0) player2StartingYPos += 5;
    if (player2StartingYPos + playerHeight > canvas.height) player2StartingYPos -= 5;
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
    xBall += dx;
    yBall += dy;
}

let checkTopBottomCollision = () => {
    if (yBall + dy > canvas.height - ballRadius || yBall + dy < ballRadius) {
        dy = -dy;
    }
}
let checkBallPlayerCollision = () => {

    //checking ball collision for left player
    if ((xBall - ballRadius) <= (player1StartingXPos + 9) &&
        (yBall + ballRadius >= (player1StartingYPos)) &&
        (yBall + ballRadius <= player1StartingYPos + playerHeight)) {
        dx = -dx;

    }

    //checking ball collison for right player
    if ((xBall + ballRadius) >= (player2StartingXPos) &&
        (yBall + ballRadius >= (player2StartingYPos)) &&
        (yBall + ballRadius <= player2StartingYPos + playerHeight)) {
        dx = -dx;
    }

}
let resetBallLocation = direction => {
   
    xBall =canvas.width/2;
    yBall = Math.floor(Math.random()*canvas.height);

    if (direction === "left") {
        dx = 2.5;
        dy = -2.5;
    } else {
        dx = -2.5;
        dy = 2.5;
    }
}
let checkRightLeftCollision = () => {
    if (xBall + dx > canvas.width - ballRadius) {
        resetBallLocation("right");
        scorePlayer1++;
    }
    if (xBall + dx < ballRadius) {
        resetBallLocation("left");
        scorePlayer2++;
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