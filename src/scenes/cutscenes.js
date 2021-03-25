import Phaser from 'phaser';

/*
================================
~~~~~~~To advance dialogue~~~~~~
================================
*/

export function advanceDialogue(
  i,
  textLines,
  textBox,
  nameText,
  nameTextLines,
  tutorialText
) {
  /*
    Helper function - makes it so clicking on the dialogue or hitting space bar advances the dialogue
    To use this, import it (remember to destructure). Then use advanceDialogue.call() because we have to bind the this context. Then pass in the rest of the arguments after "this".
    param i: int -> Index for the textLines
    param tutorialText: object created from this.add.text. This is where we will render our text
    param textLines: Array of strings corresponding to the order of the conversation
    param textBox: object created from this.add.image. This is the dialogue box from where the text will be rendered.
    param nameText: The name of the person speaking.
    returns null

    **NOTE** You will need to have an addText function in your cutscene, as well. This function is the helper function to swap the dialogue and contains the logic for after the dialogue is over. It needs to take the arguments listed below in the order listed (same order as this one, essentially.)
  */

  tutorialText.setInteractive(
    new Phaser.Geom.Rectangle(
      0,
      0,
      tutorialText.width + 15,
      tutorialText.height + 30
    ),
    Phaser.Geom.Rectangle.Contains
  );

  this.input.keyboard.on('keydown-SPACE', () => {
    this.addText(
      i + 1,
      textLines,
      textBox,
      nameText,
      nameTextLines,
      tutorialText
    );
    i++;
  });

  // Emit this so that the text doesn't show up on minimap
  this.events.emit('dialogue');

  // Add the listener for mouse click.
  this.tutorialText.on('pointerdown', () => {
    this.addText(
      i + 1,
      textLines,
      textBox,
      nameText,
      nameTextLines,
      tutorialText
    );
    i++;
  });
}
/*
================================
~~~~~~~Tutorial cutscenes~~~~~~~
================================
*/

export function initCutScene() {
  /*
      Plays the initial cutscene
  */

  // Stop all movement
  this.player.setVelocityX(0);
  this.player.setVelocityY(0);
  this.player.canMelee = false;
  this.player.shooting = true;
  this.enemy.body.moves = false;
  this.initTutorial = true;

  // Stop camera so we can pan
  this.camera.stopFollow();

  // Save original position to revert cam back after panning
  const currX = this.camera.scrollX;
  const currY = this.camera.scrollY;

  // Pan the cam over 3 seconds
  this.camera.pan(473, 176, 3000);
  this.time.delayedCall(2000, () => {
    const help = this.add
      .sprite(this.doctor.x + 15, this.doctor.y - 10, 'bubble')
      .setScale(0.045)
      .setAlpha(1, 1, 1, 1);
    const helpText = this.add
      .text(help.x - 5, help.y - 4, 'Help us!', {
        fontSize: 20,
        wordWrap: { width: 30 },
      })
      .setScale(0.25);
    const nopls = this.add
      .sprite(this.deadNPC.x + 10, this.deadNPC.y - 15, 'bubble')
      .setScale(0.045)
      .setAlpha(1, 1, 1, 1);
    const noPlsText = this.add
      .text(nopls.x - 10, nopls.y - 5, 'Noooo, pleaseeeee', {
        fontSize: 20,
        wordWrap: { width: 30 },
      })
      .setScale(0.25);

    this.time.delayedCall(3500, () => {
      help.destroy();
      nopls.destroy();
      helpText.setText('');
      noPlsText.setText('');
    });
  });
  this.time.delayedCall(5000, () => {
    this.camera.pan(400 + currX, 300 + currY, 3000);
  });
  this.time.delayedCall(8000, () => {
    this.tutorialInProgress = false;
    this.camera.startFollow(this.player);
  });
}

export function playCutScene() {
  /*
      Runs the tutorial cutscene. Contains the logic to advance through the dialogue on player clicking on the text.
      Can increase the click area by changing the setInteractive rectangle width/height.
      No params.
      Returns null.
    */
  this.player.setVelocityX(0);
  this.player.setVelocityY(0);
  this.player.canMelee = false;
  this.player.shooting = true;
  this.enemy.body.moves = false;

  this.scene.launch('TutorialCutScene', {
    player: this.player,
    enemy: this.enemy,
    camera: this.cameras.main,
    deadNPC: this.deadNPC,
  });
}

/*
================================
~~~~Non-tutorial cutscenes~~~~~~
================================
*/
