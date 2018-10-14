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

let drawImage = (ctx, src, x, y, width, height) => {
    var img = new Image();
    img.src = src;
    ctx.drawImage(img, x, y, width, height);
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
