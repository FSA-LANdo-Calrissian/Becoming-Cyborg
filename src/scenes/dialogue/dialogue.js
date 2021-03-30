import Phaser from 'phaser';
import { advanceDialogue, generateDialogueUI } from '../cutscenes/cutscenes';

export default class Dialogue extends Phaser.Scene {
  constructor() {
    super('Dialogue');
  }

  playDialogue() {
    const textLines = [
      'Whoa whoa, dont hurt me!',
      'Are you....',
      'Are you a robot...or human?',
      '...',
      'Well whatever you are just be careful...',
      'A robot just came through here and was wreaking all kinds of havoc',
      'I saw it take two people down the road to the South of here...',
      'You should stay away, something bad is going to happpen',
    ];

    let nameTextLines = Array(textLines.length).fill('Villager');

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
    this.scene.get('FgScene').events.emit('tutorialEnd');
    this.scene.stop();
  }

  create({ player, npc }) {
    this.player = player;
    if (npc.texture.key === 'tutorialNPC') {
      npc.play('scaredTutorialNPC', true);
    }

    // const mainGame = this.scene.get('FgScene');

    this.cursors = this.input.keyboard.addKeys({
      cont: Phaser.Input.Keyboard.KeyCodes.SPACE,
    });
    this.playDialogue();
  }
}
