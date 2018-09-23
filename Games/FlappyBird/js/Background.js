function Background() {

    this.showBackgroundImage = () => {
        let backgroundImg = new Image();
        backgroundImg.src = 'images/background.png';
        ctx.drawImage(backgroundImg, 0, 0, canvas.width, canvas.height);
    }
    this.showFloor = () => {
        let backgroundImg = new Image();
        backgroundImg.src = 'images/floor2.png';
        ctx.drawImage(backgroundImg, 0, canvas.height - 16, canvas.width, 12);
    }

    this.showFloor2 = () => {
        let backgroundImg = new Image();
        backgroundImg.src = 'images/floor.png';
        ctx.drawImage(backgroundImg, 0, canvas.height - 12, canvas.width, 12);
    }
}