import Phaser from 'phaser';

export default class BgScene extends Phaser.Scene {
  constructor() {
    super('BgScene');
  }

  preload() {
    this.load.image('sky', '../../public/assets/backgrounds/sky.png');
    // this.load.image('grid', '../../public/assets/backgrounds/grid.jpg');
  }

  create() {
    this.add.image(-160, 0, 'sky').setOrigin(0).setScale(0.5);
  }
}
