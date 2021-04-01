import Phaser from 'phaser';
import { dialogueHelper } from '../cutscenes/cutscenes';
import quests from '../../quests/quests';
import Quest from '../../entity/Quest';

export default class stacyQuest extends Phaser.Scene {
  constructor() {
    super('stacyQuest');
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
      console.log('Starting Robot City Quest');
      const mainGame = this.scene.get('RobotCityScene');
      mainGame[npc.name] = new Quest(mainGame, npc.name, npc);
      mainGame[npc.name].startQuest();
      this.scene.stop();
    } else if (quests[npc.name].isStarted && !quests[npc.name].isCompleted) {
      this.playIncomplete();
    } else {
      this.playQuestOver();
    }
  }

  playIncomplete() {
    const textLines = [
      `You've only killed ${this.killed} ${
        this.killed === 1 ? 'robot' : 'robots'
      }`,
      `You still have ${5 - this.killed} ${
        5 - this.killed === 1 ? 'robot' : 'robots'
      } left to kill!`,
      'Please hurry before they come after me.',
    ];

    const nameTextLines = Array(textLines.length).fill('Stacy');

    dialogueHelper.call(this, textLines, nameTextLines);
  }

  playQuestOver() {
    const textLines = [
      'Thanks for everything!',
      "You should be able to get into the robot king's lair now.",
    ];

    const nameTextLines = Array(textLines.length).fill('Stacy');

    dialogueHelper.call(this, textLines, nameTextLines);
  }

  endScene() {
    if (quests[this.npc.name].isStarted && !quests[this.npc.name].isCompleted) {
      this.endCutScene();
    } else {
      this.endCutScene();
    }
  }

  endCutScene() {
    this.scene.get('RobotCityScene').events.emit('cutSceneEnd');
    this.scene.stop();
  }
}
