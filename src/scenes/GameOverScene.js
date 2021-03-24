import Phaser from 'phaser';

export default class GameOverScene extends Phaser.Scene {
  constructor() {
    super('GameOver');
    this.clickButton = this.clickButton.bind(this);
  }

  clickButton() {
    // Restarts the game
    this.scene.start('MainScene');
  }

  create(data) {
    // Load the game over scroll
    this.add.sprite(390, 300, 'gameOver').setScale(1.5);

    // Add text
    this.add.text(290, 200, 'Game Over!');
    this.add.text(290, 275, `Kills: ${data.stats.kills}`);
    this.reset = this.add.text(290, 350, 'Restart Game!', { fill: '#0f0' });

    // Make the restart game text a button we can press to restart the game
    this.reset
      .setInteractive({ useHandCursor: true })
      .on('pointerdown', () => this.clickButton());
  }
}
