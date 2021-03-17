import Phaser from 'phaser';

export default class Player extends Phaser.Physics.Arcade.Sprite {
  constructor(scene, x, y, spriteKey) {
    super(scene, x, y, spriteKey);
    this.scene = scene;
    this.scene.physics.world.enable(this);
    this.scene.add.existing(this);
    // this.body.setAllowGravity(false);
    // this.speed = Phaser.Math.GetSpeed(800, 1); // Moving at 800 pixels per ms
    // this.health = 100;

    // this.updateMovement = this.updateMovement.bind(this);
  }

  // updateMovement(cursors) {
  //   if (cursors.left.isDown) {
  //     this.setVelocityX(-this.speed);
  //   } else if (cursors.right.isDown) {
  //     this.setVelocityX(this.speed);
  //   } else if (cursors.up.isDown) {
  //     this.setVelocityY(-this.speed);
  //   } else if (cursors.down.isDown) {
  //     this.setVelocityY(this.speed);
  //   }
  // }

  update(cursors) {
    // this.updateMovement(cursors);
  }
}
