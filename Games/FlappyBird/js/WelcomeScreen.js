let canvas = document.getElementById("main-canvas");
let ctx = canvas.getContext("2d");

let showElements = () => {
    background.showBackgroundImage();
    background.showFloor2();
    background.showFloor();
    bird.show();
}

let updateElements = () => {
    bird.updatePerGravity();
}

let checkBottomTopCollision = () => {
    bird.checkTopCollision();
    bird.checkBottomCollision();
}

let checkCollision = () => {
    //checks collision with te top and bottom
    checkBottomTopCollision();

    //checks collision with the pipes
    //TODO add later here
}

let gameLoop = () => {
    //clears the objects in every window
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    //renders all the game elements
    showElements();

    //updates the position of all elements
    updateElements();

    //checks the collison with the top/bottom and with the pipes
    checkCollision();
}

function SpaceHandler(e) {
    if (e.keyCode == 32) {
        bird.jumpBird();
    }
}

document.addEventListener("keydown", SpaceHandler, false);

let bird = new Bird();
let background = new Background();
let pipes=new Pipes();

//running the loop every 10 milliseconds for 60fps.
setInterval(gameLoop, 10);