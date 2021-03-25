import Phaser from 'phaser';
import { advanceDialogue } from '../scenes/cutscenes';

export default class NPC extends Phaser.Physics.Arcade.Sprite {
  constructor(scene, x, y, spriteKey) {
    super(scene, x, y, spriteKey);
    this.scene = scene;
    this.scene.physics.world.enable(this);
    this.scene.add.existing(this);
    this.body.setAllowGravity(false);
    this.messageDisplayed = false;
    this.touching = false;
    this.inDialog = false;
  }

  displayDialog(player) {
    this.inDialog = true;
    player.body.moves = false;

    this.textBox = this.scene.add.image(
      this.scene.camera.midPoint.x,
      this.scene.camera.midPoint.y + 50,
      'textBox'
    );
    this.textBox.setScale(0.1);
    // Lines to display in conversation.
    this.textLines = [
      'Halt human, stop right there!',
      'Name...?',
      'ID..?',
      '...',
      '"Just looking for directions" is not a valid response....',
      'What is that you are wearing human....?',
      'Please stand still as you are being scanned.....',
      'Scan Complete....',
      'Illegal Activity Detected...',
      'Where did you get these parts, human...?',
      'Come with me human you are being detained for questioning.....',
      'Please do not resist....',
    ];

    this.nameTextLines = Array(this.textLines.length - 1).fill('Villager');

    // Initialize index.
    let i = 0;

    // Add text.
    this.tutorialText = this.scene.add.text(
      this.textBox.x,
      this.textBox.y + 4,
      this.textLines[i],
      {
        fontSize: '.4',
        // fontFamily: 'Arial',
        align: 'left',
        wordWrap: { width: 199, useAdvancedWrap: true },
      }
    );
    this.tutorialText.setResolution(10);
    this.tutorialText.setScale(0.5).setOrigin(0.5);
    this.nameText = this.scene.add
      .text(this.textBox.x - 37, this.textBox.y - 9, 'Villager', {
        fontSize: '.4',
      })
      .setResolution(10)
      .setScale(0.4)
      .setOrigin(0.5);

    advanceDialogue.call(
      this,
      i,
      this.textLines,
      this.textBox,
      this.nameText,
      this.nameTextLines,
      this.tutorialText
    );
  }

  displayTooltip() {
    /*
      Method to display the message "Press space bar to interact". For some reason, the add.text is blurry, so an image is used instead. If we can fix the text, that would be preferred.
    */
    if (!this.messageDisplayed) {
      this.messageDisplayed = true;
      this.scene.tutorialText = this.scene.add
        .text(this.x - 10, this.y - 20, 'Hit spacebar to interact', {
          fontSize: 8,
          strokeThickness: 0.5,
          wordWrap: { width: 60 },
        })
        .setResolution(10)
        .setScale(0.5);

      // this.scene.tutorialText = this.scene.add
      //   .image(this.x - 10, this.y - 10, 'interact')
      //   .setScale(0.3);
      this.scene.events.emit('dialogue');
    }
  }

  update() {
    let touching = !this.body.touching.none;
    let wasTouching = !this.body.wasTouching.none;

    if (!touching && wasTouching && this.messageDisplayed) {
      // Destroys tooltip when no more overlap
      this.scene.tutorialText.destroy();
      this.messageDisplayed = false;
    }
  }
}
