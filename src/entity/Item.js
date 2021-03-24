import Phaser from 'phaser';

export default class Item extends Phaser.Physics.Arcade.Sprite {
  constructor(scene, x, y, spriteKey) {
    super(scene, x, y, spriteKey);
    this.scene = scene;
    this.scene.physics.world.enable(this);
    this.scene.add.existing(this);
    this.body.setAllowGravity(false);
    this.upBob = 0;
    this.bobbingUp = true;
    this.lifespan = 30000;
    this.reset(x, y);
  }

  reset(x, y) {
    /*
      Function to reset lifespan and item when grabbed from the group
    */
    this.setVisible(true);
    this.setActive(true);
    this.setPosition(x, y);
    this.lifespan = 30000;
  }

  update(time, delta) {
    // Lets the items bob up and down in the scene.
    this.lifespan -= delta;
    if (this.bobbingUp) {
      this.setVelocityY(-3);
    } else {
      this.setVelocityY(3);
    }

    if (time > this.upBob) {
      this.bobbingUp = false;
      this.upBob += 2000;
      this.scene.time.delayedCall(1000, () => {
        this.bobbingUp = true;
      });
    }

    if (this.lifespan <= 0) {
      this.setVisible(false);
      this.setActive(false);
      this.setVelocityY(0);
      this.body.enable = false;
    }
  }
}
