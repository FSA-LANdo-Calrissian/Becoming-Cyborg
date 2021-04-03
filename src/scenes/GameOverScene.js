import Phaser from 'phaser';
import quests from '../quests/quests';

export default class GameOverScene extends Phaser.Scene {
  constructor() {
    super('GameOver');
    this.clickButton = this.clickButton.bind(this);
  }

  clickButton() {
    // Resets quests for last scene
    for (let quest in quests) {
      if (quests[quest].scene === this.lastScene.key) {
        quests[quest].isStarted = false;
        quests[quest].isCompleted = false;
        quests[quest].requirements = false;
        for (let req in quests[quest].objectiveReqs) {
          quests[quest].objectiveReqs[req] = false;
        }
      }
    }
    // Restarts last scene
    this.scene.stop();
    this.lastScene.scene.restart({ player: this.player });
    this.lastScene.initScene();
    this.scene.launch('HUDScene', { mainScene: this.lastScene.key });
  }

  create(data) {
    // Grabs last scene
    this.lastScene = data.scene;
    this.player = data.scene.restartData;

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
