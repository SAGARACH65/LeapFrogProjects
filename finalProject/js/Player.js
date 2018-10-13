
let playerZ = 0;                    // player relative z distance from camera 

const MAX_SPEED = 750;
const ACCELERATION = MAX_SPEED / 60;
const BREAKING = -MAX_SPEED / 30;
const DECELERATION = -MAX_SPEED / 120;
const OFF_ROAD_MAX_SPEED = MAX_SPEED / 4;


class Player {
    constructor() {
        this.speed = 0;
        this.playerX = 0;
    }

    updateX(change) {
        this.playerX += change;
    }

    updateSpeed(buttonState) {
        //changes the max spped depending upon the posiiton on the road
        let currentMaxSpeed;
        (this.playerX < -1.3 || this.playerX > 0.8) ? currentMaxSpeed = OFF_ROAD_MAX_SPEED : currentMaxSpeed = MAX_SPEED;


        //if up button is pressed update speed of car
        if (buttonState.isUpPressed)
            (!(this.speed > currentMaxSpeed)) ? this.speed += ACCELERATION : this.speed = currentMaxSpeed;

        //if down button is pressed decrease the speed of the car
        if (buttonState.isDownPressed)
            (!(this.speed + BREAKING <= 0)) ? this.speed += BREAKING : this.speed = 0;

        // if no button is pressed constantly decrease the speed of the car
        if (!buttonState.isUpPressed && !buttonState.isDownPressed)
            (!(this.speed + DECELERATION <= 0)) ? this.speed += DECELERATION : this.speed = 0;

    }

    draw(ctx, spriteSheet, sprite, destX, destY) {
        ctx.drawImage(spriteSheet, sprite.x, sprite.y, sprite.w,
            sprite.h, destX, destY, 120, 140);
    }

}   