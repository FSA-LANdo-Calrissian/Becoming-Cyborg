import Phaser from 'phaser';

export default class Enemy extends Phaser.Physics.Arcade.Sprite {
  constructor(scene, x, y, spriteKey) {
    super(scene, x, y, spriteKey);
    this.scene = scene;
    this.scene.physics.world.enable(this);
    this.scene.add.existing(this);
    this.body.setAllowGravity(false);
    this.speed = 80;
    this.health = 40;
    this.direction = '';
    this.isMoving = false;
    this.isMelee = false;
    this.canMelee = true;
    this.takeDamage = this.takeDamage.bind(this);
  }

  takeDamage(damage) {
    /*
      Enemy damage logic to update enemy health based on damage taken.
      If enemy dies, set enemy sprite to invisible + inactive + non-mobile + turn off collision.
      param damage: int -> The amount of damage the enemy will take.
      returns null.
    */

    // Subtract damage from health
    this.health -= damage;
    const hitAnimation = this.playDamageAnimation();

    // Death logic.
    if (this.health <= 0) {
      this.setVelocityX(0);
      this.setVelocityY(0);
      this.setActive(false);
      this.setVisible(false);
      this.body.enable = false;
    }
    this.scene.time.delayedCall(1000, () => {
      hitAnimation.stop();
      this.clearTint();
    });
  }

  playDamageAnimation() {
    return this.scene.tweens.add({
      targets: this,
      duration: 100,
      repeat: -1,
      tint: 0xffffff,
    });
  }

  enemyMovement(direction, angle) {
    /*
      Enemy animation logic. This will determine which sprite/animation to display while the enemy walks/runs/attacks.
      param direction: string -> Enemy current moving direction. Current strings are: left, right, up, down
      param angle: float -> Angle at which the enemy is facing. Only relevant for the punching up/down animations. Adjusts the enemy's angle to display properly.
    */
    switch (direction) {
      case 'left':
        this.angle = 0;
        this.direction = 'left';
        return this.play('enemyRunLeft', true);
      case 'right':
        this.angle = 0;
        this.direction = 'right';
        return this.play('enemyRunRight', true);
      case 'up':
        this.angle = 0;
        this.direction = 'up';
        return this.play('enemyRunUp', true);
      case 'down':
        this.angle = 0;
        this.direction = 'down';
        return this.play('enemyRunDown', true);
      case 'idle':
        this.angle = 0;
        return this.play('enemyIdleLeft', true);
      case 'punchLeft':
        this.angle = 0;
        return this.play('enemyPunchLeft', true);
      case 'punchRight':
        this.angle = 0;
        return this.play('enemyPunchRight', true);
      case 'punchUp':
        this.angle = (angle + Math.PI / 2) * Phaser.Math.RAD_TO_DEG;
        return this.play('enemyPunchUp', true);
      case 'punchDown':
        this.angle = (angle + Math.PI) * Phaser.Math.RAD_TO_DEG + 90;
        return this.play('enemyPunchDown', true);
    }
  }

  updateEnemyMovement(player) {
    //edge case for if enemy is suppposedly moving but not going anywhere. Tells enemy to keep going through patrol options
    if (
      this.isMoving === true &&
      (this.body.velocity === 0 || Math.abs(this.body.velocity) < 35)
    ) {
      this.randomPatrol();
    }
    /*
      Function to determine enemy aggro and enemy movement.
      If player is within a range of the constant aggroRange, enemy will move toward the player. If player is within attack range, enemy will stop moving and play attack animation.
      param player: object -> The player object, passed in through FgScene's update -> enemy update -> here. No need to change or touch.
      returns null.
    */
    if (!this.body) return;

    const aggroRange = 75;
    const attackRange = 16;

    const angle = Phaser.Math.Angle.Between(this.x, this.y, player.x, player.y);

    if (
      Phaser.Math.Distance.Between(player.x, player.y, this.x, this.y) <=
      attackRange
    ) {
      this.body.velocity.x = 0;
      this.body.velocity.y = 0;
      this.isMoving = false;

      if (Math.abs(player.y - this.y) <= 10 && player.x < this.x) {
        if (!this.canMelee) {
          return;
        } else {
          this.enemyMovement('punchLeft', angle);
          this.body.velocity.x = 0;
          this.body.velocity.y = 0;
          this.isMoving = false;
          this.isMelee = true;
          this.canMelee = false;
          this.scene.time.delayedCall(1000, () => {
            // this sets the melee attack duration
            this.isMelee = false;
          });
          this.scene.time.delayedCall(1000, () => {
            this.canMelee = true;
          });

          return;
        }
      } else if (player.x > this.x && Math.abs(player.y - this.y) <= 10) {
        if (!this.canMelee) {
          return;
        } else {
          this.enemyMovement('punchRight', angle);
          this.body.velocity.x = 0;
          this.body.velocity.y = 0;
          this.isMoving = false;
          this.isMelee = true;
          this.canMelee = false;
          this.scene.time.delayedCall(1000, () => {
            // this sets the melee attack duration
            this.isMelee = false;
          });

          this.scene.time.delayedCall(1000, () => {
            this.canMelee = true;
          });

          return;
        }
      } else if (player.y > this.y && Math.abs(player.x - this.x) <= 10) {
        if (!this.canMelee) {
          return;
        } else {
          this.enemyMovement('punchDown', angle);
          this.body.velocity.x = 0;
          this.body.velocity.y = 0;
          this.isMoving = false;
          this.isMelee = true;
          this.canMelee = false;
          this.scene.time.delayedCall(1000, () => {
            // this sets the melee attack duration
            this.isMelee = false;
          });
          this.scene.time.delayedCall(1000, () => {
            this.canMelee = true;
          });

          return;
        }
      } else if (player.y < this.y && Math.abs(player.x - this.x) <= 10) {
        if (!this.canMelee) {
          return;
        } else {
          this.enemyMovement('punchUp', angle);
          this.body.velocity.x = 0;
          this.body.velocity.y = 0;
          this.isMoving = false;
          this.isMelee = true;
          this.canMelee = false;
          this.scene.time.delayedCall(1000, () => {
            // this sets the melee attack duration
            this.isMelee = false;
          });
          this.scene.time.delayedCall(1000, () => {
            this.canMelee = true;
          });

          return;
        }
      }
    }

    if (
      Phaser.Math.Distance.Between(player.x, player.y, this.x, this.y) <=
      aggroRange
    ) {
      if (
        Math.round(player.x) === Math.round(this.x) &&
        Math.round(player.y) !== Math.round(this.y)
      ) {
        this.body.velocity.x = 0;
        if (Math.round(player.y) > Math.round(this.y)) {
          this.body.velocity.y = 35;
          this.enemyMovement('down');
        } else {
          this.body.velocity.y = -35;
          this.enemyMovement('up');
        }
      } else if (
        Math.round(player.y) === Math.round(this.y) &&
        Math.round(player.x) !== Math.round(this.x)
      ) {
        this.body.velocity.y = 0;
        if (Math.round(player.x) > Math.round(this.x)) {
          this.body.velocity.x = 35;
          this.enemyMovement('right');
        } else {
          this.body.velocity.x = -35;
          this.enemyMovement('left');
        }
      }

      console.log('im chasing');
      // if player to left of enemy AND enemy moving to right (or not moving)
      if (
        Math.round(player.x) < Math.round(this.x) &&
        Math.round(this.body.velocity.x) >= 0
      ) {
        // move enemy to left
        this.body.velocity.x = -35;
        this.enemyMovement('left');
        this.isMoving = true;
      }
      // if player to right of enemy AND enemy moving to left (or not moving)
      else if (
        Math.round(player.x) > Math.round(this.x) &&
        Math.round(this.body.velocity.x) <= 0
      ) {
        // move enemy to right
        this.body.velocity.x = 35;
        this.enemyMovement('right');
        this.isMoving = true;
      } else if (
        Math.round(player.y) < Math.round(this.y) &&
        Math.round(this.body.velocity.y) >= 0
      ) {
        this.body.velocity.y = -35;
        this.enemyMovement('up');
        this.isMoving = true;
      } else if (
        Math.round(player.y) > Math.round(this.y) &&
        Math.round(this.body.velocity.y) <= 0
      ) {
        this.body.velocity.y = 35;
        this.enemyMovement('down');
        this.isMoving = true;
      }
    } else {
      this.scene.time.delayedCall(2000, () => {
        return this.randomPatrol();
      });
    }
  }

  randomPatrol() {
    if (
      (this.body.velocity.x === 0 && this.body.velocity.y == 0) ||
      Math.abs(this.body.velocity) < 35
    ) {
      this.isMoving = false;
    }
    // function that gets a random number and tells enemy to patrol based on the random number
    let randomNum = this.getRandomInt(5);
    if (randomNum === 1) {
      if (this.isMoving === false) {
        this.body.velocity.x = -35;
        this.enemyMovement('left');
        this.isMoving = true;
        this.scene.time.delayedCall(3000, () => {
          this.body.velocity.y = 0;
          this.isMoving = false;
        });
      }
    } else if (randomNum === 2) {
      if (this.isMoving === false) {
        this.body.velocity.x = 35;
        this.enemyMovement('right');
        this.isMoving = true;
        this.scene.time.delayedCall(3000, () => {
          this.body.velocity.y = 0;
          this.isMoving = false;
        });
      }
    } else if (randomNum === 3) {
      if (this.isMoving === false) {
        this.body.velocity.y = -35;
        this.enemyMovement('up');
        this.isMoving = true;
        this.scene.time.delayedCall(3000, () => {
          this.body.velocity.y = 0;
          this.isMoving = false;
        });
      }
    } else if (this.isMoving === false) {
      this.body.velocity.y = 35;
      this.enemyMovement('down');
      this.isMoving = true;
      this.scene.time.delayedCall(3000, () => {
        this.body.velocity.y = 0;
        this.isMoving = false;
      });
    } else {
      return;
    }
  }
  getRandomInt(max) {
    // just generates a random number for enemy patrol
    return Math.floor(Math.random() * Math.floor(max));
  }

  update(player) {
    this.updateEnemyMovement(player);
  }
}
