import Phaser from 'phaser';

export default class Player extends Phaser.Physics.Arcade.Sprite {
  constructor(scene, x, y, spriteKey) {
    super(scene, x, y, spriteKey);
    this.scene = scene;
    this.scene.physics.world.enable(this);
    this.scene.add.existing(this);
    this.body.setAllowGravity(false);
    this.speed = 300; // Moving at 800 pixels per ms
    this.hp = 100;
    this.facingRight = false;

    this.updateMovement = this.updateMovement.bind(this);
  }

  updateMovement(cursors) {
    // Running up + left
    if (cursors.left.isDown && cursors.up.isDown) {
      this.facingRight = false;
      this.setVelocityY(-this.speed);
      this.setVelocityX(-this.speed);
      this.play('runUp');
    }

    // Running up + right
    else if (cursors.right.isDown && cursors.up.isDown) {
      this.facingRight = true;
      this.setVelocityY(-this.speed);
      this.setVelocityX(this.speed);
      this.play('runUp');
    }

    // Running down + left
    else if (cursors.left.isDown && cursors.down.isDown) {
      this.facingRight = false;
      this.setVelocityY(this.speed);
      this.setVelocityX(-this.speed);
      this.play('runDown');
    }

    // Running down + right
    else if (cursors.right.isDown && cursors.down.isDown) {
      this.facingRight = true;
      this.setVelocityY(this.speed);
      this.setVelocityX(this.speed);
      this.play('runDown');
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
      this.play('runUp');

      // Running down
    } else if (cursors.down.isDown) {
      this.setVelocityY(this.speed);
      this.play('runDown');

      // No movement
    } else {
      this.setVelocityX(0);
      this.setVelocityY(0);
      if (this.facingRight) {
        this.play('idleRight');
      } else {
        this.play('idleLeft');
      }
    }
  }

  takeDamage(damage) {
    this.hp -= damage;
    if (this.hp <= 0) {
      console.log('LOL ded noob');
    }
  }

  update(cursors) {
    this.updateMovement(cursors);
  }
}
