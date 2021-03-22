import Phaser from 'phaser';

// The Main scene is the one that calls and loads the background and foreground
// This is so we can load both bg + fg together on top of each other.
export default class MainScene extends Phaser.Scene {
  constructor() {
    super('MainScene');
  }
  // preload() {
  //   this.load.image('apocalypse', 'assets/backgrounds/apocalypse.png');
  //   this.load.image('forest', 'assets/backgrounds/forest.png');
  //   this.load.image('bigBlast', 'assets/sprites/bigBlast.png');
  //   this.load.tilemapTiledJSON('map', 'assets/backgrounds/robot-test-map.json');
  //   this.load.spritesheet('player', 'assets/sprites/cyborg.png', {
  //     frameWidth: 47,
  //     frameHeight: 50,
  //   });
  //   this.load.spritesheet('enemy', 'assets/sprites/Walk.png', {
  //     frameWidth: 46,
  //     frameHeight: 48,
  //   });
  //   this.load.spritesheet('enemyPunch', 'assets/sprites/Punch_RightHand.png', {
  //     frameWidth: 48,
  //     frameHeight: 48,
  //   });
  //   this.load.audio('gg', 'assets/audio/SadTrombone.mp3');
  //   this.load.image('textBox', 'assets/sprites/PngItem_5053532.png');
  //   this.load.image('upgrade', 'assets/backgrounds/upgrade.jpg');
  // }

  create(data) {
    this.scene.launch('FgScene');
    // this.scene.start('PreGameScene');
    this.scene.launch('HUDScene');
  }
}
