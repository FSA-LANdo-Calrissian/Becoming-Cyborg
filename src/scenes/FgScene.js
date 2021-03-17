import Phaser from 'phaser';
import Player from '../entity/Player';

export default class FgScene extends Phaser.Scene {
  constructor() {
    super('FgScene');
  }

  preload() {
    this.load.spritesheet('player', '../../public/assets/sprites/josh.png', {
      frameWidth: 340,
      frameHeight: 460,
    });

    this.load.image('ball', '../../public/assets/sprites/enemy.png');
  }

  create() {
    // this.add.sprite(20, 400, 'ball');
    this.player = new Player(this, 20, 400, 'player').setScale(0.25);

    // this.ball = new Player(this, 20, 400, 'ball');

    this.cursors = this.input.keyboard.addKeys({
      up: Phaser.Input.Keyboard.KeyCodes.W,
      left: Phaser.Input.Keyboard.KeyCodes.A,
      down: Phaser.Input.Keyboard.KeyCodes.S,
      right: Phaser.Input.Keyboard.KeyCodes.D,
    });
  }

  update(time, delta) {
    this.player.update(this.cursors);
  }
}
