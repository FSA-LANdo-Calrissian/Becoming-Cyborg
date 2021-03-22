import Phaser from 'phaser';

export default class Player extends Phaser.Physics.Arcade.Sprite {
  constructor(scene, x, y, spriteKey, fireWeapon) {
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
      kills: 50,
    };
    this.facingRight = false;
    this.lastHurt = 0;
    this.damage = 10 + this.upgrade.damage;
    this.attackSpeed = 2000 - this.upgrade.attackSpeed; // This is the cooldown between hits
    this.nextAttack = 0;
    this.isMelee = false;
    this.canMelee = true;
    this.shooting = false;
    // Helper function to fire weapon.
    this.fireWeapon = (x, y, sprite, angle) => {
      fireWeapon(x, y, sprite, angle);
    };

    this.hitCooldown = false;

    // Bindings
    this.updateMovement = this.updateMovement.bind(this);
    this.takeDamage = this.takeDamage.bind(this);
    this.knockback = this.knockback.bind(this);
    this.playDamageAnimation = this.playDamageAnimation.bind(this);
    this.shoot = this.shoot.bind(this);
  }

  shoot(time) {
    /*
      Function for player to fire weapon on left click if not on cooldown.
      Only argument needed is time, passed in through the FgScene's update function -> player update -> here.
      param time: int -> Current game time.
      returns null
    */
    this.scene.input.on(
      'pointerdown',
      // function (pointer) {
      //   let mouse = pointer;
      //   let angle = Phaser.Math.Angle.Between(
      //     this.x,
      //     this.y,
      //     mouse.x + this.scene.cameras.main.scrollX,
      //     mouse.y + this.scene.cameras.main.scrollY
      //   );
      //   const x = mouse.x + this.scene.cameras.main.scrollX;
      //   const y = mouse.y + this.scene.cameras.main.scrollY;
      //   this.fire(angle, x, y);
      // },
      function () {
        if (this.isMelee === false && this.canMelee) {
          this.melee();
          // function (pointer) {
          //   let mouse = pointer;
          //   let angle = Phaser.Math.Angle.Between(
          //     this.x,
          //     this.y,
          //     mouse.x + this.scene.cameras.main.scrollX,
          //     mouse.y + this.scene.cameras.main.scrollY
          //   );
          //   // Determines if cd is over or not
          //   if (time > this.nextAttack) {
          //     // We need to pass in the sprite to use here
          //     this.fireWeapon(this.x, this.y, 'bigBlast', angle);
          //     // Calculates the cd between shots
          //     this.nextAttack += this.attackSpeed;
        }
      },
      this
    );
  }

  upgradeStats(type) {
    /*
      Upgrade logic for upgrading player stats. Code works but upgrade UI is not implemented yet. For now, it runs with certain hotkeys.
      param type: string -> the upgrade type.
          Current types: hp, ms, as, damage
      returns: null
    */
    switch (type) {
      case 'hp':
        console.log(`Health increased`);
        this.health += 10;
        this.upgrade.maxHealth += 10;
        // Update the hp bar. It doesn't change any hp values,
        // just updates so the max health will be updated.
        this.scene.events.emit('takeDamage', this.health, this.maxHealth);
        break;
      case 'ms':
        console.log(`Speed increased`);
        this.upgrade.moveSpeed += 10;
        break;
      case 'as':
        console.log(`Attack speed improved`);
        // This subtracts 100 ms from the cooldown, essentially
        this.upgrade.attackSpeed += 100;
        break;
      case 'damage':
        console.log(`Damage improved`);
        this.upgrade.damage += 10;
        break;
      default:
        console.log('Invalid upgrade type');
        return;
    }

    console.log(`Current health: `, this.health);
    console.log(`Max health: `, this.maxHealth);
    console.log(`Current move speed`, this.speed);
  }

  playDamageAnimation() {
    /*
      Adds the tween for when player gets damaged
    */
    return this.scene.tweens.add({
      targets: this,
      duration: 100,
      repeat: -1,
      tint: 0xffffff,
    });
  }

  knockback() {
    /*
        Player knockback. Doesn't work yet (potentially based on currently played animation)
    */
    this.body.touching.right ? this.setVelocityX(-500) : this.setVelocityX(500);
  }

  takeDamage(damage, gg) {
    /*
      Function for when the player takes damage. Will subtract the damage from current health and, if health <= 0, will transition to a game over scene.
      Adds one second of immunity to damage after being hit, with a visible tween so you know you just got hit.
      Lastly, updates the hp bar.
      param damage: int -> How much damage to take
      param gg: -> Sound file to play on death
      returns: null
    */

    // If player gets hit in the cooldown period,
    if (this.hitCooldown) {
      // Do nothing
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

  melee() {
    if (this.canMelee) {
      this.isMelee = true;
      if (this.facingRight) {
        this.play('punchRight', true);
      } else {
        this.play('punchLeft', true);
      }

      this.canMelee = false;

      this.scene.time.delayedCall(400, () => {
        this.isMelee = false;
      });

      this.scene.time.delayedCall(2000, () => {
        this.canMelee = true;
      });
    }
  }

  updateMovement(cursors) {
    /*
      Player movement logic based on which directional key is input.
      param cursors: Passed in through FgScene update function where cursors is hash table with keyboard inputs mapped to specific keys. (See this.cursors in FgScene.js for more info)
      returns: null
    */

    // If player is dead, this.body will be false. In this case, do nothing.
    if (!this.body) return;

    // Running up + left
    if (cursors.left.isDown && cursors.up.isDown) {
      this.facingRight = false;
      this.setVelocityY(-this.speed);
      this.setVelocityX(-this.speed);

      if (this.isMelee) {
        this.melee();
      } else {
        this.play('runUp', true);
      }
    }

    // Running up + right
    else if (cursors.right.isDown && cursors.up.isDown) {
      this.facingRight = true;
      this.setVelocityY(-this.speed);
      this.setVelocityX(this.speed);
      if (this.isMelee) {
        this.melee();
      } else {
        this.play('runUp', true);
      }
    }

    // Running down + left
    else if (cursors.left.isDown && cursors.down.isDown) {
      this.facingRight = false;
      this.setVelocityY(this.speed);
      this.setVelocityX(-this.speed);

      if (this.isMelee) {
        this.melee();
      } else {
        this.play('runDown', true);
      }
    }

    // Running down + right
    else if (cursors.right.isDown && cursors.down.isDown) {
      this.facingRight = true;
      this.setVelocityY(this.speed);
      this.setVelocityX(this.speed);
      if (this.isMelee) {
        this.melee();
      } else {
        this.play('runDown', true);
      }
    }

    // Running left
    else if (cursors.left.isDown) {
      this.facingRight = false;
      this.setVelocityX(-this.speed);
      this.setVelocityY(0);

      if (this.isMelee) {
        this.melee();
      } else {
        this.play('runLeft', true);
      }

      // Running right
    } else if (cursors.right.isDown) {
      this.facingRight = true;
      this.setVelocityX(this.speed);
      this.setVelocityY(0);

      if (this.isMelee) {
        this.melee();
      } else {
        this.play('runRight', true);
      }

      // Running up
    } else if (cursors.up.isDown) {
      this.setVelocityY(-this.speed);
      this.setVelocityX(0);

      if (this.isMelee) {
        this.melee();
      } else {
        this.play('runUp', true);
      }

      // Running down
    } else if (cursors.down.isDown) {
      this.setVelocityY(this.speed);
      this.setVelocityX(0);

      if (this.isMelee) {
        this.melee();
      } else {
        this.play('runDown', true);
      }

      // No movement
    } else {
      this.setVelocityX(0);
      this.setVelocityY(0);
      if (this.facingRight) {
        if (this.isMelee) {
          this.melee();
        } else {
          this.play('idleRight', true);
        }
      } else {
        if (this.isMelee) {
          this.melee();
        } else {
          this.play('idleLeft', true);
        }
      }
    }
  }

  update(cursors, time) {
    this.updateMovement(cursors);

    this.shoot(time);

    if (cursors.hp.isDown) {
      // this.upgrade('hp');
      console.log(this.x, this.y);
    } else if (cursors.speed.isDown) {
      this.upgradeStats('ms');
    }
  }
}
