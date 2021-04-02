import Phaser from 'phaser';

export default class MainScene extends Phaser.Scene {
  constructor() {
    super('TitleScene');
    this.startLoadGame.bind(this);
    this.startNewGame.bind(this);
  }

  preload() {
    //Preloading all game assets
    this.load.image('terrain', 'assets/backgrounds/terrain.png');
    this.load.image('worldTileset', 'assets/backgrounds/worldTileset.png');
    this.load.image('bigBlast', 'assets/sprites/bigBlast.png');
    this.load.image('fireBall', 'assets/sprites/fireBallArm.png');
    this.load.image('gun', 'assets/sprites/gunArm.png');
    this.load.image('knife', 'assets/sprites/knifeArm.png');
    this.load.image('button', 'assets/sprites/button.png');
    this.load.image('bullet', 'assets/sprites/bullet.png');

    this.load.tilemapTiledJSON(
      'tutorialMap',
      'assets/backgrounds/TutorialMap.json'
    );
    this.load.tilemapTiledJSON('map', 'assets/backgrounds/RobotCityMap.json');
    this.load.tilemapTiledJSON('bossMap', 'assets/backgrounds/bossRoom.json');

    this.load.spritesheet('player', 'assets/sprites/cyborg.png', {
      frameWidth: 47.888,
      frameHeight: 49,
    });
    this.load.spritesheet('meleeRobot', 'assets/sprites/Walk.png', {
      frameWidth: 46,
      frameHeight: 48,
    });
    this.load.spritesheet('drDang', 'assets/sprites/drDang.png', {
      frameWidth: 48,
      frameHeight: 48,
    });
    this.load.spritesheet(
      'meleeRobotAttack',
      'assets/sprites/Punch_RightHand.png',
      {
        frameWidth: 48,
        frameHeight: 48,
      }
    );
    this.load.spritesheet(
      'upgradeStation',
      'assets/sprites/upgrade-station.png',
      {
        frameWidth: 144,
        frameHeight: 144,
      }
    );
    this.load.spritesheet('wolf', 'assets/sprites/wolf.png', {
      frameWidth: 68,
      frameHeight: 68,
    });

    this.load.spritesheet('tutorialShoot', 'assets/sprites/Shoot.png', {
      frameWidth: 48,
      frameHeight: 48,
    });

    this.load.spritesheet('mac', 'assets/sprites/Mac.png', {
      frameWidth: 48,
      frameHeight: 48,
    });

    this.load.spritesheet('tutorialNPC', 'assets/sprites/camo.png', {
      frameWidth: 48,
      frameHeight: 49,
    });
    this.load.spritesheet('explode', 'assets/sprites/fieryexplode.png', {
      frameWidth: 128,
      frameHeight: 123,
    });
    this.load.spritesheet('stacy', 'assets/sprites/headnurse.png', {
      frameWidth: 48,
      frameHeight: 48,
    });

    this.load.audio('gg', 'assets/audio/SadTrombone.mp3');
    this.load.image('potion', 'assets/items/potion.png');
    this.load.image('iron', 'assets/items/iron.png');
    this.load.image('textBox', 'assets/sprites/PngItem_5053532.png');
    this.load.image('upgrade', 'assets/backgrounds/upgrade.jpg');
    this.load.image('gameOver', './assets/backgrounds/gg.jpg');
    this.load.image('arrow', 'assets/backgrounds/arrow.png');
    this.load.image('interact', 'assets/backgrounds/interact.png');
    this.load.image('minimap', 'assets/backgrounds/minimap.png');
    this.load.image('?', 'assets/backgrounds/question.png');
    this.load.image('bubble', 'assets/backgrounds/chatbubble.png');
    this.load.image('weaponHUD', 'assets/backgrounds/weaponHUD.png');
    this.load.image('none', 'assets/sprites/robotArmClosed.png');
  }

  create() {
    // New game button - this is to see the pre-game scene
    this.newGame = this.add
      .text(350, 200, 'New Game', { fill: '#0f0' })
      .setInteractive({ useHandCursor: true })
      .on('pointerup', () => this.startNewGame());

    // Load game button. This just skips the pre-game scene for now.
    this.loadGame = this.add
      .text(350, 300, 'Load Game', { fill: '#0f0' })
      .setInteractive({ useHandCursor: true })
      .on('pointerup', () => this.startLoadGame());

    this.controls = this.add.text(350, 350, 'Controls: ', { fill: '#f00' });
    this.wasd = this.add.text(338, 375, 'WASD to move', { fill: '#f00' });
    this.spacebar = this.add.text(
      220,
      400,
      'Spacebar to interact/advance dialogue',
      { fill: '#f00' }
    );
    this.rightClick = this.add.text(300, 425, 'Left click to attack', {
      fill: '#f00',
    });
  }

  startNewGame() {
    this.scene.start('PreGameScene');
  }
  startLoadGame() {
    this.scene.start('MainScene');
  }
}
