import Phaser from 'phaser';
import Player from '../entity/Player';
import Enemy from '../entity/Enemy';
import HealthBar from '../hud/HealthBar';
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
      key: 'enemyIdleLeft',
      frames: this.anims.generateFrameNumbers('enemy', {
        start: 10,
        end: 10,
      }),
      frameRate: 0,
      repeat: 0,
    });
  }

  updateEnemyMovement() {
    if (
      this.player.x - this.enemy.x >= 180 ||
      this.player.x - this.enemy.x >= -180
    ) {
      // if player to left of enemy AND enemy moving to right (or not moving)
      if (this.player.x < this.enemy.x && this.enemy.body.velocity.x >= 0) {
        // move enemy to left
        this.enemy.body.velocity.x = -150;
        this.enemy.enemyMovement('left');
      }
      // if player to right of enemy AND enemy moving to left (or not moving)
      else if (
        this.player.x > this.enemy.x &&
        this.enemy.body.velocity.x <= 0
      ) {
        // move enemy to right
        this.enemy.body.velocity.x = 150;
        this.enemy.enemyMovement('right');
      } else if (
        this.player.y < this.enemy.y &&
        this.enemy.body.velocity.y >= 0
      ) {
        this.enemy.body.velocity.y = -150;
        this.enemy.enemyMovement('up');
      } else if (
        this.player.y > this.enemy.y &&
        this.enemy.body.velocity.y <= 0
      ) {
        this.enemy.body.velocity.y = 150;
        this.enemy.enemyMovement('down');
      }
    }
  }

  create() {
    //map stuff
    const map = this.make.tilemap({ key: 'map' });

    const darkGrass = map.addTilesetImage('forest', 'forest');

    // const earthyTiles = map.addTilesetImage('sci-fi', 'earthy-tiles');

    const grassAndBuildings = map.addTilesetImage('apocalypse', 'apocalypse');

    // const extraBuildings = map.addTilesetImage(
    //   'apocalypse-extra',
    //   'extra-buildings'
    // );

    const belowLayer1 = map.createLayer('ground', darkGrass, 0, 0);

    // const belowLayer2 = map.createStaticLayer('ground', earthyTiles, 0, 0);

    // const belowLayer3 = map.createStaticLayer(
    //   'ground',
    //   grassAndBuildings,
    //   0,
    //   0
    // );

    const worldLayer1 = map.createLayer(
      'above-ground',
      grassAndBuildings,
      0,
      0
    );

    // const worldLayer2 = map.createStaticLayer(
    //   'above-ground',
    //   extraBuildings,
    //   0,
    //   0
    // );

    worldLayer1.setCollisionByProperty({ collides: true });

    // worldLayer2.setCollisionByProperty({ collides: true });
    // Spawning the player
    this.player = new Player(this, 20, 400, 'player').setScale(0.4);
    this.enemy = new Enemy(this, 760, 400, 'enemy').setScale(0.4);
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
    this.physics.add.collider(this.player, worldLayer1);
    this.physics.add.collider(this.player, this.enemy);
    this.physics.add.collider(this.enemy, worldLayer1);

    // Adding the minimap
    this.minimap = this.cameras
      .add(850, 10, 150, 150)
      .setZoom(0.5)
      .setName('minimap');
    this.minimap.setBackgroundColor(0x000000);
    this.minimap.startFollow(this.player, true, 1, 1);
    this.minimap.ignore(this.player.hpBar.bar);

    // Shaping the minimap + border?
    const minimapBorder = new Phaser.GameObjects.Graphics(this);
    minimapBorder.fillCircle(925, 85, 79);
    minimapBorder.fillStyle(0xffffff);
    const minimapCircle = new Phaser.GameObjects.Graphics(this);
    minimapCircle.fillCircle(925, 85, 75);
    const circle = new Phaser.Display.Masks.GeometryMask(this, minimapCircle);
    this.minimap.setMask(circle, true);

    this.camera = this.cameras.main;
    console.log(`testing...`, this.cameras);
    this.camera.setZoom(4.5);
    this.camera.startFollow(this.player);
    this.cursors = this.input.keyboard.addKeys({
      up: Phaser.Input.Keyboard.KeyCodes.W,
      left: Phaser.Input.Keyboard.KeyCodes.A,
      down: Phaser.Input.Keyboard.KeyCodes.S,
      right: Phaser.Input.Keyboard.KeyCodes.D,
    });

    // Adding world boundaries
    this.physics.world.setBounds(0, 0, 1024, 768);

    this.createAnimations();
  }

  update(time, delta) {
    this.player.update(this.cursors);
    this.updateEnemyMovement();
  }
}
