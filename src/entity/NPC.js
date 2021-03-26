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
      console.log(touching, wasTouching);
      // Destroys tooltip when no more overlap
      this.scene.tutorialText.destroy();
      this.messageDisplayed = false;
    }
  }
}
