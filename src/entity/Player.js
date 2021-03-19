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
    this.maxHealth = 100;
    this.hpBar = new HealthBar(
      scene,
      (scene.game.config.width - scene.game.config.width / 4.5) / 2 + 5,
      (scene.game.config.height - scene.game.config.height / 4.5) / 2 + 5,
      this.health,
      this.maxHealth
    );
    this.facingRight = false;
    this.lastHurt = 0;
    this.updateMovement = this.updateMovement.bind(this);
    this.damageModifier = 0;
    this.attackSpeedModifier = 0;
    this.hitCooldown = false;

    this.takeDamage = this.takeDamage.bind(this);
    this.knockback = this.knockback.bind(this);
    this.playDamageAnimation = this.playDamageAnimation.bind(this);
  }

  upgrade(type) {
    switch (type) {
      case 'hp':
        console.log(`Health increased`);
        this.maxHealth += 10;
        // Update the hp bar. It doesn't change any hp values,
        // just updates so the max health will be updated.
        this.hpBar.damage(this.health, this.maxHealth);
        break;
      case 'ms':
        console.log(`Speed increased`);
        this.speed += 10;
        break;
      case 'as':
        console.log(`Attack speed improved`);
        // This subtracts 100 ms from the cooldown, essentially
        this.attackSpeedModifier += 100;
        break;
      case 'damage':
        console.log(`Damage improved`);
        this.damageModifier += 10;
        break;
      default:
        console.log('Invalid upgrade type');
    }

    console.log(`Current health: `, this.health);
    console.log(`Max health: `, this.maxHealth);
    console.log(`Current move speed`, this.speed);

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

  playDamageAnimation() {
    return this.scene.tweens.add({
      targets: this,
      duration: 100,
      repeat: -1,
      tint: 0xffffff,
    });
  }

  knockback() {
    console.log(`Knocking back...`, this.body);
    this.body.touching.right ? this.setVelocityX(-500) : this.setVelocityX(500);
  }

  takeDamage(damage) {
    // If player gets hit in the cooldown period,
    // Do nothing
    if (this.hitCooldown) {
      console.log(`No damage taken`);
      return;
    }
    // On death logic
    if (this.health <= 0) {
      console.log('LOL ded noob');
      return;
    }

    console.log(`Ouch!`);
    // Otherwise, set hit cooldown
    this.hitCooldown = true;
    // Logic for slight knockback
    this.knockback();
    // Play damage
    const hitAnimation = this.playDamageAnimation();

    // Subtract damage from current health
    this.health -= damage;
    // Update the hp bar
    this.hpBar.damage(this.health);

    this.scene.time.delayedCall(1000, () => {
      this.hitCooldown = false;
      hitAnimation.stop();
      this.clearTint();
    });
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

    if (cursors.hp.isDown) {
      this.upgrade('hp');
    } else if (cursors.speed.isDown) {
      this.upgrade('ms');
    }
  }
}
