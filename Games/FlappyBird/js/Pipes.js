class Pipes {

    constructor() {
        this.spacing = 26;
        this.top = Math.abs(Math.floor(Math.random() * (canvas.height / 2 - 10)) - this.spacing / 2) * 2 + 10; // ending position of the upper pole
        this.bottom = this.top + this.spacing; //starting position of the bottom tile
        this.speed = 1.8;
        this.isPassed = false; // to update the score if the tile has been passed
        this.x = canvas.width - 50;
        this.width = 35;
    }

    show() {
        let pipeImgTop = new Image();
        pipeImgTop.src = 'images/pipe-top.png';
        ctx.drawImage(pipeImgTop, this.x, 0, this.width, this.top);

        let pipeImgBottom = new Image();
        pipeImgBottom.src = 'images/pipe-bottom.png';
        ctx.drawImage(pipeImgBottom, this.x, this.bottom, this.width, canvas.height - this.bottom - 16);

    }

    update() {
        this.x -= this.speed;
    }

}