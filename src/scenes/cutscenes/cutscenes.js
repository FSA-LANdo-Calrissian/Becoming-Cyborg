import Phaser from 'phaser';

/*
================================
~~~~~~~Helper functions~~~~~~~~~
================================
*/

export function freeze(player, scene) {
  /*
    Helper function to stop all player movements
  */

  scene.dialogueInProgress = true;
  scene.enemiesGroup.getChildren().forEach((enemy) => {
    if (enemy.active) {
      enemy.setVelocityX(0);
      enemy.setVelocityY(0);
    }
  });
  player.setVelocityX(0);
  player.setVelocityY(0);
  player.canMelee = false;
  player.shooting = true;
}

export function addText(
  k,
  textLines,
  textBox,
  nameText,
  nameTextLines,
  dialogueText
) {
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

export function generateDialogueUI(
  textLines,
  nameTextLines,
  Xoffset = 0,
  Yoffset = 0
) {
  /*
    Helper function to make the text box and place the text on screen.
    param textLines: array of strings -> The dialogue text in an array of strings.
    param nameTextLines: array of strings -> Name that belongs to each line of dialogue text. This is to put the name into the little name box. Should have the same length as textLines.
    param Xoffset: int -> offset the camera in the x direction by Xoffset amount
    param Yoffset
  */

  // Make the text box

  this.textBox = this.add.image(
    // this.player.x - 10 + Xoffset,
    // this.player.y + 330 + Yoffset,
    this.cameras.main.midPoint.x + Xoffset,
    this.cameras.main.midPoint.y + 220 + Yoffset,
    'textBox'
  );
  this.textBox.setScale(0.5);

  // Lines to display in conversation.
  this.textLines = textLines;

  this.nameTextLines = nameTextLines;

  // Add text.
  this.dialogueText = this.add.text(
    this.textBox.x + 5,
    this.textBox.y + 15,
    this.textLines[0],
    {
      fontSize: '.4',
      // fontFamily: 'Arial',
      align: 'left',
      wordWrap: { width: 199, useAdvancedWrap: true },
    }
  );
  this.dialogueText.setResolution(10);
  this.dialogueText.setScale(2.5).setOrigin(0.5);
  this.nameText = this.add
    .text(this.textBox.x - 185, this.textBox.y - 45, this.nameTextLines[0], {
      fontSize: '.4',
    })
    .setResolution(10)
    .setScale(2.5)
    .setOrigin(0.5);
}

export function advanceDialogue(
  i,
  textLines,
  textBox,
  nameText,
  nameTextLines,
  dialogueText
) {
  /*
    Helper function - makes it so clicking on the dialogue or hitting space bar advances the dialogue
    To use this, import it (remember to destructure). Then use advanceDialogue.call() because we have to bind the this context. Then pass in the rest of the arguments after "this".
    param i: int -> Index for the textLines
    param dialogueText: object created from this.add.text. This is where we will render our text
    param textLines: Array of strings corresponding to the order of the conversation
    param textBox: object created from this.add.image. This is the dialogue box from where the text will be rendered.
    param nameText: The name of the person speaking.
    returns null

    **NOTE** You will need to have an addText function in your cutscene, as well. This function is the helper function to swap the dialogue and contains the logic for after the dialogue is over. It needs to take the arguments listed below in the order listed (same order as this one, essentially.)
  */

  dialogueText.setInteractive(
    new Phaser.Geom.Rectangle(
      0,
      0,
      dialogueText.width + 15,
      dialogueText.height + 30
    ),
    Phaser.Geom.Rectangle.Contains
  );

  this.input.keyboard.on('keydown-SPACE', () => {
    addText.call(
      this,
      i + 1,
      textLines,
      textBox,
      nameText,
      nameTextLines,
      dialogueText
    );
    i++;
  });

  // Emit this so that the text doesn't show up on minimap
  this.events.emit('dialogue');

  // Add the listener for mouse click.
  this.dialogueText.on('pointerdown', () => {
    addText.call(
      this,
      i + 1,
      textLines,
      textBox,
      nameText,
      nameTextLines,
      dialogueText
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
  freeze(this.player, this);
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
    this.dialogueInProgress = false;
    this.camera.startFollow(this.player);
    this.dialogueInProgress = false;
  });
}

export function playCutScene() {
  /*
      Runs the tutorial cutscene. Contains the logic to advance through the dialogue on player clicking on the text.
      Can increase the click area by changing the setInteractive rectangle width/height.
      No params.
      Returns null.
    */

  // Stop player movements
  freeze(this.player, this);

  this.scene.launch('TutorialCutScene', {
    player: this.player,
    enemy: this.enemy,
    camera: this.cameras.main,
    deadNPC: this.deadNPC,
  });
}

export function robotKilled() {
  /*
    Runs the cutscene for after the robot is killed.
  */

  // Stop player movements
  freeze(this.player, this);
  this.allowUpgrade = true;

  this.scene.launch('TutorialCutScene', {
    player: this.player,
    enemy: this.enemy,
    camera: this.cameras.main,
    finalScene: true,
    doctor: this.doctor,
  });
}

/*
================================
~~~~Non-tutorial cutscenes~~~~~~
================================
*/

export function playDialogue(npc, dialogueKey, data = {}) {
  /*
    This function is a helper function to launch a certain dialogue scene when talking to an NPC.
    param npc: object -> The npc you are interacting with
    param dialogueKey: string -> The key for the dialogue you want to start
    param data: object -> Optional parameter for any other things you want to  pass into the dialogue.
  */
  freeze(this.player, this);

  this.scene.launch(dialogueKey, {
    player: this.player,
    npc,
    data,
  });
}
