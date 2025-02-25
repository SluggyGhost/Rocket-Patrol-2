class Play extends Phaser.Scene {
    constructor() {
        super("playScene")
    }

    create() {
        // place tile sprites
        this.starfield1 = this.add.tileSprite(0, 0, 640, 480, 'starfield1').setOrigin(0, 0)
        this.starfield2 = this.add.tileSprite(0, 0, 640, 480, 'starfield2').setOrigin(0, 0)
        // green UI background
        this.add.rectangle(0, borderUISize + borderPadding, game.config.width, borderUISize * 2, 0x00FF00).setOrigin(0,0)
        // white borders
        this.add.rectangle(0, 0, game.config.width, borderUISize, 0xFFFFFF).setOrigin(0,0)
        this.add.rectangle(0, game.config.height - borderUISize, game.config.width, borderUISize, 0xFFFFFF).setOrigin(0,0)
        this.add.rectangle(0, 0, borderUISize, game.config.height, 0xFFFFFF).setOrigin(0,0)
        this.add.rectangle(game.config.width - borderUISize, 0, borderUISize, game.config.height, 0xFFFFFF).setOrigin(0,0)

        // add rocket (p1)
        this.p1Rocket = new Rocket(this, game.config.width/2, game.config.height - borderUISize - borderPadding, 'rocket').setOrigin(0.5, 0)

        // add spaceships (x3 white, x1 gold)
        this.ship01 = new Spaceship(this, game.config.width + borderUISize*6, borderUISize*4, 'spaceship', 0, 30).setOrigin(0,0)
        this.ship02 = new Spaceship(this, game.config.width + borderUISize*3, borderUISize*5 + borderPadding*2, 'spaceship', 0, 20).setOrigin(0,0)
        this.ship03 = new Spaceship(this, game.config.width, borderUISize*6 + borderPadding*4, 'spaceship', 0, 10).setOrigin(0,0)
        this.ship04 = new Goldship(this, game.config.width, borderUISize*4, 'goldship', 0, 100).setOrigin(0, 0)

        // define keys
        keyFIRE = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.F)
        keyRESET = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.R)
        keyLEFT = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.LEFT)
        keyRIGHT = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.RIGHT)

        // initialize score
        this.p1Score = 0
        // set up configs for HUD
        let nameConfig = {
            fontFamily: 'Courier',
            fontSize: '14px',
            color: '#000000',
            align: 'center',
            padding: {
                top: 2,
                bottom: 2,
            },
            fixedWidth: 100
        }
        let scoreConfig = {
            fontFamily: 'Courier',
            fontSize: '28px',
            backgroundColor: '#F3B141',
            color: '#843605',
            align: 'right',
            padding: {
                top: 5,
                bottom: 5,
            },
            fixedWidth: 100
        }
        // SCORE
        this.scoreLeft = this.add.text(borderUISize + borderPadding, borderUISize + borderPadding*3, this.p1Score, scoreConfig)
        this.nameScoreLeft = this.add.text(borderUISize + borderPadding, borderUISize + borderPadding*1.25, 'SCORE', nameConfig)
        // TIME
        this.timeRemaining = game.settings.gameTimer/1000
        this.scoreCenter = this.add.text(game.config.width/2 - borderUISize - borderPadding, borderUISize + borderPadding*3, this.timeRemaining, scoreConfig)
        this.nameScoreCenter = this.add.text(game.config.width/2 - borderUISize - borderPadding, borderUISize + borderPadding*1.25, 'TIME', nameConfig)
        // HISCORE
        this.scoreRight = this.add.text(game.config.width - borderUISize*3.5 - borderPadding*3.5, borderUISize + borderPadding*3, highScore, scoreConfig)
        this.nameScoreRight = this.add.text(game.config.width - borderUISize*3.5 - borderPadding*3.5, borderUISize + borderPadding*1.25, 'HISCORE', nameConfig)

        // Clock Event
        this.timerEvent = this.time.addEvent({
            delay: 1000,    // 1 second
            callback: this.updateTime,
            callbackScope: this,
            loop: true, // Keep repeating
        })

        // GAME OVER flag
        this.gameOver = false
    }

    update() {
        // Update high score
        if(this.p1Score > highScore) {
            highScore = this.p1Score
            this.scoreRight.text = highScore
        }

        // check key input for restart
        if(this.gameOver && Phaser.Input.Keyboard.JustDown(keyRESET)) {
            this.scene.restart()
        }
        if(this.gameOver && Phaser.Input.Keyboard.JustDown(keyLEFT)) {
            this.scene.start("menuScene")
        }
        
        // Move the background
        this.starfield1.tilePositionX -= 1  // Farthest layer (slowest)
        this.starfield2.tilePositionX -= 2  // Closest layer (fastest)
        
        if(!this.gameOver){
            this.p1Rocket.update()  // update rocket sprite
            this.ship01.update()    // update spaceships (x3)
            this.ship02.update()
            this.ship03.update()
            this.ship04.update()    // update goldship
        }

        // check collisions
        if(this.checkCollision(this.p1Rocket, this.ship03)) {
            this.p1Rocket.reset()
            this.shipExplode(this.ship03)
            this.timeRemaining += 1;
        }
        if(this.checkCollision(this.p1Rocket, this.ship02)) {
            this.p1Rocket.reset()
            this.shipExplode(this.ship02)
            this.timeRemaining += 2;
        }
        if(this.checkCollision(this.p1Rocket, this.ship01)) {
            this.p1Rocket.reset()
            this.shipExplode(this.ship01)
            this.timeRemaining += 3;
        }
        if(this.checkCollision(this.p1Rocket, this.ship04)) {
            this.p1Rocket.reset()
            this.shipExplode(this.ship04)
            this.timeRemaining += 5;
        }
    }

    updateTime() {
        // Update clock
        if (this.timeRemaining > 0) {
            this.timeRemaining--;
            this.scoreCenter.text = this.timeRemaining;
        }

        // Check if time runs out
        if (this.timeRemaining <= 0) {
            this.timeRemaining = 0;
            this.gameOver = true;
            this.add.text(game.config.width / 2, game.config.height / 2, 'GAME OVER', {
                fontFamily: 'Courier',
                fontSize: '28px',
                color: '#843605',
            }).setOrigin(0.5);
            this.add.text(game.config.width / 2, game.config.height / 2 + 64, 'Press (R) to Restart or ← for Menu', {
                fontFamily: 'Courier',
                fontSize: '28px',
                color: '#843605',
            }).setOrigin(0.5);
        }
    }

    checkCollision(rocket, ship) {
        // simple AABB checking
        if (rocket.x < ship.x + ship.width && rocket.x + rocket.width > ship.x && rocket.y < ship.y + ship.height && rocket.height + rocket.y > ship.y) {
            return true
        } else {
            return false
        }
    }

    shipExplode(ship) {
        // temporarily hide ship
        ship.alpha = 0
        // create explosion sprite at ship's position
        let boom = this.add.sprite(ship.x, ship.y, 'explosion').setOrigin(0,0);
        boom.anims.play('explode')              // play explosion animation
        boom.on('animationcomplete', () => {    // callback after anim completes
            ship.reset()                        // reset ship position
            ship.alpha = 1                      // make ship visible again
            boom.destroy()                      // remove explosion sprite
        })
        // score add and text update
        this.p1Score += ship.points
        this.scoreLeft.text = this.p1Score

        this.sound.play('sfx-explosion')
    }

    // Method to handle missed shots
    onMissedShot() {
        this.timeRemaining -= 2;    // Decrease time on missed shot
        if (this.timeRemaining < 0) {
            this.timeRemaining = 0; // Ensure time does not go negative
        }
        this.scoreCenter.text = this.timeRemaining; // Update timer display
    }
}