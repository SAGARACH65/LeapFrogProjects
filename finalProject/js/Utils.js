let drawPolygon = (ctx, x1, y1, x2, y2, x3, y3, x4, y4, color) => {
    ctx.fillStyle = color;
    ctx.beginPath();
    ctx.moveTo(x1, y1);
    ctx.lineTo(x2, y2);
    ctx.lineTo(x3, y3);
    ctx.lineTo(x4, y4);
    ctx.closePath();
    ctx.fill();
}

let drawRect = (ctx, xPos, yPos, width, height, color) => {
    ctx.beginPath();
    ctx.fillStyle = color;
    ctx.rect(xPos, yPos, width, height);
    ctx.fill();
    ctx.closePath();
}
let calculateSpeedAngle = (speedRatio, a, b) => {
    let degree = (a - b) * speedRatio + b;
    let radian = (degree * Math.PI) / 180;
    return radian <= 1.45 ? radian : 1.45;
}
let drawSpeedoMeterArc = (ctx, currentSpeed, topSpeed, colorGradient) => {
    ctx.beginPath();
    ctx.lineWidth = 20;
    ctx.strokeStyle = colorGradient;
    ctx.arc(360, ROAD_PARAM.CANVAS_HEIGHT - 230, 186, 0.6 * Math.PI, calculateSpeedAngle(currentSpeed / topSpeed, 83, 35) * Math.PI);
    ctx.stroke();
    ctx.closePath();
}

let drawImage = (ctx, src, x, y, width, height) => {
    let img = new Image();
    img.src = src;
    ctx.drawImage(img, x, y, width, height);
}

let getEnterCurvature = (currentSegment, goal, length) => {
    //getting equal increments so that we ca    n add in each segment
    let percent = goal / length;
    return currentSegment * percent + percent;
}

let getExitCurvature = (curvature, currentSegment, length) => {
    let percent = currentSegment / length;
    curvature -= percent;
    return curvature - percent;
}


let createSoundObject = location => {
    let sound = new Audio();
    let src = document.createElement("source");
    src.type = "audio/mpeg";
    src.src = location;
    sound.appendChild(src);
    return sound;
}

/**
 * 
 * @param {number}min-the minimum number which the function should return(default value is 1)
 * @param {number}max-the maximum number the function should return(default value is 0)
 * returns{number}
 */
let generateRandomNO = (max = 1, min = 0) => {
    return (Math.floor(Math.random() * (max - min + 1)) + min);
}


let storeHighScore = score => {
    localStorage.highScore = score;
}
let getHighScore = () => {
    return (parseInt(localStorage.highScore));
}
