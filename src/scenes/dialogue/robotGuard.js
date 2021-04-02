import Phaser from 'phaser';
import { dialogueHelper } from '../cutscenes/cutscenes';

export default class robotGuard extends Phaser.Scene {
  constructor() {
    super('robotGuard');
  }

  create({ player, npc }) {
    this.player = player;
    this.npc = npc;

    this.cursors = this.input.keyboard.addKeys({
      cont: Phaser.Input.Keyboard.KeyCodes.SPACE,
    });

    if (!this.player.inventory.clearanceChip) {
      this.playIncomplete();
    } else {
      this.playQuestOver();
    }
  }

  playIncomplete() {
    const textLines = [
      'Scanning',
      '...',
      "You do not have clearance to enter the robot king's lair.",
      'Leave now.',
    ];

    const nameTextLines = Array(textLines.length).fill('Guard');

    dialogueHelper.call(this, textLines, nameTextLines);
  }

  playQuestOver() {
    const textLines = [
      'Scanning',
      '...',
      'Clearance granted.',
      'You may enter.',
    ];

    const nameTextLines = Array(textLines.length).fill('Guard');

    dialogueHelper.call(this, textLines, nameTextLines);
  }

  endScene() {
    if (!this.player.inventory.clearanceChip) {
      this.endCutScene();
    } else {
      const mainGame = this.scene.get('RobotCityScene');
      mainGame.lairAccess = true;
      mainGame.cameras.main.fadeOut(500);
      this.time.delayedCall(500, () => {
        this.npc.setActive(false);
        this.npc.setVisible(false);
        mainGame.cameras.main.fadeIn(500);
        this.time.delayedCall(500, () => {
          this.endCutScene();
        });
      });
    }
  }

  endCutScene() {
    this.scene.get('RobotCityScene').events.emit('cutSceneEnd');
    this.scene.get('RobotCityScene').tooltip.destroy();
    this.scene.stop();
  }
}
