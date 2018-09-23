class Bird {
    constructor() {
        this.x = 50;
        this.y = canvas.height / 2 - 30;
        this.gravity = 0.05;
        this.score = 0;
        this.velocity = 0;
    }

    show() {
        let birdImg = new Image();
        birdImg.src = 'images/bird.png';
        ctx.drawImage(birdImg, this.x, this.y, 30, 11);
    }

    updatePerGravity() {
        this.velocity += this.gravity;
        this.y += this.velocity;
    }

    checkTopCollision() {
        //here 11 is the height of the bird and 30 is the width of the bird
        if (this.y + 11 < 0) {
            this.velocity = 0;
            //    console.log('game over');
            isOver = true;
        }
    }

    checkBottomCollision() {
        if (this.y + 11 > canvas.height - 14) {
            this.velocity = 0;
            isOver = true;
            //  console.log('game over');
        }
    }

    jumpBird() {
        //increases the coordinates of the bird when space is pressed
        this.velocity = -0.9;
    }

    updateScore() {
        this.score++;
    }

    showScore() {
        ctx.fillText("Score:" + this.score, canvas.width - 50, 10);
    }

}