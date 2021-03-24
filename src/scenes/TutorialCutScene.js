import Phaser from 'phaser';

export default class FgScene extends Phaser.Scene {
  constructor() {
    super('TutorialCutScene');
    this.oneSec = 0;
  }

  addText(i) {
    /*
      Function to advance the current dialogue. Destroys the dialogue box and allows player to move again on completion of dialogue.
      param i: int -> The current index of the dialogue.
      returns null
    */

    // If the dialogue is over (index higher than length)
    if (i > this.textLines.length - 1) {
      // Destroy box + allow movement.
      this.textBox.destroy();
      this.tutorialInProgress = false;
      this.finishedTutorial = true;
      this.nameText.setText('');
      this.endCutScene();
    }
    // Advance the dialogue (this will also allow
    // the text to be removed from screen)
    this.tutorialText.setText(this.textLines[i]);
  }

  playDialogue() {
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
      .text(this.textBox.x - 195, this.textBox.y - 45, 'Mr. Robot')
      .setResolution(10)
      .setScale(1)
      .setOrigin(0.5);

    // Add click area to advance text. Change the numbers after
    // the tutorialText width/height in order to increase click
    // area.
    this.tutorialText.setInteractive(
      new Phaser.Geom.Rectangle(
        0,
        0,
        this.tutorialText.width + 15,
        this.tutorialText.height + 30
      ),
      Phaser.Geom.Rectangle.Contains
    );

    // Emit this so that the text doesn't show up on minimap
    this.events.emit('dialogue');

    // Add the listener for mouse click.
    this.tutorialText.on('pointerdown', () => {
      this.addText(i);
      i++;
    });
  }

  endCutScene() {
    this.events.emit('tutorialEnd');
    this.scene.stop();
  }

  create({ player, enemy, camera }) {
    this.player = player;
    this.enemy = enemy;
    this.camera = camera;

    const mainGame = this.scene.get('FgScene');

    this.cursors = this.input.keyboard.addKeys({
      cont: Phaser.Input.Keyboard.KeyCodes.SPACE,
    });
    console.log(`Starting the camera panning`);
    this.playDialogue();
  }

  update(time, delta) {
    // if (time > this.oneSec) {
    //   console.log(`Current camera position? `, this.camera.panEffect.current);
    //   console.log(
    //     `Current X,Y position? `,
    //     this.camera.scrollX,
    //     this.camera.scrollY
    //   );
    //   this.oneSec += 1000;
    // }
    if (this.cursors.cont.isDown) {
      // this.endCutScene();
      console.log(`Current camera position: `, this.camera.x, this.camera.y);
    }
  }
}
