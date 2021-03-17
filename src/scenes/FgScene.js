import Phaser from 'phaser';
import Player from '../entity/Player';
import Enemy from '../entity/Enemy';

export default class FgScene extends Phaser.Scene {
  constructor() {
    super('FgScene');
  }

  preload() {
    this.load.spritesheet('player', '../../public/assets/sprites/cyborg.png', {
      frameWidth: 47,
      frameHeight: 50,
    });
    this.load.spritesheet('enemy', '../../public/assets/sprites/Walk.png', {
      frameWidth: 41,
      frameHeight: 51,
    });
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
        end: 31,
      }),
      frameRate: 5,
      repeat: -1,
      yoyo: true,
    });

    this.anims.create({
      key: 'runDown',
      frames: this.anims.generateFrameNumbers('player', {
        start: 18,
        end: 27,
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

  create() {
    this.player = new Player(this, 20, 400, 'player').setScale(2);
    this.enemy = new Enemy(this, 760, 400, 'enemy').setScale(2);

    this.cursors = this.input.keyboard.addKeys({
      up: Phaser.Input.Keyboard.KeyCodes.W,
      left: Phaser.Input.Keyboard.KeyCodes.A,
      down: Phaser.Input.Keyboard.KeyCodes.S,
      right: Phaser.Input.Keyboard.KeyCodes.D,
    });

    this.createAnimations();
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
        this.enemyMovement('up');
      } else if (
        this.player.y > this.enemy.y &&
        this.enemy.body.velocity.y <= 0
      ) {
        this.enemy.body.velocity.y = 150;
        this.enemyMovement('down');
      }
    }
  }

  update(time, delta) {
    this.player.update(this.cursors);
    this.updateEnemyMovement();
  }
}
