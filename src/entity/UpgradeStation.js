import Phaser from 'phaser';

export default class UpgradeStation extends Phaser.Physics.Arcade.Sprite {
  constructor(scene, x, y, spriteKey, angle = 0) {
    super(scene, x, y, spriteKey);
    this.scene = scene;
    this.scene.physics.world.enable(this);
    this.scene.add.existing(this);
  }
}
