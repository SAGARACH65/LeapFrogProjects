/**
 * It draws the speedometer and the steering on the screen
 */

class DashBoard {
    constructor() {
    }

    drawSteering(ctx, isRightPressed, isLeftPressed) {
        let degrees;

        if (isLeftPressed) degrees = +50;
        else if (isRightPressed) degrees = -50;
        else degrees = 0;

        ctx.save();
        ctx.translate(ROAD_PARAM.CANVAS_WIDTH - 300, ROAD_PARAM.CANVAS_HEIGHT - 200);
        // // rotate the canvas to the specified degrees
        ctx.rotate(degrees * Math.PI / 180);
        drawImage(ctx, '../images/steering_wheel-.png', -100, -100, 200, 200);
        // done with the rotating so restore the unrotated context
        ctx.restore();
    }

    drawSpeedometer(ctx) {
        drawImage(ctx, '../images/spedoMeter.png', 150, ROAD_PARAM.CANVAS_HEIGHT - 420, 421, 421);
    }

    drawProgressBar(ctx, baseSegment, totalSegments) {

        //drawing the background of the progressBar;
        drawRect(ctx, 700, ROAD_PARAM.CANVAS_HEIGHT - 150, 600, 50, 'rgba(0, 0, 0, 0.3)');

        let colorIncrement = baseSegment / totalSegments * 200;

        //gives different color depending on the progress
        drawRect(ctx, 700, ROAD_PARAM.CANVAS_HEIGHT - 150, baseSegment / totalSegments * 600, 50,
            `rgb(${255 - colorIncrement},${51 + colorIncrement},${0 + colorIncrement})`);
    }

    drawNitroMeter(ctx, fullNitro, remainingNitro) {

        drawRect(ctx, ROAD_PARAM.CANVAS_WIDTH - 100, 750, 50, -550, 'rgba(0, 0, 0, 0.3)');
        drawRect(ctx, ROAD_PARAM.CANVAS_WIDTH - 100, 750, 50, -(remainingNitro / fullNitro * 550), '#0BBEFC');
    }
}