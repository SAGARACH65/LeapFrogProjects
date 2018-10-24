const drawPolygon = (ctx, x1, y1, x2, y2, x3, y3, x4, y4, color) => {
    ctx.fillStyle = color;
    ctx.beginPath();
    ctx.moveTo(x1, y1);
    ctx.lineTo(x2, y2);
    ctx.lineTo(x3, y3);
    ctx.lineTo(x4, y4);
    ctx.closePath();
    ctx.fill();
}

const makeGradient = (ctx, startColor, endColor) => {
    let speedGradient = ctx.createLinearGradient(0, 1000, 0, 0)
    speedGradient.addColorStop(1, startColor);
    speedGradient.addColorStop(0, endColor);
    return speedGradient;
}

const drawRect = (ctx, xPos, yPos, width, height, color) => {
    ctx.beginPath();
    ctx.fillStyle = color;
    ctx.rect(xPos, yPos, width, height);
    ctx.fill();
    ctx.closePath();
}

const calculateSpeedAngle = (speedRatio, a, b) => {
    let degree = (a - b) * speedRatio + b;
    let radian = (degree * Math.PI) / 180;
    return radian <= 1.45 ? radian : 1.45;
}

const calculateRPMAngle = (speedRatio, a, b) => {
    let degree = (a - b) * (speedRatio) + b;
    let radian = (degree * Math.PI) / 180;
    return radian >= -0.46 ? radian : -0.46;
}

const drawSpeedoMeterArc = (ctx, colorGradient, x, y, radius, startAngle, endAngle, anticlockwise) => {
    ctx.beginPath();
    ctx.lineWidth = 33;
    ctx.strokeStyle = colorGradient;
    ctx.arc(x, y, radius, startAngle, endAngle, anticlockwise | false);
    ctx.stroke();
    ctx.closePath();
}

const drawImage = (ctx, src, x, y, width, height) => {
    let img = new Image();
    img.src = src;
    ctx.drawImage(img, x, y, width, height);
}

const getEnterCurvature = (currentSegment, goal, length) => {
    //getting equal increments so that we ca    n add in each segment
    let percent = goal / length;
    return currentSegment * percent + percent;
}

const getExitCurvature = (curvature, currentSegment, length) => {
    let percent = currentSegment / length;
    curvature -= percent;
    return curvature - percent;
}

const createSoundObject = location => {
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
const generateRandomNO = (max = 1, min = 0) => {
    return (Math.floor(Math.random() * (max - min + 1)) + min);
}


const storeHighScore = score => {
    localStorage.highScore = score;
}
const getHighScore = () => {
    return (parseInt(localStorage.highScore));
}
