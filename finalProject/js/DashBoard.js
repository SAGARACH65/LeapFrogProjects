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

        ctx.restore();
    }

    drawSpeed(ctx, currentSpeed, maxSpeed) {
        let speed = Math.ceil(currentSpeed / maxSpeed * 160);
        writeText(ctx, 360, 820, speed, '700 45px  NeuroPol', 'white');
    }

    drawSpeedNeedle(ctx, currentSpeed, maxSpeed) {
        let colorGradient = makeGradient(ctx, '#41dcf4', '#00b8fe');

        drawSpeedoMeterArc(ctx, colorGradient, 360, ROAD_PARAM.CANVAS_HEIGHT - 230, 186, 0.6 * Math.PI,
            calculateSpeedAngle(currentSpeed / maxSpeed, 83, 35) * Math.PI);
    }

    drawRPMNeedle(ctx, currentSpeed, maxSpeed) {
        let colorGradient = makeGradient(ctx, '#f7b733', '#fc4a1a');

        let rpm = currentSpeed / maxSpeed * 7;
        drawSpeedoMeterArc(ctx, colorGradient, 360, ROAD_PARAM.CANVAS_HEIGHT - 230, 186, .4 * Math.PI,
            calculateRPMAngle(rpm, 0, 22) * Math.PI, true);
    }

    drawSpeedometer(ctx, currentSpeed, maxSpeed) {

        drawImage(ctx, '../images/spedoMeterTrans.png', 150, ROAD_PARAM.CANVAS_HEIGHT - 440, 420, 420);
        this.drawSpeed(ctx, currentSpeed, maxSpeed);
        this.drawSpeedNeedle(ctx, currentSpeed, maxSpeed);
        this.drawRPMNeedle(ctx, currentSpeed, maxSpeed);
    }

    drawProgressBar(ctx, baseSegment, totalSegments) {

        //drawing the background of the progressBar;
        drawRect(ctx, 700, ROAD_PARAM.CANVAS_HEIGHT - 150, 600, 50, 'rgba(0, 0, 0, 0.3)');

        // let colorIncrement = baseSegment / totalSegments * 200;
        // //gives different color depending on the progress
        // drawRect(ctx, 700, ROAD_PARAM.CANVAS_HEIGHT - 150, baseSegment / totalSegments * 600, 50,
        //     `rgb(${255 - colorIncrement},${51 + colorIncrement},${0 + colorIncrement})`);

        let progressGradient = makeGradient(ctx, '#43e97b', '#38f9d7');
        let width;

        //this is added just to stop the progress bar from moving beyond the background
        (baseSegment <= totalSegments) ? width = baseSegment / totalSegments * 600 : width = 600;

        drawRect(ctx, 700, ROAD_PARAM.CANVAS_HEIGHT - 150, width, 50, progressGradient);

    }


    drawNitroMeter(ctx, fullNitro, remainingNitro) {

        //background of the progress bar
        drawRect(ctx, ROAD_PARAM.CANVAS_WIDTH - 100, 750, 50, -550, 'rgba(0, 0, 0, 0.3)');

        let percentageCompleted = remainingNitro / fullNitro;
        let speedGradient, speedGradient2;

        (percentageCompleted < 0.6) ? (speedGradient = makeGradient(ctx, '#00b8fe', '#42dcf4'))
            : (speedGradient2 = makeGradient(ctx, '#fc4a1a', '#f7b733'))

        drawRect(ctx, ROAD_PARAM.CANVAS_WIDTH - 100, 750, 50, -(percentageCompleted * 550), speedGradient || speedGradient2);
    }
}