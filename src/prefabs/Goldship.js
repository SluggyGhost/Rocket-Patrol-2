// Spaceship prefab for golden ship
class Goldship extends Phaser.GameObjects.Sprite {
    constructor(scene, x, y, texture, frame, pointValue) {
        super(scene, x, y, texture, frame)
        scene.add.existing(this)    // add to existing frame
        this.points = pointValue    // store pointValue
        this.moveSpeed = game.settings.goldshipSpeed
    }

    update() {
        // move Spaceship left
        this.x -= this.moveSpeed
        
        // wrap from left to right edge
        if(this.x <= 0 - this.width) {
            this.x = game.config.width
        }
    }

    // reset position
    reset() {
        this.x = game.config.width
    }
}