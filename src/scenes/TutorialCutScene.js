import Phaser from 'phaser';
import { advanceDialogue } from './cutscenes';

export default class TutorialCutScene extends Phaser.Scene {
  constructor() {
    super('TutorialCutScene');
    this.sceneOne = false;
    this.sceneTwo = false;
    this.sceneThree = false;
  }

  addText(k, textLines, textBox, nameText, nameTextLines, tutorialText) {
    /*
      Function to advance the current dialogue. Destroys the dialogue box and allows player to move again on completion of dialogue.
      param i: int -> The current index of the dialogue.
      returns null
    */

    // If the dialogue is over (index higher than length)
    if (k > textLines.length - 1) {
      // Destroy bollow movement.
      textBox.destroy();
      this.tutorialInProgress = false;
      this.finishedTutorial = true;

      this.input.keyboard.removeListener('keydown-SPACE');
      tutorialText.removeListener('pointerdown');

      this.endScene();
    }
    // Advance the dialogue (this will also allow
    // the text to be removed from screen)
    tutorialText.setText(textLines[k]);
    nameText.setText(nameTextLines[k]);
  }

  endScene() {
    /*
      Helper function to determine what to do next in cutscene
    */

    if (this.sceneOne && !this.sceneTwo) {
      this.enemy.play('tutorial1', true);
      this.playSceneTwo();
      this.time.delayedCall(1000, () => {
        this.deadNPC.flipX = !this.deadNPC.flipX;
        this.deadNPC.play('MacRIP');
      });
      this.time.delayedCall(2000, () => {
        this.enemy.play('tutorial2', false);
      });
    } else if (this.sceneTwo && !this.sceneThree) {
      this.enemy.play(
        this.enemy.x - this.player.x > 0
          ? 'meleeRobotIdleLeft'
          : 'meleeRobotIdleRight'
      );
      this.events.emit('tutorialPause');
      this.playSceneThree();
    } else if (this.sceneThree) {
      this.endCutScene();
    }
  }

  playSceneOne() {
    /*
      Scene before the killing
    */
    this.textBox = this.add
      .image(this.player.x - 10, this.player.y + 350, 'textBox')
      .setScale(0.5);

    this.textLines = [
      "Human, you've been found guilty of scratching my metallic hull",
      'I will now sentence you to death',
      'Any last words?',
      "It was an accident, please! I'll be careful next time!",
      'Weird choice of final words. Die, human',
    ];

    this.nameTextLines = [
      'Mr. Robot',
      'Mr. Robot',
      'Mr. Robot',
      'Mac',
      'Mr. Robot',
    ];

    let j = 0;

    this.tutorialText = this.add.text(
      this.textBox.x + 5,
      this.textBox.y + 15,
      this.textLines[j],
      {
        fontSize: '.4',
        // fontFamily: 'Arial',
        align: 'left',
        wordWrap: { width: 199, useAdvancedWrap: true },
      }
    );

    this.tutorialText.setResolution(10);
    this.tutorialText.setScale(2.5).setOrigin(0.5);
    this.nameText = this.add
      .text(this.textBox.x - 185, this.textBox.y - 45, this.nameTextLines[j], {
        fontSize: '.4',
      })
      .setResolution(10)
      .setScale(2.5)
      .setOrigin(0.5);

    advanceDialogue.call(
      this,
      j,
      this.textLines,
      this.textBox,
      this.nameText,
      this.nameTextLines,
      this.tutorialText
    );

    this.sceneOne = true;
  }

  playSceneTwo() {
    /*
      Post killing scene
    */
    this.textBox = this.add
      .image(this.player.x - 10, this.player.y + 350, 'textBox')
      .setScale(0.5);

    this.textLines = [
      'AaaAaArRRggGGggGhHhHHh',
      '...',
      "You, human. You're guilty of not stopping him from scratching my beautiful metal. ",
      'You will also perish once my laser cools down',
      'Any last words?',
      '...',
    ];

    this.nameTextLines = [
      'Mac',
      'Mr. Robot',
      'Mr. Robot',
      'Mr. Robot',
      'Mr. Robot',
      'Dr. Dang',
    ];

    let j = 0;

    this.tutorialText = this.add.text(
      this.textBox.x + 5,
      this.textBox.y + 15,
      this.textLines[j],
      {
        fontSize: '.4',
        // fontFamily: 'Arial',
        align: 'left',
        wordWrap: { width: 199, useAdvancedWrap: true },
      }
    );

    this.tutorialText.setResolution(10);
    this.tutorialText.setScale(2.5).setOrigin(0.5);
    this.nameText = this.add
      .text(this.textBox.x - 185, this.textBox.y - 45, this.nameTextLines[j], {
        fontSize: '.4',
      })
      .setResolution(10)
      .setScale(2.5)
      .setOrigin(0.5);

    advanceDialogue.call(
      this,
      j,
      this.textLines,
      this.textBox,
      this.nameText,
      this.nameTextLines,
      this.tutorialText
    );

    this.sceneTwo = true;
  }

  playSceneThree() {
    /*
      Tutorial dialogue. Contains the logic to advance through the dialogue on player clicking on the text.
      Can increase the click area by changing the setInteractive rectangle width/height.
      No params.
      Returns null.
    */

    // Make the text box
    this.textBox = this.add.image(
      this.player.x - 10,
      this.player.y + 350,
      'textBox'
    );
    this.textBox.setScale(0.5);
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

    this.nameTextLines = Array(20).fill('Mr. Robot');

    // Initialize index.
    let i = 0;

    // Add text.
    this.tutorialText = this.add.text(
      this.textBox.x + 5,
      this.textBox.y + 15,
      this.textLines[i],
      {
        fontSize: '.4',
        // fontFamily: 'Arial',
        align: 'left',
        wordWrap: { width: 199, useAdvancedWrap: true },
      }
    );
    this.tutorialText.setResolution(10);
    this.tutorialText.setScale(2.5).setOrigin(0.5);
    this.nameText = this.add
      .text(this.textBox.x - 185, this.textBox.y - 45, 'Mr. Robot', {
        fontSize: '.4',
      })
      .setResolution(10)
      .setScale(2.5)
      .setOrigin(0.5);

    // Add click area to advance text. Change the numbers after
    // the tutorialText width/height in order to increase click
    // area.
    advanceDialogue.call(
      this,
      i,
      this.textLines,
      this.textBox,
      this.nameText,
      this.nameTextLines,
      this.tutorialText
    );

    this.sceneThree = true;
  }

  endCutScene() {
    this.events.emit('tutorialEnd');
    this.scene.stop();
  }

  create({ player, enemy, camera, deadNPC }) {
    this.player = player;
    this.enemy = enemy;
    this.deadNPC = deadNPC;
    this.camera = camera;

    // const mainGame = this.scene.get('FgScene');

    this.cursors = this.input.keyboard.addKeys({
      cont: Phaser.Input.Keyboard.KeyCodes.SPACE,
    });

    this.playSceneOne();
  }
}
