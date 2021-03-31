import Phaser from 'phaser';
import { dialogueHelper } from '../cutscenes/cutscenes';
import quests from '../../quests/quests';

export default class Dialogue extends Phaser.Scene {
  constructor() {
    super('secondTestQuest');
  }

  playDialogue() {
    const textLines = ['Moo'];

    const nameTextLines = Array(textLines.length).fill('Big Piggy');

    dialogueHelper.call(this, textLines, nameTextLines);
  }

  playIncomplete() {
    const textLines = [
      `You've only killed ${this.killed} ${
        this.killed === 1 ? 'wolf' : 'wolves'
      }`,
      `You still have ${5 - this.killed} ${
        5 - this.killed === 1 ? 'wolf' : 'wolves'
      } left to kill!`,
      'Please hurry before they huff and puff',
    ];

    const nameTextLines = Array(textLines.length).fill('Little Piggy');

    dialogueHelper.call(this, textLines, nameTextLines);
  }

  playQuestOver() {
    const textLines = [
      'Thanks for everything!',
      'I feel safe to go to the market now',
    ];

    const nameTextLines = Array(textLines.length).fill('Little Piggy');

    dialogueHelper.call(this, textLines, nameTextLines);
  }

  endScene() {
    if (!quests[this.npc.name].isStarted) {
      const mainGame = this.scene.get('FgScene');
      mainGame.events.emit('startQuest');
      this.endCutScene();
    } else if (
      quests[this.npc.name].isStarted &&
      !quests[this.npc.name].isCompleted
    ) {
      this.endCutScene();
    } else {
      this.endCutScene();
    }
  }

  endCutScene() {
    this.scene.get('FgScene').events.emit('tutorialEnd');
    this.scene.stop();
  }

  create({ player, npc, data }) {
    this.player = player;
    this.npc = npc;

    if (data.killed) {
      this.killed = data.killed;
    }

    this.cursors = this.input.keyboard.addKeys({
      cont: Phaser.Input.Keyboard.KeyCodes.SPACE,
    });

    if (!quests[npc.name].isStarted) {
      this.playDialogue();
    } else if (quests[npc.name].isStarted && !quests[npc.name].isCompleted) {
      this.playIncomplete();
    } else {
      this.playQuestOver();
    }
  }
}
