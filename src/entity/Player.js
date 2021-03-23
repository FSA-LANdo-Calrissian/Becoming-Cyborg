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
      armor: 0,
    };
    this.speed = 100 + this.upgrade.moveSpeed;
    this.armor = 0 + this.upgrade.armor;
    this.regen = 0 + this.upgrade.regen;
    this.health = 100;
    this.maxHealth = 100 + this.upgrade.maxHealth;
    this.stats = {
      kills: 50,
    };
    this.facingRight = false;
    this.lastHurt = 0;
    this.damage = 20 + this.upgrade.damage;
    this.attackSpeed = 2000 - this.upgrade.attackSpeed; // This is the cooldown between hits
    this.nextAttack = 0;
    this.isMelee = false;
    this.canMelee = true;
    this.shooting = false;
    // Helper function to fire weapon.
    this.fireWeapon = (x, y, sprite, angle) => {
      fireWeapon(x, y, sprite, angle);
    };

    this.nextHeal = 0;
    this.regenCD = 5000;

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

  updateStats() {
    /*
      Helper function to upgrade the stats after an upgrade was put in. This is because this.speed and all the other stats do not dynamically update as we update the "this.upgrade" object, so we reset it here.
    */
    this.speed = 100 + this.upgrade.moveSpeed;
    this.maxHealth = 100 + this.upgrade.maxHealth;
    this.damage = 10 + this.upgrade.damage;
    this.attackSpeed = 2000 - this.upgrade.attackSpeed;
    this.armor = 0 + this.upgrade.armor;
    this.regen = 0 + this.upgrade.regen;
  }

  upgradeStats(type) {
    /*
      Upgrade logic for upgrading player stats. Code works but upgrade UI is not implemented yet. For now, it runs with certain hotkeys.
      param type: string -> the upgrade type.
          Current types: hpUp, hpDown, ms, as, damage
      returns: null
    */

    switch (type) {
      case 'hpUp':
        this.health += 10;
        this.upgrade.maxHealth += 10;
        break;
      case 'hpDown':
        this.health -= 10;
        this.upgrade.maxHealth -= 10;
        break;
      case 'msUp':
        this.upgrade.moveSpeed += 5;
        break;
      case 'msDown':
        this.upgrade.moveSpeed -= 5;
        break;
      case 'armorUp':
        this.upgrade.armor += 1;
        break;
      case 'armorDown':
        this.upgrade.armor -= 1;
        break;
      case 'regenUp':
        this.upgrade.regen += 1;
        break;
      case 'regenDown':
        this.upgrade.regen -= 1;
        break;
      default:
        console.log('Invalid upgrade type');
        return;
    }

    this.updateStats();
    // Update the hp bar. It doesn't change any hp values,
    // just updates so the max health will be updated.
    this.scene.events.emit('takeDamage', this.health, this.maxHealth);
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
    console.log(`body touching?`, this.body.touching);
    // Otherwise, set hit cooldown
    this.hitCooldown = true;
    // Logic for slight knockback
    this.knockback();
    // Play damage
    const hitAnimation = this.playDamageAnimation();

    // Subtract damage minus armor reduction from current health
    this.health -= damage - this.armor;

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
    //checks if player canMelee based on a timeout
    if (this.canMelee) {
      this.isMelee = true;

      // if player is facing right, melee in that direction else melee in other direction
      if (this.facingRight) {
        this.play('punchRight', true);
      } else {
        this.play('punchLeft', true);
      }
      // since player is actively meleeing, sets canMelee to false so the player cannot melee while he is meleeing
      this.canMelee = false;

      this.scene.time.delayedCall(400, () => {
        // this sets the melee attack duration
        this.isMelee = false;
      });

      this.scene.time.delayedCall(2000, () => {
        // this is the cooldown for melee attack
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
        //if the player is in the process of meleeing, sets the animation to melee instead of running
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

    // Regen logic. Heal this.regen hp every 5 seconds
    if (time > this.nextHeal) {
      // Only when not at max health
      if (this.health < this.maxHealth) {
        // If regen pushes you over max health, set hp to max health
        if (this.health + this.regen > this.maxHealth) {
          this.health = this.maxHealth;
        } else {
          // Otherwise, add regen
          this.health += this.regen;
        }
        this.scene.events.emit('takeDamage', this.health, this.maxHealth);
        this.nextHeal += this.regenCD;
      }
    }
  }
}
