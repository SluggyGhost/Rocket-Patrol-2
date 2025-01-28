class Menu extends Phaser.Scene {
    constructor() {
        super("menuScene")
    }

    // load everything
    preload() {
        // load images/tile sprites
        this.load.image('rocket', './assets/rocket.png')
        this.load.image('spaceship', './assets/spaceship.png')
        this.load.image('goldship', './assets/smallship.png')
        this.load.image('starfield1', './assets/starfield1.png')
        this.load.image('starfield2', './assets/starfield2.png')
        this.load.image('backdrop', './assets/backdrop.png')

        // load spritesheet
        this.load.spritesheet('explosion', './assets/explosion.png', {
            frameWidth: 64,
            frameHeight: 32,
            startFrame: 0,
            endFrame: 9
        })

        // load audio
        this.load.audio('sfx-select', './assets/sfx-select.wav')
        this.load.audio('sfx-explosion', './assets/sfx-explosion.wav')
        this.load.audio('sfx-shot', './assets/sfx-shot.wav')
    }

    create() {
        // animation configuration
        this.anims.create({
            key: 'explode',
            frames: this.anims.generateFrameNumbers('explosion', { start: 0, end: 9, first: 0}),
            frameRate: 30
        })

        let titleConfig = {
            fontFamily: 'Courier',
            fontSize: '60px',
            color: '#FFC600',
            align: 'center',
            strokeThickness: 3
        }

        let menuConfig = {
            fontFamily: 'Courier',
            fontSize: '28px',
            backgroundColor: '#F3B141',
            color: '#843605',
            align: 'right',
            padding: {
                top: 5,
                bottom: 5,
            },
            fixedWidth: 0
        }

        // place the backdrop
        this.backdrop = this.add.image(game.config.width/2, game.config.height/2, 'backdrop')

        // display menu text
        this.add.text(game.config.width/2, 0 + borderUISize*3, 'ROCKET PATROL', titleConfig).setOrigin(0.5)
        titleConfig.fontSize = '80px'
        this.add.text(game.config.width/2, 0 + borderUISize*5, '2', titleConfig).setOrigin(0.5)
        this.add.text(game.config.width/2, game.config.height/2, 'Use ←→ arrows to move & (F) to fire', menuConfig).setOrigin(0.5)
        menuConfig.backgroundColor = '#005000'
        menuConfig.color = '#000'
        this.add.text(game.config.width/2, game.config.height/2 + borderUISize + borderPadding, 'Press ← for Novice or → for Expert', menuConfig).setOrigin(0.5)

        // define keys
        keyFIRE = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.F)
        keyLEFT = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.LEFT)
        keyRIGHT = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.RIGHT)
    }

    update() {
        // single player
        if (Phaser.Input.Keyboard.JustDown(keyLEFT)) {
            // easy mode
            game.settings = {
                goldshipSpeed: 3,
                spaceshipSpeed: 3,
                gameTimer: 60000
            }
            this.sound.play('sfx-select')
            this.scene.start('playScene')
        }
        if (Phaser.Input.Keyboard.JustDown(keyRIGHT)) {
            // hard mode
            game.settings = {
                goldshipSpeed: 5,
                spaceshipSpeed: 4,
                gameTimer: 45000
            }
            this.sound.play('sfx-select')
            this.scene.start('playScene')
        }
    }
}