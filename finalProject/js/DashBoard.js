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

    drawSpeed(ctx, currentSpeed, maxSpeed) {
        let speed = Math.ceil(currentSpeed / maxSpeed * 160);
        ctx.font = '700 60px Open Sans';
        ctx.textAlign = 'center';
        ctx.fillStyle = 'white';
        ctx.fillText(speed, 360, 843);
    }
    drawSpeedNeedle() {

    }
    drawRPMNeedle() {

    }
    drawSpeedometer(ctx, currentSpeed, maxSpeed) {

        drawImage(ctx, '../images/spedoMeter.png', 150, ROAD_PARAM.CANVAS_HEIGHT - 420, 421, 421);
        this.drawSpeed(ctx, currentSpeed, maxSpeed);
        this.drawSpeedNeedle();
        this.drawRPMNeedle();
    }

    drawProgressBar(ctx, baseSegment, totalSegments) {

        //drawing the background of the progressBar;
        drawRect(ctx, 700, ROAD_PARAM.CANVAS_HEIGHT - 150, 600, 50, 'rgba(0, 0, 0, 0.3)');

        let colorIncrement = baseSegment / totalSegments * 200;

        // //gives different color depending on the progress
        // drawRect(ctx, 700, ROAD_PARAM.CANVAS_HEIGHT - 150, baseSegment / totalSegments * 600, 50,
        //     `rgb(${255 - colorIncrement},${51 + colorIncrement},${0 + colorIncrement})`);

        let progressGradient = ctx.createLinearGradient(0, 0, 1000, 0)
        progressGradient.addColorStop(0, '#43e97b ');
        progressGradient.addColorStop(1, '#38f9d7');
        drawRect(ctx, 700, ROAD_PARAM.CANVAS_HEIGHT - 150, baseSegment / totalSegments * 600, 50, progressGradient);

    }

    drawNitroMeter(ctx, fullNitro, remainingNitro) {
        //background of the progress bar
        drawRect(ctx, ROAD_PARAM.CANVAS_WIDTH - 100, 750, 50, -550, 'rgba(0, 0, 0, 0.3)');

        let percentageCompleted = remainingNitro / fullNitro;
        let speedGradient, speedGradient2;
        if (percentageCompleted < 0.6) {
            speedGradient = ctx.createLinearGradient(0, 500, 0, 0)
            speedGradient.addColorStop(0, '#00b8fe');
            speedGradient.addColorStop(1, '#42dcf4');
        }
        {
            speedGradient2 = ctx.createLinearGradient(0, 1000, 0, 0)
            speedGradient2.addColorStop(0, '#f7b733');
            speedGradient2.addColorStop(1, '#fc4a1a');
        }
        drawRect(ctx, ROAD_PARAM.CANVAS_WIDTH - 100, 750, 50, -(percentageCompleted * 550), speedGradient || speedGradient2);
    }
}