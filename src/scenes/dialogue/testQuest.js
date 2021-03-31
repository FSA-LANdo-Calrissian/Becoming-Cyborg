import Phaser from 'phaser';
import { dialogueHelper } from '../cutscenes/cutscenes';
import quests from '../../quests/quests';

export default class Dialogue extends Phaser.Scene {
  constructor() {
    super('testQuest');
  }

  playDialogue() {
    /*
      Function for the initializing the quest dialogue.
    */
    const textLines = [
      "I've got a quest for you",
      'I want to go to the market',
      'My brothers went to the market but I just stayed home',
      'and one of my brothers ran home crying weee weee weee',
      'Turns out, a wolf ate the rest of my brothers',
      'Kill wolves pls',
    ];

    let nameTextLines = Array(textLines.length).fill('Little Piggy');

    dialogueHelper.call(this, 0, textLines, nameTextLines);
  }

  playIncomplete() {
    /*
      Function for quest not yet complete dialogue.
    */
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

    dialogueHelper.call(this, 0, textLines, nameTextLines);
  }

  playQuestOver() {
    /*
      Function for after the quest has been handed in
    */
    const textLines = [
      'Thanks for everything!',
      'I feel safe to go to the market now',
    ];

    let nameTextLines = Array(textLines.length).fill('Little Piggy');

    dialogueHelper.call(this, 0, textLines, nameTextLines);
  }

  endScene() {
    /*
      Function to handle any animations or emitting you'll need in between dialogue. In this case, I only need to emit the startQuest event. I made the else if and the else in case I wanted to add more, but ended up not needing it, so it can be done with a simple else statement.
    */
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
    /*
      Finish and exit out of the cutscene.
    */
    this.scene.get('FgScene').events.emit('tutorialEnd');
    this.scene.stop();
  }

  create({ player, npc, data }) {
    /*
      Initialize all necessary variables and send to correct cutscene.
    */
    this.player = player;
    this.npc = npc;

    if (data.killed) {
      this.killed = data.killed;
    }

    this.cursors = this.input.keyboard.addKeys({
      cont: Phaser.Input.Keyboard.KeyCodes.SPACE,
    });

    if (!quests[npc.name].isStarted) {
      // If quest hasn't started yet, play start dialogue.
      this.playDialogue();
    } else if (quests[npc.name].isStarted && !quests[npc.name].isCompleted) {
      // If it's started, but not yet handed in, play this one.
      this.playIncomplete();
    } else {
      // If it's been handed in, play this one.
      this.playQuestOver();
    }
  }
}
