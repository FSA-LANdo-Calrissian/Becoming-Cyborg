import Phaser from 'phaser';

export default class Collision extends Phaser.Physics.Arcade.Image {
  constructor(scene, x, y, texture, frame) {
    super(scene, x, y, texture, frame);
    this.scene = scene;
    this.scene.physics.world.enable(this);
    this.scene.add.existing(this);
  }
}
