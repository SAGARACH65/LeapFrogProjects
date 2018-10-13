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


class Game {
    constructor() {
        this.canvas = document.getElementById("main-canvas");
        this.canvas.setAttribute('width', '1024');
        this.canvas.setAttribute('height', '768');

       
        this.ctx = this.canvas.getContext("2d");

        this.position = 0;                       // current camera Z position 

        this.isRightPressed = false;
        this.isLeftPressed = false;
        this.isUpPressed = false;
        this.isDownPressed = false;

        this.road = new Road();
        this.player = new Player();
        this.carSprite = CAR_CENTRE;
        this.spriteSheet = new Image();

        // this.drawRoad = this.drawRoad.bind(this);
        // this.update = this.update.bind(this);
        // this.drawBackground = this.drawBackground.bind(this);
        this.drawPlayer = this.drawPlayer.bind(this);
        this.gameLoop = this.gameLoop.bind(this);
        this.keyDownHandler = this.keyDownHandler.bind(this);
        this.keyUpHandler = this.keyUpHandler.bind(this);
        this.start = this.start.bind(this);
    }

    drawRoad() {
        //for drawing we need to create the segments
        this.road.makeSegments();

        //450*250 i.e after 250 segments start from the beginning
        if (this.position > 112500) this.position = 0;

        this.road.drawRoad(this.ctx, this.position, this.player.playerX);
    }

    update() {
        this.player.updateSpeed({ isUpPressed: this.isUpPressed, isDownPressed: this.isDownPressed });

        //we only update the x position only if up key is pressed
        if (this.isUpPressed) {
            if (this.isLeftPressed) this.player.updateX(-0.02);
            if (this.isRightPressed) this.player.updateX(+0.02);
        }

        this.position += this.player.speed;
    }

    drawBackground() {
        drawImage(this.ctx, '../images/bg.png', 0, 0, 1050, 422);
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

    }


}

const game = new Game();
game.start();