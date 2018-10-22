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

const trackMap = [
    { type: 'straight', number: 100, curvature: 0 },
    { type: 'curve', number: 300, curvature: -50 },
    { type: 'straight', number: 300, curvature: 0 },
    { type: 'curve', number: 300, curvature: 50 },
    { type: 'curve', number: 300, curvature: 20 },
    { type: 'straight', number: 300, curvature: 0 },
];

const CAR_ACCELERATE = createSoundObject('../sounds/main-engine.wav');
const CAR_DECELERATE = createSoundObject('../sounds/car+geardown.mp3');
const CAR_SKID = createSoundObject('../sounds/skid.wav');
const CAR_START = createSoundObject('../sounds/carstartgarage.mp3');

class Game {
    constructor() {
        this.canvas = document.getElementById("main-canvas");
        this.canvas.setAttribute('width', '1920');
        this.canvas.setAttribute('height', '1080');

        this.ctx = this.canvas.getContext("2d");

        this.position = 0;   //   Z position of the camera 

        this.isRightPressed = false;
        this.isLeftPressed = false;
        this.isUpPressed = false;
        this.isDownPressed = false;

        this.road = new Road();

        //initialize the road object
        for (let x = 0; x < trackMap.length; x++) {
            this.addRoad(trackMap[x].number / 2, trackMap[x].curvature)
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

    enterSector(length, curvature) {
        for (let n = 0; n < length; n++)
            this.road.initializeSegments(getEnterCurvature(n, curvature, length));
    }

    exitSector(length, curvature) {
        for (let n = 0; n < length; n++)
            this.road.initializeSegments(getExitCurvature(curvature, n, length));
    }

    addRoad(length, curvature) {
        //sector are a potions of road. may be straight or curved
        //each sector is constructed using segments

        //enter the segments
        this.enterSector(length, curvature);

        //exit the segments
        this.exitSector(length, curvature);
    }

    drawRoad() {
        // //450*250 i.e after 250 segments start from the beginning
        // if (this.position > 112500) this.position = 0;

        this.road.drawRoad(this.ctx, this.position, this.player.playerX);
    }

    updatePlayerAsPerCurve() {
        let currentCurveIndex = this.road.findSegmentIndex(this.position);
        let currentCurve = this.road.segments[currentCurveIndex].curvature;

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
        drawImage(this.ctx, '../images/b.png', 0, 0, 1920, 549);
    }

    drawPlayer() {
        this.player.draw(this.ctx, this.spriteSheet, this.carSprite, this.canvas.width / 2 + 30, 600);
    }

    playSounds() {
        if (this.isUpPressed) CAR_ACCELERATE.play();
        if (this.isDownPressed) { CAR_ACCELERATE.pause(); CAR_DECELERATE.play(); }
        if ((this.isLeftPressed || this.isRightPressed)
            && this.road.segments[this.road.findSegmentIndex(this.position)].curvature != 0) CAR_SKID.play();
    }

    gameLoop() {
        //  CLEARING THE SCREEN BEFORE EACH UPDATE
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

        // this.playSounds();
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