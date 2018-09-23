function Bird() {
    this.x = 50;
    this.y = canvas.height / 2 - 30;
    this.gravity = 1;
    this.score = 0;

    this.show = () => {
        let birdImg = new Image();
        birdImg.src = 'images/bird.png';
        ctx.drawImage(birdImg, this.x, this.y, 30, 11);
    }

    this.updatePerGravity = () => {
        this.y += this.gravity;
    }
    this.checkTopCollision = () => {
        //here 11 is the height of the bird and 30 is the width of the bird
        if (this.y + 11 < 0) {
            this.gravity = 0;
            //    console.log('game over');
            this.showGameOver();
        }
    }
    this.checkBottomCollision = () => {
        if (this.y + 11 > canvas.height - 16) {
            this.gravity = 0;
            this.showGameOver();
            //  console.log('game over');
        }
    }
    this.jumpBird = () => {
        //increases the coordinates of the bird when space is pressed
        this.y -= 25;
    }
    this.updateScore = () => {
        this.score++;
    }

    this.showGameOver = () => {
        ctx.fillText("                         Score:" + this.score, 10, canvas.height / 2 - 20);
        ctx.fillText("                         GAME OVER!!       ", 10, canvas.height / 2);
        ctx.fillText("     RESTART THE PAGE TO TRY AGAIN", 10, canvas.height / 2 + 20);
    }
}