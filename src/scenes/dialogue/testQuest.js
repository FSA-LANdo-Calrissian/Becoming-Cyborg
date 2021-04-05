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
      "You've got to help me!",
      'Robots just came through here and destroyed the town!',
      'Then I guess some wolves smelled all the blood and decided to come after us too!',
      'I had to hop in this well just to escape.',
      'Oh no!! Here they come again!',
      'Hurry, kill them!',
    ];

    const nameTextLines = Array(textLines.length).fill('Sophie');

    dialogueHelper.call(this, textLines, nameTextLines);
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
      "Don't make me hop in this well again!",
    ];

    const nameTextLines = Array(textLines.length).fill('Little Piggy');

    dialogueHelper.call(this, textLines, nameTextLines);
  }

  playQuestOver() {
    /*
      Function for after the quest has been handed in
    */
    const textLines = [
      'Oh thank God, I thought I was going to die for sure.',
      "I don't have much, but here's some iron and oil.",
      'You seem like you need it more than me.',
    ];

    const nameTextLines = Array(textLines.length).fill('Little Piggy');

    dialogueHelper.call(this, textLines, nameTextLines);
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
