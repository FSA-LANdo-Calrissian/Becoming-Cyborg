import Phaser from 'phaser';
import { dialogueHelper } from '../cutscenes/cutscenes';
import quests from '../../quests/quests';

export default class Dialogue extends Phaser.Scene {
  constructor() {
    super('gunQuest');
  }

  playDialogue() {
    const textLines = [
      'Hey you!',
      'Whoaaaaa, you look really cool!!!!',
      'Are you into disguising yourself as a robot as well?',
      'Last time I did  I was able to snag something off of them',
      'But.....of course they caught up to me and I had to toss the part',
      'Hmmm, you know what?',
      "You look like you've snagged a few parts in your day.",
      'How about we make a trade?',
      "You find me that part I lost and I'll give you one of my older parts.",
      'I dropped it in Robot City, in the cemetery',
      'Be careful though, there are some Bots that patrol the area.',
      'I would stay on the the outskirts of the city and avoid all of the Bots if possible.',
      "I don't care what you have to do to get it",
      'Just make sure you dont get caught, OK?',
    ];

    const nameTextLines = Array(textLines.length).fill('Tech Geek');

    dialogueHelper.call(this, textLines, nameTextLines);
  }

  playIncomplete() {
    const textLines = [
      'Hey, let me know if you find that part I was looking for.',
      'The cemetery is located on the West side of Robot City',
    ];

    const nameTextLines = Array(textLines.length).fill('Tech Geek');

    dialogueHelper.call(this, textLines, nameTextLines);
  }

  playQuestOver() {
    const textLines = [
      'Whoaaaaa, you actually found it!',
      "I don't want to know what you had to do to get this....",
      'In fact....',
      'I dont know you, and this conversation never happened...',
      'But first, here, take this off my hands for me',
      'Need to make space for this new beauty you brought me.',
    ];

    const nameTextLines = Array(textLines.length).fill('Tech Geek');

    dialogueHelper.call(this, textLines, nameTextLines);
    quests.fireballQuest.requirements = true;
  }

  endScene() {
    if (!quests[this.npc.name].isStarted) {
      const mainGame = this.scene.get('RobotCityScene');
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
    this.scene.get('RobotCityScene').events.emit('cutSceneEnd');
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
