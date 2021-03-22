import Phaser from 'phaser';

export default class UpgradeUI extends Phaser.Scene {
  constructor() {
    super('UpgradeUI');
  }

  returnToGame() {
    /*
      Function to return us to where we left off on FgScene
    */
    this.scene.transition({
      target: 'FgScene',
      duration: 1000,
      data: { player: this.player },
    });
  }

  create({ player }) {
    // The upgrade UI image
    this.add.sprite(350, 300, 'upgrade').setScale(1);

    // For now, just the return to FgScene button
    const text = this.add.text(290, 200, 'Go Back!');
    text.setInteractive({ useHandCursor: true }).on('pointerdown', () => {
      this.returnToGame();
    });
  }
}
