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

let drawRect = function (ctx, xPos, yPos, width, height, color) {
    ctx.beginPath();
    ctx.fillStyle = color;
    ctx.rect(xPos, yPos, width, height);
    ctx.fill();
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


let createSoundObject = (location) => {
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
let generateRandomNO = function (max = 1, min = 0) {
    return (Math.floor(Math.random() * (max - min + 1)) + min);
}


let storeHighScore = function (score) {
    localStorage.highScore = score;
}
let getHighScore = function () {
    return (parseInt(localStorage.highScore));
}
