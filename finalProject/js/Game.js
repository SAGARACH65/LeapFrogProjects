//position of sprite in the spritesheet
const CAR_CENTRE = {
    x: 0,
    y: 130,
    w: 69,
    h: 38
};
const CAR_LEFT = {
    x: 70,
    y: 130,
    w: 77,
    h: 38
};

const CAR_RIGHT = {
    x: 148,
    y: 130,
    w: 77,
    h: 38
};

let trackMap = [
    { type: 'straight', length: 100, curve: 20 },
    { type: 'curve', length: 100, curve: -50 },
    { type: 'straight', length: 100, curve: 50 },
    { type: 'straight', length: 100, curve: 50 }

];

const CAR_ACCELERATE = new Audio('../sounds/main-engine.wav');
const CAR_DECELERATE = new Audio('../sounds/car+geardown.mp3');
const CAR_SKID = new Audio('../sounds/skid.wav');
const CAR_START = new Audio('../sounds/carstartgarage.mp3');

class Game {
    constructor() {
        this.canvas = document.getElementById("main-canvas");
        this.canvas.setAttribute('width', '1024');
        this.canvas.setAttribute('height', '768');

        this.ctx = this.canvas.getContext("2d");

        this.position = 0;   //   Z position of the camera 

        this.isRightPressed = false;
        this.isLeftPressed = false;
        this.isUpPressed = false;
        this.isDownPressed = false;

        this.road = new Road();


        for (let x = 0; x < trackMap.length; x++) {
            this.addRoad(100, 100, 100, trackMap[x].curve)
        }

        this.player = new Player();

        this.carSprite = CAR_CENTRE;
        this.spriteSheet = new Image();

        this.drawPlayer = this.drawPlayer.bind(this);
        this.gameLoop = this.gameLoop.bind(this);
        this.keyDownHandler = this.keyDownHandler.bind(this);
        this.keyUpHandler = this.keyUpHandler.bind(this);
        this.start = this.start.bind(this);
    }

    addRoad(enter, hold, leave, curve) {
        var n;
        for (n = 0; n < enter; n++)
            this.road.initializeSegments(easeIn(0, curve, n / enter));

        for (n = 0; n < hold; n++)
            this.road.initializeSegments(curve);

        for (n = 0; n < leave; n++)
            this.road.initializeSegments(easeOut(curve, 0, n / leave));
    }

    drawRoad() {
        // //450*250 i.e after 250 segments start from the beginning
        // if (this.position > 112500) this.position = 0;

        this.road.drawRoad(this.ctx, this.position, this.player.playerX);
    }

    updatePlayerAsPerCurve() {
        let currentCurveIndex = this.road.findSegmentIndex(this.position);
        let currentCurve = this.road.segments[currentCurveIndex].curve;

        if (currentCurve !== 0) {
            this.player.updateXInCurve(currentCurve);
            // if (this.isLeftPressed || this.isRightPressed) CAR_SKID.play();
        }
    }

    update() {
        this.player.updateSpeed({ isUpPressed: this.isUpPressed, isDownPressed: this.isDownPressed });

        //we create a illusion of curve by moving the car as per the curve
        this.updatePlayerAsPerCurve();

        //we only update the x position only if car has certain speed   
        if (this.player.speed > 0) {
            if (this.isLeftPressed) this.player.updateX(-1);
            if (this.isRightPressed) this.player.updateX(+1);
        }
        this.position += this.player.speed;
    }

    drawBackground() {
        drawImage(this.ctx, '../images/b.png', 0, 0, 1050, 402);
    }

    drawPlayer() {
        this.player.draw(this.ctx, this.spriteSheet, this.carSprite, this.canvas.width / 2 + 30, 600);
    }

    gameLoop() {
        //  CLEARING THE SCREEN BEFORE EACH UPDATE
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

        this.drawBackground();
        this.drawRoad();
        this.drawPlayer();
        this.update();

        requestAnimationFrame(this.gameLoop);
    }

    keyDownHandler(e) {
        if (e.keyCode == 39) {
            this.isRightPressed = true;
            this.carSprite = CAR_RIGHT;
        }
        else if (e.keyCode == 37) {
            this.isLeftPressed = true;
            this.carSprite = CAR_LEFT;
        }
        else if (e.keyCode == 38) {
            this.isUpPressed = true;


        }
        else if (e.keyCode == 40) {
            this.isDownPressed = true;
        }
    }

    keyUpHandler(e) {
        if (e.keyCode == 39) {
            this.isRightPressed = false;
            this.carSprite = CAR_CENTRE;
        }
        else if (e.keyCode == 37) {
            this.isLeftPressed = false;
            this.carSprite = CAR_CENTRE;
        }
        else if (e.keyCode == 38) {
            this.isUpPressed = false;
        }
        else if (e.keyCode == 40) {
            this.isDownPressed = false;
        }
    }

    start() {
        //initial setup for the game
        document.addEventListener('keydown', this.keyDownHandler, false);
        document.addEventListener('keyup', this.keyUpHandler, false);

        //loading the sprites
        this.spriteSheet.src = "../images/spritesheet.high.png";

        requestAnimationFrame(this.gameLoop);

        CAR_START.play();
    }
}

const game = new Game();
game.start();