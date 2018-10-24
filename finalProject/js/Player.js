class Player {
    constructor() {
        this.speed = 0;
        this.playerX = 0;
        this.nitro = 0;
    }

    //sign is the -1 or +1 depending on the 
    updateX(sign) {
        this.playerX += (sign * TURNING_SPEED);
    }

    updateXInCurve(curveValue) {
        if (this.speed > 50) this.playerX -= curveValue * CENTRIFUGAL_FORCE;
    }
  

    increaseNitro() {
        if (this.nitro + MAX_NITRO / 100 <= MAX_NITRO) this.nitro += MAX_NITRO / 100;
    }

    decreaseNitro() {
        (this.nitro - MAX_NITRO / 10 >= 0) ? this.nitro -= MAX_NITRO / 50 : this.nitro = 0;
    }

    updateSpeed(buttonState) {
        //changes the max speed and acceleration depending upon the position on the road and nitro
        let currentMaxSpeed, currentAcceleration = ACCELERATION;

        //changes max speed depending on the road type
        (this.playerX < -1.3 || this.playerX > 0.8) ? currentMaxSpeed = OFF_ROAD_MAX_SPEED : currentMaxSpeed = MAX_SPEED;

        //changes max speed depending upon nitro
        if (buttonState.isSpacePressed && this.nitro > 0) {

            currentMaxSpeed *= NITRO_INCREMENT;
            currentAcceleration *= NITRO_INCREMENT;
            this.decreaseNitro();
        }

        //if up button is pressed update speed of car
        if (buttonState.isUpPressed)
            (!(this.speed > currentMaxSpeed)) ? this.speed += currentAcceleration : this.speed = currentMaxSpeed;

        //if down button is pressed decrease the speed of the car
        if (buttonState.isDownPressed)
            (!(this.speed + BREAKING <= 0)) ? this.speed += BREAKING : this.speed = 0;

        // if no button is pressed constantly decrease the speed of the car
        if (!buttonState.isUpPressed && !buttonState.isDownPressed)
            (!(this.speed + DECELERATION <= 0)) ? this.speed += DECELERATION : this.speed = 0;
    }

    draw(ctx, spriteSheet, sprite, destX, destY) {
        ctx.drawImage(spriteSheet, sprite.x, sprite.y, sprite.w,
            sprite.h, destX, destY, PLAYER_WIDTH, PLAYER_HEIGHT);
    }

}   