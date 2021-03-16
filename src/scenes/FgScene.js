import Phaser from 'phaser';

export default class FgScene extends Phaser.Scene {
  constructor() {
    super('BgScene');
  }

  preload() {
    // this.load.image('grid', '../../public/assets/backgrounds/grid.jpg');
  }

  create() {
    // this.add.image(-160, 0, 'grid').setOrigin(0).setScale(0.25);
  }
}
