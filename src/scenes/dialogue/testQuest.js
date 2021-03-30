import Phaser from 'phaser';
import { advanceDialogue, generateDialogueUI } from '../cutscenes/cutscenes';
import quests from '../../quests/quests';

export default class Dialogue extends Phaser.Scene {
  constructor() {
    super('testQuest');
  }

  playDialogue() {
    const textLines = [
      "I've got a quest for you",
      'I want to go to the market',
      'My brothers went to the market but I just stayed home',
      'and one of my brothers ran home crying weee weee weee',
      'Turns out, a wolf ate the rest of my brothers',
      'Kill wolves pls',
    ];

    let nameTextLines = Array(textLines.length).fill('Little Piggy');

    generateDialogueUI.call(this, textLines, nameTextLines);

    advanceDialogue.call(
      this,
      0,
      this.textLines,
      this.textBox,
      this.nameText,
      this.nameTextLines,
      this.dialogueText
    );
  }

  playIncomplete() {
    const textLines = [
      `You've only killed ${this.killed} ${
        this.killed === 1 ? 'wolf' : 'wolves'
      }`,
      `You still have ${3 - this.killed} ${
        3 - this.killed === 1 ? 'wolf' : 'wolves'
      } left to kill!`,
      'Please hurry before they huff and puff',
    ];

    let nameTextLines = Array(textLines.length).fill('Little Piggy');

    generateDialogueUI.call(this, textLines, nameTextLines);

    advanceDialogue.call(
      this,
      0,
      this.textLines,
      this.textBox,
      this.nameText,
      this.nameTextLines,
      this.dialogueText
    );
  }

  playQuestOver() {
    const textLines = [
      'Thanks for everything!',
      'I feel safe to go to the market now',
    ];

    let nameTextLines = Array(textLines.length).fill('Little Piggy');

    generateDialogueUI.call(this, textLines, nameTextLines);

    advanceDialogue.call(
      this,
      0,
      this.textLines,
      this.textBox,
      this.nameText,
      this.nameTextLines,
      this.dialogueText
    );
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
