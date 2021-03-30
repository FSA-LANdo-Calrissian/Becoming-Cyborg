import Phaser from 'phaser';
import { advanceDialogue, generateDialogueUI } from '../cutscenes/cutscenes';

export default class Dialogue extends Phaser.Scene {
  constructor() {
    super('testQuest');
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

  endScene() {
    this.scene.get('FgScene').events.emit('tutorialEnd');
    this.scene.stop();
  }

  create({ player, npc }) {
    this.player = player;

    this.cursors = this.input.keyboard.addKeys({
      cont: Phaser.Input.Keyboard.KeyCodes.SPACE,
    });
    this.playDialogue();
  }
}
