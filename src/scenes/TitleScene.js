import Phaser from 'phaser';

// The Main scene is the one that calls and loads the background and foreground
// This is so we can load both bg + fg together on top of each other.
export default class MainScene extends Phaser.Scene {
  constructor() {
    super('TitleScene');
    this.startLoadGame.bind(this);
    this.startNewGame.bind(this);
  }

  // Do all of our preloading here since it's the first scene.
  preload() {
    this.load.image('apocalypse', 'assets/backgrounds/apocalypse.png');
    this.load.image('forest', 'assets/backgrounds/forest.png');
    this.load.image('bigBlast', 'assets/sprites/bigBlast.png');
    this.load.tilemapTiledJSON('map', 'assets/backgrounds/robot-test-map.json');
    this.load.spritesheet('player', 'assets/sprites/cyborg.png', {
      frameWidth: 47,
      frameHeight: 50,
    });
    this.load.spritesheet('enemy', 'assets/sprites/Walk.png', {
      frameWidth: 46,
      frameHeight: 48,
    });
    this.load.spritesheet('enemyPunch', 'assets/sprites/Punch_RightHand.png', {
      frameWidth: 48,
      frameHeight: 48,
    });
    this.load.spritesheet(
      'upgradeStation',
      'assets/sprites/upgrade-station.png',
      {
        frameWidth: 144,
        frameHeight: 144,
      }
    );
    this.load.audio('gg', 'assets/audio/SadTrombone.mp3');
    this.load.image('textBox', 'assets/sprites/PngItem_5053532.png');
    this.load.image('upgrade', 'assets/backgrounds/upgrade.jpg');
    this.load.image('scroll', './assets/backgrounds/scroll.png');
    this.load.image('arrow', 'assets/backgrounds/arrow.png');
  }

  create(data) {
    // New game button - this is to see the pre-game scene
    this.newGame = this.add
      .text(350, 250, 'New Game')
      .setInteractive({ useHandCursor: true })
      .on('pointerup', () => this.startNewGame());

    // Load game button. This just skips the pre-game scene for now.
    this.loadGame = this.add
      .text(350, 350, 'Load Game')
      .setInteractive({ useHandCursor: true })
      .on('pointerup', () => this.startLoadGame());
  }

  startNewGame() {
    this.scene.start('PreGameScene');
  }
  startLoadGame() {
    this.scene.start('MainScene');
  }
}
