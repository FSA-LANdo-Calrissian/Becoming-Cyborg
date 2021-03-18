import Phaser from 'phaser';
import HealthBar from '../hud/HealthBar';
import Projectile from './Projectile';

export default class Player extends Phaser.Physics.Arcade.Sprite {
  constructor(scene, x, y, spriteKey) {
    super(scene, x, y, spriteKey);
    this.scene = scene;
    this.scene.physics.world.enable(this);
    this.scene.add.existing(this);
    this.body.setAllowGravity(false);
    this.speed = 100; // Moving at 800 pixels per ms
    this.health = 100;
    this.hpBar = new HealthBar(
      scene,
      (1028 - 1028 / 4.5) / 2 + 10,
      (768 - 768 / 4.5) / 2 + 10,
      this.health
    );
    this.facingRight = false;
    this.lastHurt = 0;
    this.updateMovement = this.updateMovement.bind(this);

    this.scene.input.on(
      'pointerdown',
      function (pointer) {
        let mouse = pointer;
        let angle = Phaser.Math.Angle.Between(
          this.x,
          this.y,
          mouse.x + this.scene.cameras.main.scrollX,
          mouse.y + this.scene.cameras.main.scrollY
        );
        const x = mouse.x + this.scene.cameras.main.scrollX;
        const y = mouse.y + this.scene.cameras.main.scrollY;
        this.fire(angle, x, y);
      },
      this
    );
  }

  fire(angle, x, y) {
    var blast = new Projectile(this.scene, this.x, this.y, 'bigBlast');
    blast.rotation = angle; // THE ANGLE!

    this.scene.playerProjectiles.add(blast); // group of bullets
    this.scene.physics.moveTo(blast, x, y, 200);
  }

  takeDamage(damage, time) {
    // If time > cooldown since last hit
    if (time > this.lastHurt) {
      // Subtract damage from current health
      this.health -= damage;
      // Update the hp bar
      this.hpBar.damage(this.health);
      // Update cooldown until you can be hit again - cd 1s
      this.lastHurt += 1000;
    }

    // On death logic
    if (this.health <= 0) {
      console.log('LOL ded noob');
    }
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
      this.setVelocityY(0);
      this.play('runLeft', true);

      // Running right
    } else if (cursors.right.isDown) {
      this.facingRight = true;
      this.setVelocityX(this.speed);
      this.setVelocityY(0);
      this.play('runRight', true);

      // Running up
    } else if (cursors.up.isDown) {
      this.setVelocityY(-this.speed);
      this.setVelocityX(0);
      this.play('runUp', true);

      // Running down
    } else if (cursors.down.isDown) {
      this.setVelocityY(this.speed);
      this.setVelocityX(0);
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
