import Phaser from 'phaser';

export default class Projectile extends Phaser.Physics.Arcade.Sprite {
  constructor(scene, x, y, spriteKey) {
    super(scene, x, y, spriteKey);
    this.scene = scene;
    this.scene.physics.world.enable(this);
    this.scene.add.existing(this);
    this.lifespan = 1200;

    this.speed = Phaser.Math.GetSpeed(200, 1); // (distance in pixels, time (ms))
    this.damage = 25;
    this.dy = 0;
    this.dx = 0;
  }

  shoot(x, y, angle) {
    /*
      Function to shoot projectile.
      param x: int -> the x coordinate of where the projectile STARTS.
      param y: int -> the y coordinate of where the projectile STARTS.
      param angle: int -> The angle at which the projectile travels and faces.
      returns null.
    */
    // When we grab a dead bullet, we need to reset it before we can shoot it.
    this.reset();
    this.rotation = angle;
    this.setPosition(x, y);
    // SOH CAH TOA -> y is sin/x is cos
    this.dx = Math.cos(angle);
    this.dy = Math.sin(angle);
  }

  reset() {
    /*
      Function to reset the projectile back to base stats. This will essentially "revive" a dead projectile that is grabbed from the projectiles group via the get method.

    */
    this.setActive(true);
    this.body.enable = true;
    this.lifespan = 1200;
    this.setVisible(true);
  }

  // Check which direction the player is facing and move the laserbolt in that direction as long as it lives
  update(time, delta) {
    // Lifespan logic for projectile
    this.lifespan -= delta;

    // Calculation for the travel path of the projectile.
    const moveDistance = this.speed * delta;
    this.x += this.dx * moveDistance;
    this.y += this.dy * moveDistance;

    // If projectile is out of life, remove it.
    if (this.lifespan <= 0) {
      console.log(`Projectile life expired`);
      this.setVisible(false);
      this.setActive(false);
      this.body.enable = false;
    }
  }
}
