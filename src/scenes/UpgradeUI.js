import Phaser from 'phaser';

export default class UpgradeUI extends Phaser.Scene {
  constructor() {
    super('UpgradeUI');
  }

  returnToGame() {
    this.scene.transition({
      target: 'FgScene',
      duration: 1000,
      data: { player: this.player },
    });
  }

  preload() {
    // this.load.image('upgrade', 'assets/backgrounds/upgrade.jpg');
  }

  create({ player }) {
    this.add.sprite(350, 300, 'upgrade').setScale(1);

    const text = this.add.text(290, 200, 'Go Back!');
    text.setInteractive({ useHandCursor: true }).on('pointerdown', () => {
      this.returnToGame();
    });
  }
}
