/*****************************************************************************
 * NAME: Joshua Acosta
 * TITLE: Rocket Patrol 2
 * TIME TO COMPLETION:
 * MODS CHOSEN:
 * > Track a high score that persists across scenes
 *      and display it in the UI (1)
 * > Display the time remaining (in seconds) on the screen (3)
 * > Create a new title sceen (e.g., new artwork, typography, layout) (3)
 * > Implement parallax scrolling for the background (3)
 * > Implement an alternating two-player mode (5)
 * > Implement a new timing/scoring mechanism that adds time to the clock
 *      for successful hits and subtracts time for misses (5)
 * SOURCES:
 * > ChatGPT
 *      - clock display:
 *      https://chatgpt.com/share/6797f85c-27e8-800c-acc9-31f5d0f924b8
 *      - parallax background:
 *      https://chatgpt.com/share/679846cd-b624-800c-aa9d-f62ab9e07379
 * 
 *****************************************************************************/
let config = {
    type: Phaser.AUTO,
    width: 640,
    height: 480,
    scene: [ Menu, Play, Play2 ]
}

let game = new Phaser.Game(config)
let highScore = 0

// reserve keyboard bindings
let keyFIRE, keyRESET, keyLEFT, keyRIGHT

// set UI sizes
let borderUISize = game.config.height / 15
let borderPadding = borderUISize / 3