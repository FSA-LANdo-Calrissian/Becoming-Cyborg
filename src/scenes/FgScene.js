import Phaser from 'phaser';
import Player from '../entity/Player';
import Enemy from '../entity/Enemy';
import Projectile from '../entity/Projectile';

export default class FgScene extends Phaser.Scene {
  constructor() {
    super('FgScene');
  }

  preload() {
    this.load.image('apocalypse', 'assets/backgrounds/apocalypse.png');
    this.load.image('forest', 'assets/backgrounds/forest.png');
    this.load.tilemapTiledJSON('map', 'assets/backgrounds/robot-test-map.json');
    this.load.spritesheet('player', './assets/sprites/cyborg.png', {
      frameWidth: 47,
      frameHeight: 50,
    });
    this.load.spritesheet('enemy', './assets/sprites/Walk.png', {
      frameWidth: 46,
      frameHeight: 48,
    });
    this.load.spritesheet(
      'enemyPunch',
      './assets/sprites/Punch_RightHand.png',
      {
        frameWidth: 48,
        frameHeight: 48,
      }
    );
    this.load.image('bigBlast', 'assets/sprites/bigBlast.png');
  }

  createAnimations() {
    this.anims.create({
      key: 'runLeft',
      frames: this.anims.generateFrameNumbers('player', {
        start: 1,
        end: 3,
      }),
      frameRate: 7,
      repeat: -1,
      yoyo: true,
    });

    this.anims.create({
      key: 'runRight',
      frames: this.anims.generateFrameNumbers('player', {
        start: 10,
        end: 12,
      }),
      frameRate: 7,
      repeat: -1,
      yoyo: true,
    });

    this.anims.create({
      key: 'runUp',
      frames: this.anims.generateFrameNumbers('player', {
        start: 28,
        end: 29,
      }),
      frameRate: 5,
      repeat: -1,
      yoyo: true,
    });

    this.anims.create({
      key: 'runDown',
      frames: this.anims.generateFrameNumbers('player', {
        start: 19,
        end: 21,
      }),
      frameRate: 5,
      repeat: -1,
      yoyo: true,
    });

    this.anims.create({
      key: 'idleRight',
      frames: this.anims.generateFrameNumbers('player', {
        start: 9,
        end: 9,
      }),
      frameRate: 0,
      repeat: 0,
    });

    this.anims.create({
      key: 'idleLeft',
      frames: this.anims.generateFrameNumbers('player', {
        start: 0,
        end: 0,
      }),
      frameRate: 0,
      repeat: 0,
    });

    this.anims.create({
      key: 'enemyRunLeft',
      frames: this.anims.generateFrameNumbers('enemy', {
        start: 9,
        end: 11,
      }),
      frameRate: 7,
      repeat: -1,
      yoyo: true,
    });

    this.anims.create({
      key: 'enemyRunRight',
      frames: this.anims.generateFrameNumbers('enemy', {
        start: 3,
        end: 5,
      }),
      frameRate: 7,
      repeat: -1,
      yoyo: true,
    });

    this.anims.create({
      key: 'enemyRunUp',
      frames: this.anims.generateFrameNumbers('enemy', {
        start: 6,
        end: 8,
      }),
      frameRate: 5,
      repeat: -1,
      yoyo: true,
    });

    this.anims.create({
      key: 'enemyRunDown',
      frames: this.anims.generateFrameNumbers('enemy', {
        start: 0,
        end: 2,
      }),
      frameRate: 5,
      repeat: -1,
      yoyo: true,
    });

    this.anims.create({
      key: 'enemyIdleRight',
      frames: this.anims.generateFrameNumbers('enemy', {
        start: 4,
        end: 4,
      }),
      frameRate: 0,
      repeat: 0,
    });

    this.anims.create({
      key: 'enemyPunchLeft',
      frames: this.anims.generateFrameNumbers('enemyPunch', {
        start: 9,
        end: 11,
      }),
      frameRate: 2,
      repeat: -1,
      yoyo: true,
    });

    this.anims.create({
      key: 'enemyPunchRight',
      frames: this.anims.generateFrameNumbers('enemyPunch', {
        start: 3,
        end: 5,
      }),
      frameRate: 2,
      repeat: -1,
      yoyo: true,
    });

    this.anims.create({
      key: 'enemyPunchUp',
      frames: this.anims.generateFrameNumbers('enemyPunch', {
        start: 6,
        end: 8,
      }),
      frameRate: 2,
      repeat: -1,
      yoyo: true,
    });

    this.anims.create({
      key: 'enemyPunchDown',
      frames: this.anims.generateFrameNumbers('enemyPunch', {
        start: 0,
        end: 2,
      }),
      frameRate: 2,
      repeat: -1,
      yoyo: true,
    });
  }

  create() {
    //map stuff
    this.map = this.make.tilemap({ key: 'map' });

    this.darkGrass = this.map.addTilesetImage('forest', 'forest');

    // const earthyTiles = this.map.addTilesetImage('sci-fi', 'earthy-tiles');

    this.grassAndBuildings = this.map.addTilesetImage(
      'apocalypse',
      'apocalypse'
    );

    // const extraBuildings = this.map.addTilesetImage(
    //   'apocalypse-extra',
    //   'extra-buildings'
    // );

    this.belowLayer1 = this.map.createLayer('ground', this.darkGrass, 0, 0);

    // const belowLayer2 = this.map.createStaticLayer('ground', earthyTiles, 0, 0);

    // const belowLayer3 = this.map.createStaticLayer(
    //   'ground',
    //   grassAndBuildings,
    //   0,
    //   0
    // );

    this.worldLayer1 = this.map.createLayer(
      'above-ground',
      this.grassAndBuildings,
      0,
      0
    );

    // const worldLayer2 = this.map.createStaticLayer(
    //   'above-ground',
    //   extraBuildings,
    //   0,
    //   0
    // );

    this.worldLayer1.setCollisionByProperty({ collides: true });

    const debugGraphics = this.add.graphics().setAlpha(0.75);
    this.worldLayer1.renderDebug(debugGraphics, {
      tileColor: null, // Color of non-colliding tiles
      collidingTileColor: new Phaser.Display.Color(243, 134, 48, 255), // Color of colliding tiles
      faceColor: new Phaser.Display.Color(40, 39, 37, 255), // Color of colliding face edges
    });

    // worldLayer2.setCollisionByProperty({ collides: true });

    // Spawning the player

    this.player = new Player(this, 20, 400, 'player').setScale(0.3);
    this.enemy = new Enemy(this, 760, 400, 'enemy').setScale(0.4);
    // Groups
    this.playerProjectiles = this.physics.add.group({
      classType: Projectile,
      runChildUpdate: true,
      maxSize: 30,
    });
    this.enemyProjectiles = this.physics.add.group({
      classType: Projectile,
      runChildUpdate: true,
      maxSize: 30,
    });

    // Collision logic
    this.physics.add.collider(this.player, this.worldLayer1);
    this.physics.add.collider(this.player, this.enemy);
    this.physics.add.overlap(this.player, this.enemy, () => {
      this.player.takeDamage(10);
    });
    this.physics.add.collider(this.enemy, this.worldLayer1);

    // Camera logic
    this.camera = this.cameras.main;
    this.camera.setZoom(4.5);
    this.camera.setBounds(0, 0, 1025, 768);
    this.camera.startFollow(this.player);

    // Keymapping
    this.cursors = this.input.keyboard.addKeys({
      up: Phaser.Input.Keyboard.KeyCodes.W,
      left: Phaser.Input.Keyboard.KeyCodes.A,
      down: Phaser.Input.Keyboard.KeyCodes.S,
      right: Phaser.Input.Keyboard.KeyCodes.D,
      hp: Phaser.Input.Keyboard.KeyCodes.H,
      speed: Phaser.Input.Keyboard.KeyCodes.I,
    });

    // Adding world boundaries
    // TODO: Fix world boundary when we finish tileset
    this.physics.world.setBounds(0, 0, 1024, 768);
    this.player.setCollideWorldBounds();
    this.enemy.setCollideWorldBounds();
    this.createAnimations();
  }

  update(time, delta) {
    this.player.update(this.cursors);
    this.enemy.update(this.player);
  }
}
