import Phaser from 'phaser';
import { advanceDialogue, generateDialogueUI } from './cutscenes';

export default class Dialogue extends Phaser.Scene {
  constructor() {
    super('Dialogue');
  }
  addText(k, textLines, textBox, nameText, nameTextLines, dialogueText) {
    /*
      Function to advance the current dialogue. Destroys the dialogue box and allows player to move again on completion of dialogue.
      param i: int -> The current index of the dialogue.
      returns null
    */

    // If the dialogue is over (index higher than length)
    if (k > textLines.length - 1) {
      // Destroy bollow movement.
      textBox.destroy();
      this.dialogueInProgress = false;
      this.finishedTutorial = true;

      this.input.keyboard.removeListener('keydown-SPACE');
      dialogueText.removeListener('pointerdown');

      this.endScene();
    }
    // Advance the dialogue (this will also allow
    // the text to be removed from screen)
    dialogueText.setText(textLines[k]);
    nameText.setText(nameTextLines[k]);
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

    generateDialogueUI.call(this, textLines, nameTextLines, 300, 165);

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
