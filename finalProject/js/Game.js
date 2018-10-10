let canvas = document.getElementById("main-canvas");
canvas.setAttribute('width', '1024');
canvas.setAttribute('height', '768');
let ctx = canvas.getContext("2d");

let position = 0;                       // current camera Z position (add playerZ to get player's absolute Z position)


let isRightPressed = false,
    isLeftPressed = false,
    isUpPressed = false,
    isDownPressed = false;


let road = new Road();

let playerX = 0;                       // player x offset from center of road (-1 to 1 to stay independent of roadWidth)
let playerZ = 20;                    // player relative z distance from camera (computed)
let speed = 0;                       // current speed
let maxSpeed = SEGMENT_LENGTH * 60;      // top speed (ensure we can't move more than 1 segment in a single frame to make collision detection easier)
let accel = maxSpeed / 5;             // acceleration rate - tuned until it 'felt' right
let breaking = -maxSpeed;               // deceleration rate when braking
let decel = -maxSpeed / 5;             // 'natural' deceleration rate when neither accelerating, nor braking
let offRoadDecel = -maxSpeed / 2;             // off road deceleration is somewhere in between
let offRoadLimit = maxSpeed / 4;             // limit when off road deceleration no longer applies (e.g. you can always go at least this speed even when off road)


let drawRoad = () => {


    //for drawing we need to create the segments
    road.makeSegments();

    //450*250 i.e after 250 segments start from the beginning
    if (position > 112500) position = 0;

    road.drawRoad();

}


let update = () => {
    position += 20 * 10;

}
let gameLoop = () => {
    //  CLEARING THE SCREEN BEFORE EACH UPDATE
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    drawRoad();
    update();

    requestAnimationFrame(gameLoop);
}


let keyDownHandler = e => {
    if (e.keyCode == 39) {
        isRightPressed = true;
    }
    else if (e.keyCode == 37) {
        isLeftPressed = true;
    }
    else if (e.keyCode == 38) {
        isUpPressed = true;
    }
    else if (e.keyCode == 40) {
        isDownPressed = true;
    }
}

let keyUpHandler = e => {
    if (e.keyCode == 39) {
        isRightPressed = false;
    }
    else if (e.keyCode == 37) {
        isLeftPressed = false;
    }
    else if (e.keyCode == 38) {
        leftPressed = true;
    }
    else if (e.keyCode == 40) {
        isDownPressed = true;
    }
}

document.addEventListener('keydown', keyDownHandler, false);
document.addEventListener('keyup', keyUpHandler, false);

requestAnimationFrame(gameLoop);