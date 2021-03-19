import 'phaser';

export default class Projectile extends Phaser.Physics.Arcade.Sprite {
  constructor(scene, x, y, spriteKey) {
    super(scene, x, y, spriteKey);
    this.scene = scene;
    this.scene.physics.world.enable(this);
    this.scene.add.existing(this);
    this.lifespan = 2000;

    this.speed = Phaser.Math.GetSpeed(800, 1); // (distance in pixels, time (ms))
    this.damage = 25;
  }

  // Check which direction the player is facing and move the laserbolt in that direction as long as it lives
  update(time, delta) {
    this.lifespan -= delta;

    if (this.lifespan <= 0) {
      this.destroy();
    }
  }
}
