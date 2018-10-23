/**
 * It draws the speedometer and the steering on the screen
 */

class DashBoard {
    constructor() {

    }

    drawSteering(ctx) {
        drawImage(ctx, '../images/steering_wheel-.png', ROAD_PARAM.CANVAS_WIDTH - 400, ROAD_PARAM.CANVAS_HEIGHT - 300, 200, 200)
    }
    drawSpeedometer(ctx) {
        drawImage(ctx, '../images/spedoMeter.png', 300, ROAD_PARAM.CANVAS_HEIGHT - 420, 421, 421);
    }
}