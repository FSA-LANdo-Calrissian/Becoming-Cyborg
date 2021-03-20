import Phaser from 'phaser';

export default class GameOverScene extends Phaser.Scene {
  constructor() {
    super('GameOver');
    this.clickButton = this.clickButton.bind(this);
  }

  preload() {
    this.load.image('scroll', './assets/backgrounds/scroll.png');
  }

  clickButton() {
    console.log(`Clicked!`);
    this.scene.setVisible(false);
    this.scene.transition({
      target: 'FgScene',
      data: { choice: 'reset' },
    });
  }

  create(data) {
    this.add.sprite(350, 300, 'scroll').setScale(2);
    this.add.text(290, 200, 'Game Over!');
    this.add.text(290, 275, `Kills: ${data.stats.kills}`);
    this.reset = this.add.text(290, 350, 'Restart Game!', { fill: '#0f0' });
    this.reset
      .setInteractive({ useHandCursor: true })
      .on('pointerdown', () => this.clickButton());
  }
}
