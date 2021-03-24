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
  }

  update(time, delta) {
    // Lets the items bob up and down in the scene.
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
  }
}
