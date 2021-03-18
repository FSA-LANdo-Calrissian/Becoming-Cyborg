import Phaser from 'phaser';

export default class BgScene extends Phaser.Scene {
  constructor() {
    super('BgScene');
  }

  preload() {
    this.load.image('sky', './assets/backgrounds/sky.png');
  }

  create() {
    this.add.image(-160, 0, 'sky').setOrigin(0).setScale(0.5);
  }
}
