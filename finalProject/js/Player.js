let playerX = 0;                       // player x offset from center of road 
let playerZ = 20;                    // player relative z distance from camera 

const MAX_SPEED = 450;
const ACCELERATION = MAX_SPEED / 6;
const BREAKING = -MAX_SPEED;
const DECELERATION = -MAX_SPEED / 5;
const OFF_ROAD_DECELERATION = -MAX_SPEED / 2;
const OFF_ROAD_MAX_SPEED = MAX_SPEED / 4;


class Player {
    constructor() {
        this.speed = 20;

    }
    updateX(change) {
        playerX += change;
    }
    increasePosition() {
        position += this.speed;
    }

    draw(ctx, spriteSheet, sprite, destX, destY) {

        ctx.drawImage(spriteSheet, sprite.x, sprite.y, sprite.w,
            sprite.h, destX, destY, 120, 180);

    }

}   