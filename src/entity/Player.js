import Phaser from 'phaser';
import Projectile from './Projectile';

export default class Player extends Phaser.Physics.Arcade.Sprite {
  constructor(scene, x, y, spriteKey) {
    super(scene, x, y, spriteKey);
    this.scene = scene;
    this.scene.physics.world.enable(this);
    this.scene.add.existing(this);
    this.body.setAllowGravity(false);
    this.upgrade = {
      maxHealth: 0,
      damage: 0,
      attackSpeed: 0,
      moveSpeed: 0,
      regen: 0,
    };
    this.speed = 100 + this.upgrade.moveSpeed;
    this.health = 100;
    this.maxHealth = 100 + this.upgrade.maxHealth;
    this.stats = {
      kills: 0,
    };
    // this.hpBar = new HealthBar(
    //   scene,
    //   (scene.game.config.width - scene.game.config.width / 4.5) / 2 + 5,
    //   (scene.game.config.height - scene.game.config.height / 4.5) / 2 + 5,
    //   this.health,
    //   this.maxHealth
    // );
    this.facingRight = false;
    this.lastHurt = 0;
    this.updateMovement = this.updateMovement.bind(this);
    this.damage = 10 + this.upgrade.damage;
    this.attackSpeed = 0 + this.upgrade.attackSpeed; // This is the cooldown between hits
    this.melee = false;
    this.shooting = false;
    // this.scene.input.on(
    //   'pointerdown',
    //   function (pointer) {
    //     let mouse = pointer;
    //     let angle = Phaser.Math.Angle.Between(
    //       this.x,
    //       this.y,
    //       mouse.x + this.scene.cameras.main.scrollX,
    //       mouse.y + this.scene.cameras.main.scrollY
    //     );
    //     const x = mouse.x + this.scene.cameras.main.scrollX;
    //     const y = mouse.y + this.scene.cameras.main.scrollY;
    //     this.fire(angle, x, y);
    //   },
    //   this
    // );
    this.hitCooldown = false;

    this.takeDamage = this.takeDamage.bind(this);
    this.knockback = this.knockback.bind(this);
    this.playDamageAnimation = this.playDamageAnimation.bind(this);
  }

  upgradeStats(type) {
    switch (type) {
      case 'hp':
        console.log(`Health increased`);
        this.health += 10;
        this.maxHealth += 10;
        // Update the hp bar. It doesn't change any hp values,
        // just updates so the max health will be updated.
        this.scene.events.emit('takeDamage', this.health, this.maxHealth);
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
        return;
    }

    console.log(`Current health: `, this.health);
    console.log(`Max health: `, this.maxHealth);
    console.log(`Current move speed`, this.speed);
  }

  //shooting projectiles
  fire(angle, x, y) {
    if (!this.shooting) {
      this.shooting = true;
      this.scene.time.delayedCall(
        2000,
        () => {
          this.shooting = false;
        },
        null,
        this
      );
      var blast = new Projectile(this.scene, this.x, this.y, 'bigBlast');
      blast.rotation = angle; // THE ANGLE!

      this.scene.playerProjectiles.add(blast); // group of bullets
      this.scene.physics.moveTo(blast, x, y, 200);
    } else {
      //maybe add cooldown sound or something
    }
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
    this.body.touching.right ? this.setVelocityX(-500) : this.setVelocityX(500);
  }

  takeDamage(damage, gg) {
    // If player gets hit in the cooldown period,
    // Do nothing
    if (this.hitCooldown) {
      return;
    }

    // Otherwise, set hit cooldown
    this.hitCooldown = true;
    // Logic for slight knockback
    this.knockback();
    // Play damage
    const hitAnimation = this.playDamageAnimation();

    // Subtract damage from current health
    this.health -= damage;
    // Update the hp bar
    this.scene.events.emit('takeDamage', this.health, this.maxHealth);

    // On death logic
    if (this.health <= 0) {
      gg.play();
      const stats = this.stats;
      console.log(this.stats);
      this.scene.scene.stop('HUDScene');
      this.scene.scene.start('GameOver', { stats });

      return;
    }

    // After hit cooldown time, set to false, stop animation, and remove tint.
    this.scene.time.delayedCall(1000, () => {
      this.hitCooldown = false;
      hitAnimation.stop();
      this.clearTint();
    });
  }

  updateMovement(cursors) {
    if (!this.body) return;
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
      // this.upgrade('hp');
      console.log(this.x, this.y);
    } else if (cursors.speed.isDown) {
      this.upgradeStats('ms');
    }
  }
}
