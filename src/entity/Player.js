import Phaser from 'phaser';
import HealthBar from '../hud/HealthBar';

export default class Player extends Phaser.Physics.Arcade.Sprite {
  constructor(scene, x, y, spriteKey) {
    super(scene, x, y, spriteKey);
    this.scene = scene;
    this.scene.physics.world.enable(this);
    this.scene.add.existing(this);
    this.body.setAllowGravity(false);
    this.speed = 300; // Moving at 800 pixels per ms
    this.health = 100;
    this.hpBar = new HealthBar(scene, 0 + 10, 0 + 10, this.health);
    this.facingRight = false;

    this.updateMovement = this.updateMovement.bind(this);
  }

  updateMovement(cursors) {
    // Running up + left
    if (cursors.left.isDown && cursors.up.isDown) {
      this.facingRight = false;
      this.setVelocityY(-this.speed);
      this.setVelocityX(-this.speed);
      this.play('runUp', true);
    }

    // Running up + right
    else if (cursors.right.isDown && cursors.up.isDown) {
      this.facingRight = true;
      this.setVelocityY(-this.speed);
      this.setVelocityX(this.speed);
      this.play('runUp', true);
    }

    // Running down + left
    else if (cursors.left.isDown && cursors.down.isDown) {
      this.facingRight = false;
      this.setVelocityY(this.speed);
      this.setVelocityX(-this.speed);
      this.play('runDown', true);
    }

    // Running down + right
    else if (cursors.right.isDown && cursors.down.isDown) {
      this.facingRight = true;
      this.setVelocityY(this.speed);
      this.setVelocityX(this.speed);
      this.play('runDown', true);
    }

    // Running left
    else if (cursors.left.isDown) {
      this.facingRight = false;
      this.setVelocityX(-this.speed);
      this.play('runLeft', true);

      // Running right
    } else if (cursors.right.isDown) {
      this.facingRight = true;
      this.setVelocityX(this.speed);
      this.play('runRight', true);

      // Running up
    } else if (cursors.up.isDown) {
      this.setVelocityY(-this.speed);
      this.play('runUp', true);

      // Running down
    } else if (cursors.down.isDown) {
      this.setVelocityY(this.speed);
      this.play('runDown', true);

      // No movement
    } else {
      this.setVelocityX(0);
      this.setVelocityY(0);
      if (this.facingRight) {
        this.play('idleRight', true);
      } else {
        this.play('idleLeft', true);
      }
    }
  }

  update(cursors) {
    this.updateMovement(cursors);
  }
}
