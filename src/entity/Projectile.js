import Phaser from 'phaser';

export default class Projectile extends Phaser.Physics.Arcade.Sprite {
  constructor(scene, x, y, spriteKey, angle = 0) {
    super(scene, x, y, spriteKey);
    this.scene = scene;
    this.scene.physics.world.enable(this);
    this.scene.add.existing(this);
    this.lifespan = 2000;

    this.speed = Phaser.Math.GetSpeed(80, 1); // (distance in pixels, time (ms))
    this.damage = 25;
    this.dy = 0;
    this.dx = 0;
    this.reset(x, y, angle);
  }

  shoot(x, y, angle) {
    this.setActive(true);
    this.lifespan = 2000;
    this.setVisible(true);
    this.rotation = angle;
    this.setPosition(x, y);
    // SOH CAH TOA -> y is sin/x is cos
    this.dx = Math.cos(angle);
    this.dy = Math.sin(angle);
  }

  reset(x, y, angle) {
    // console.log(`Projectile spritekey...`, spriteKey);
    this.setActive(true);
    this.lifespan = 2000;
    this.setVisible(true);
    this.rotation = angle;
    this.setPosition(x, y);
    // SOH CAH TOA -> y is sin/x is cos
    this.dx = Math.cos(angle);
    this.dy = Math.sin(angle);
  }

  // Check which direction the player is facing and move the laserbolt in that direction as long as it lives
  update(time, delta) {
    this.lifespan -= delta;
    const moveDistance = this.speed * delta;
    this.x += this.dx * moveDistance;
    this.y += this.dy * moveDistance;

    if (this.lifespan <= 0) {
      this.setVisible(false);
      this.setActive(false);
    }
  }
}
