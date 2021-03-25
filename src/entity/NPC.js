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
    if (!this.inDialog) {
      this.inDialog = true;
      player.body.moves = false;
      player.play(player.facingRight ? 'idleRight' : 'idleLeft', true);
      this.textBox = this.scene.add.image(
        this.scene.camera.midPoint.x,
        this.scene.camera.midPoint.y + 50,
        'textBox'
      );
      this.textBox.setScale(0.1);
      // Lines to display in conversation.
      this.textLines = [
        'Whoa whoa, dont hurt me!',
        'Are you....',
        'Are you a robot...or human?',
        '...',
        'Well whatever you are just be careful...',
        'A robot just came through here and was wreaking all kinds of havoc',
        'I saw it take two people down the road to the South of here...',
        'You should stay away, something bad is going to happpen',
      ];

      this.nameTextLines = Array(this.textLines.length - 1).fill('Villager');

      // Initialize index.
      let i = 0;

      // Add text.
      this.dialogText = this.scene.add.text(
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
      this.dialogText.setResolution(10);
      this.dialogText.setScale(0.5).setOrigin(0.5);
      this.nameText = this.scene.add
        .text(this.textBox.x - 37, this.textBox.y - 9, 'Villager', {
          fontSize: '.4',
        })
        .setResolution(10)
        .setScale(0.4)
        .setOrigin(0.5);
      this.dialogText.setInteractive(
        new Phaser.Geom.Rectangle(
          0,
          0,
          this.dialogText.width + 15,
          this.dialogText.height + 30
        ),
        Phaser.Geom.Rectangle.Contains
      );

      this.dialogText.on('pointerdown', () => {
        if (i + 1 > this.textLines.length - 1) {
          this.dialogText.destroy();
          this.textBox.destroy();
          this.nameText.destroy();
          this.inDialog = false;
          player.body.moves = true;
          return;
        }
        this.dialogText.setText(this.textLines[i + 1]);
        i++;
      });
    }

    // advanceDialogue.call(
    //   this,
    //   0,
    //   this.textLines,
    //   this.textBox,
    //   this.nameText,
    //   this.nameTextLines,
    //   this.dialogText
    // );
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
