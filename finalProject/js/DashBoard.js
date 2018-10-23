/**
 * It draws the speedometer and the steering on the screen
 */

class DashBoard {
    constructor() {
    }

    drawSteering(ctx) {
        drawImage(ctx, '../images/steering_wheel-.png', ROAD_PARAM.CANVAS_WIDTH - 400, ROAD_PARAM.CANVAS_HEIGHT - 300, 200, 200);
    }

    drawSpeedometer(ctx) {
        drawImage(ctx, '../images/spedoMeter.png', 150, ROAD_PARAM.CANVAS_HEIGHT - 420, 421, 421);
    }

    drawProgressBar(ctx, baseSegment, totalSegments) {

        //drawing the background of the progressBar;
        drawRect(ctx, 700, ROAD_PARAM.CANVAS_HEIGHT - 150, 600, 50, 'black');

        let colorIncrement = baseSegment / totalSegments * 200;

        //gives different color depending on the progress
        drawRect(ctx, 700, ROAD_PARAM.CANVAS_HEIGHT - 150, baseSegment / totalSegments * 600, 50,
            `rgb(${255 - colorIncrement},${51 + colorIncrement},${0 + colorIncrement})`);

    }
}