import Phaser from 'phaser';

export default class MainScene extends Phaser.Scene {
  constructor() {
    super('TitleScene');
    this.startLoadGame.bind(this);
    this.startNewGame.bind(this);
  }

  preload() {
    //Preloading all game assets
    this.load.tilemapTiledJSON(
      'tutorialMap',
      'assets/backgrounds/TutorialMap.json'
    );
    this.load.tilemapTiledJSON('map', 'assets/backgrounds/RobotCityMap.json');
    this.load.tilemapTiledJSON('bossMap', 'assets/backgrounds/bossRoom.json');

    this.load.spritesheet('player', 'assets/sprites/kick.png', {
      frameWidth: 48,
      frameHeight: 48,
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
    this.load.spritesheet('bittenNPC', 'assets/sprites/bitten.png', {
      frameWidth: 48,
      frameHeight: 48,
    });

    this.load.spritesheet('boss', 'assets/sprites/bossidle.png', {
      frameWidth: 426,
      frameHeight: 292,
    });

    this.load.spritesheet('bossattack', 'assets/sprites/bossattack.png', {
      frameWidth: 460,
      frameHeight: 298,
    });

    this.load.spritesheet('bossfistleft', 'assets/sprites/bossfistleft.png', {
      frameWidth: 149,
      frameHeight: 59,
    });

    this.load.spritesheet('bossfistright', 'assets/sprites/bossfistright.png', {
      frameWidth: 190,
      frameHeight: 75,
    });

    this.load.spritesheet('robotGuard', 'assets/sprites/robotGuard.png', {
      frameWidth: 65,
      frameHeight: 44,
    });

    this.load.spritesheet('fakeBot', 'assets/sprites/brittabot.png', {
      frameWidth: 40,
      frameHeight: 50,
    });

    this.load.spritesheet('packLeader', 'assets/sprites/hector.png', {
      frameWidth: 34,
      frameHeight: 41,
    });

    this.load.spritesheet('shockwave', 'assets/sprites/shockwave.png', {
      frameWidth: 20,
      frameHeight: 22,
    });

    this.load.spritesheet('firePillar', 'assets/sprites/firepillar.png', {
      frameWidth: 189,
      frameHeight: 191,
    });

    this.load.image('terrain', 'assets/backgrounds/terrain.png');
    this.load.image('worldTileset', 'assets/backgrounds/worldTileset.png');
    this.load.image('bigBlast', 'assets/sprites/bigBlast.png');
    this.load.image('fireBall', 'assets/sprites/fireBallArm.png');
    this.load.image('gun', 'assets/sprites/gunArm.png');
    this.load.image('knife', 'assets/sprites/knifeArm.png');
    this.load.image('button', 'assets/sprites/button.png');
    this.load.image('bullet', 'assets/sprites/bullet.png');
    this.load.image('blank', 'assets/sprites/blank.png');
    this.load.image('potion', 'assets/items/potion.png');
    this.load.image('iron', 'assets/items/iron.png');
    this.load.image('robotPart', 'assets/items/iron.png');
    this.load.image('oil', 'assets/items/oil.png');
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
    this.load.image(
      'TitleSceneBackground',
      'assets/backgrounds/TitleBackground.png'
    );
    this.load.image('ty', 'assets/backgrounds/thanks.png');
    this.load.image('end', 'assets/backgrounds/ending.png');
    this.load.image('target', 'assets/sprites/target.png');
    this.load.image('laser', 'assets/sprites/laz0r.png');
    this.load.image('title', 'assets/backgrounds/BecomingCyborg.png');

    this.load.audio('gg', 'assets/audio/SadTrombone.mp3');
    this.load.audio('bossTrack', 'assets/audio/bossTrack.mp3');
    this.load.audio('bossTrack2', 'assets/audio/bossTrack2.mp3');
    this.load.audio('bite', 'assets/audio/bite.wav');
    this.load.audio('fireBall', 'assets/audio/fireBall.wav');
    this.load.audio('gun', 'assets/audio/gun.wav');
    this.load.audio('knife', 'assets/audio/knife.wav');
    this.load.audio('laser', 'assets/audio/laser.wav');
    this.load.audio('punch', 'assets/audio/punch.wav');
    this.load.audio('RobotCityMusic', 'assets/audio/RobotCity.mp3');
    this.load.audio('scream', 'assets/audio/scream.wav');
    this.load.audio('TitleSceneMusic', 'assets/audio/TitleScene.mp3');
    this.load.audio('TutorialSceneMusic', 'assets/audio/TutorialScene.mp3');
    this.load.audio('upgradeStation', 'assets/audio/upgradeStation.wav');
    this.load.audio('robotPunch', 'assets/audio/robotPunch.wav');
  }

  create() {
    // Add Title Scene music
    this.TitleSceneMusic = this.sound.add('TitleSceneMusic', {
      loop: true,
      volume: 0.1,
    });
    this.TitleSceneMusic.play();

    // Background image
    this.background = this.add
      .image(300, 300, 'TitleSceneBackground')
      .setDisplaySize(1067, 600);

    this.title = this.add
      .image(400, 100, 'title')
      .setOrigin(0.5)
      .setScale(0.85);

    // New game button - this is to see the pre-game scene
    this.newGame = this.add
      .text(400, 230, 'Play Intro', {
        fill: '#000000',
        strokeThickness: 6,
        stroke: '#19FBFB',
      })
      .setFontSize(30)
      .setOrigin(0.5)
      .setInteractive({ useHandCursor: true })
      .on('pointerup', () => this.startNewGame());

    // Load game button. This just skips the pre-game scene for now.
    this.loadGame = this.add
      .text(400, 350, 'Skip Intro', {
        fill: '#000000',
        strokeThickness: 6,
        stroke: '#19FBFB',
      })
      .setFontSize(30)
      .setOrigin(0.5)
      .setInteractive({ useHandCursor: true })
      .on('pointerup', () => this.startLoadGame());

    this.controls = this.add.text(350, 500, 'Controls: ', {
      fill: '#19FBFB',
      strokeThickness: 6,
      stroke: '#000000',
    });
    this.wasd = this.add.text(338, 525, 'WASD to move', {
      fill: '#19FBFB',
      strokeThickness: 6,
      stroke: '#000000',
    });
    this.spacebar = this.add.text(
      220,
      550,
      'Spacebar to interact/advance dialogue',
      { fill: '#19FBFB', strokeThickness: 6, stroke: '#000000' }
    );
    this.rightClick = this.add.text(300, 575, 'Left click to attack', {
      fill: '#19FBFB',
      strokeThickness: 6,
      stroke: '#000000',
    });
  }

  startNewGame() {
    this.TitleSceneMusic.stop();
    this.scene.start('PreGameScene');
  }
  startLoadGame() {
    this.TitleSceneMusic.stop();
    this.scene.start('MainScene');
  }
}
