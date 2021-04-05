import Phaser from 'phaser';
import Item from './Item';

export default class Enemy extends Phaser.Physics.Arcade.Sprite {
  constructor(scene, x, y, spriteKey, classType, number, attackSound) {
    super(scene, x, y, spriteKey);
    this.spriteKey = spriteKey.includes('wolf') ? 'wolf' : spriteKey;
    this.scene = scene;
    this.class = classType;
    this.scene.physics.world.enable(this);
    this.scene.add.existing(this);
    this.body.setAllowGravity(false);
    this.speed = classType === 'robot' ? 80 : 85;
    this.health = classType === 'robot' ? 60 : 30;
    this.damage = classType === 'robot' ? 12 : 10;
    this.direction = '';
    this.isMoving = false;
    this.enemyArr = [];
    this.enemysNumber = number;
    this.isMelee = false;
    this.canMelee = true;
    this.goingLeft = false;
    this.goingRight = false;
    this.dropTable = {
      robot: ['potion', 'iron', 'oil'],
      animal: ['potion'],
    };
    this.isDead = false;
    this.count = 0;
    this.needToSeparate = false;
    this.attackSound = attackSound;

    // Bindings
    this.takeDamage = this.takeDamage.bind(this);
    this.dropItems = this.dropItems.bind(this);
  }

  dropItems() {
    /*
      Method to drop items on death. The items spawn based on a drop table (this.dropTable). The class (this.class) determines which drop table to select from.
      amount is a random number between 1 and 3 for how many items will drop.
      item is which item will drop. It calls droptable[class][index], where class is this.class and index is a random integer between 0 and length of drop table.
      drop is the item that drops and then adds it to the items group. It will spawn a random distance away from the dead enemy's x,y coordinate.
      It will attempt to grab an existing drop from the group before trying to create it.
    */

    const type = this.class;
    const amount = Math.floor(Math.random() * 3 + 1);
    for (let i = 0; i < amount; i++) {
      const itemKey = this.dropTable[type][
        Math.floor(Math.random() * this.dropTable[type].length)
      ];

      // Find drop from group if available
      let drop = this.scene.itemsGroup.getFirstDead(
        false,
        this.x + Math.random() * 20,
        this.y + Math.random() * 20,
        itemKey
      );

      if (!drop) {
        // Create + add to group if not available
        drop = new Item(
          this.scene,
          this.x + Math.random() * 20,
          this.y + Math.random() * 20,
          itemKey
        )
          .setScale(0.2)
          .setDepth(7);
        this.scene.itemsGroup.add(drop);
      } else {
        if (drop.texture.key !== itemKey) {
          drop.texture.key = itemKey;
        }
      }
      // Reset base config for items in case grabbed from group
      drop.reset();
    }
  }

  takeDamage(damage) {
    /*
      Enemy damage logic to update enemy health based on damage taken.
      If enemy dies, set enemy sprite to invisible + inactive + non-mobile + turn off collision.
      param damage: int -> The amount of damage the enemy will take.
      returns null.
    */

    // If enemy gets hit in cooldown period,
    if (this.hitCooldown) {
      // Do nothing
      return;
    }

    // Otherwise, set hit cooldown
    this.hitCooldown = true;

    // Play damage
    const hitAnimation = this.playDamageAnimation();

    // Subtract damage from health
    this.health -= damage;

    // Death logic.
    if (this.health <= 0) {
      this.on('animationcomplete-death', () => {
        this.setActive(false);
        this.setVisible(false);
        this.dropItems();
      });
      this.isDead = true;
      this.setVelocityX(0);
      this.setVelocityY(0);
      this.body.enable = false;
      this.play('death', true);
      return;
    }
    this.on('animationstart-death', () => {
      hitAnimation.stop();
      this.clearTint();
    });

    // After hit cooldown time, set to false, stop animation, and remove tint.
    this.scene.time.delayedCall(450, () => {
      this.hitCooldown = false;
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

    // Play attack sound when attacking
    if (this.attackSound && direction.includes('punch')) {
      this.attackSound.play();
    }

    switch (direction) {
      case 'left':
        this.angle = 0;
        this.direction = 'left';
        return this.play(`${this.spriteKey}RunLeft`, true);
      case 'right':
        this.angle = 0;
        this.direction = 'right';
        return this.play(`${this.spriteKey}RunRight`, true);
      case 'up':
        this.angle = 0;
        this.direction = 'up';
        return this.play(`${this.spriteKey}RunUp`, true);
      case 'down':
        this.angle = 0;
        this.direction = 'down';
        return this.play(`${this.spriteKey}RunDown`, true);
      case 'idle':
        this.angle = 0;
        return this.play(`${this.spriteKey}IdleRight`, true);
      case 'punchLeft':
        this.angle = 0;
        return this.play(`${this.spriteKey}AttackLeft`, true);
      case 'punchRight':
        this.angle = 0;
        return this.play(`${this.spriteKey}AttackRight`, true);
      case 'punchUp':
        this.angle = (angle + Math.PI / 2) * Phaser.Math.RAD_TO_DEG;
        return this.play(`${this.spriteKey}AttackUp`, true);
      case 'punchDown':
        this.angle = (angle + Math.PI) * Phaser.Math.RAD_TO_DEG + 90;
        return this.play(`${this.spriteKey}AttackDown`, true);
    }
  }

  separate() {
    this.enemyArr = this.scene.enemiesGroup
      .getChildren()
      .filter((enemy) => !enemy.isDead);

    for (let i = 0; i < this.enemyArr.length; i++) {
      for (let j = i + 1; j < this.enemyArr.length; j++) {
        // if (this.enemyArr[i] && this.enemyArr[j]) {
        console.log(this.enemyArr[i], this.enemyArr[j]);
        if (
          Phaser.Math.Distance.Between(
            this.enemyArr[i].x,
            this.enemyArr[i].y,
            this.enemyArr[j].x,
            this.enemyArr[j].y
          ) <= 40
        ) {
          console.log(this.enemyArr[i], this.enemyArr[j]);
          this.needToSeparate = true;

          if (this.enemyArr[j].x < this.enemyArr[i].x) {
            this.enemyArr[i].body.velocity.x = 35;
            this.enemyArr[i].body.velocity.y = 0;
            this.enemyArr[i].enemyMovement('right');
            this.isMoving = true;

            this.enemyArr[j].body.velocity.x = -35;
            this.enemyArr[j].body.velocity.y = 0;
            this.enemyArr[j].enemyMovement('left');
            this.isMoving = true;
          } else if (this.enemyArr[j].y < this.enemyArr[i].y) {
            this.enemyArr[i].body.velocity.y = 35;
            this.enemyArr[i].body.velocity.x = 0;
            this.enemyArr[i].enemyMovement('down');
            this.isMoving = true;

            this.enemyArr[j].body.velocity.y = -35;
            this.enemyArr[j].body.velocity.x = 0;
            this.enemyArr[j].enemyMovement('up');
            this.isMoving = true;
          } else if (this.enemyArr[j].x > this.enemyArr[i].x) {
            this.enemyArr[i].body.velocity.x = -35;
            this.enemyArr[i].body.velocity.y = 0;
            this.enemyArr[i].enemyMovement('left');

            this.enemyArr[j].body.velocity.x = 35;
            this.enemyArr[j].body.velocity.y = 0;
            this.enemyArr[j].enemyMovement('right');
          } else {
            // if (this.enemyArr[j].y > this.enemyArr[i].y) {
            this.enemyArr[i].body.velocity.y = 35;
            this.enemyArr[i].body.velocity.x = 0;
            this.enemyArr[i].enemyMovement('down');

            this.enemyArr[j].body.velocity.y = -35;
            this.enemyArr[j].body.velocity.x = 0;
            this.enemyArr[j].enemyMovement('up');
          }
        } else {
          this.needToSeparate = false;
          return;
        }
        // }
      }
    }
  }

  updateEnemyMovement(player) {
    /*
      Function to determine enemy aggro and enemy movement.
      If player is within a range of the constant aggroRange, enemy will move toward the player. If player is within attack range, enemy will stop moving and play attack animation.
      param player: object -> The player object, passed in through FgScene's update -> enemy update -> here. No need to change or touch.
      returns null.
    */

    if (!this.body) return;

    const aggroRange = 120;
    const attackRange = 8;

    const angle = Phaser.Math.Angle.Between(this.x, this.y, player.x, player.y);

    if (
      Phaser.Math.Distance.Between(player.x, player.y, this.x, this.y) <=
        attackRange &&
      this.needToSeparate === false
    ) {
      // console.log('attacking');
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
    } else if (
      Phaser.Math.Distance.Between(player.x, player.y, this.x, this.y) <=
        aggroRange &&
      this.needToSeparate === false
    ) {
      // console.log('aggro');
      if (
        Math.abs(Math.round(player.x) - Math.round(this.x)) <= 5 &&
        Math.abs(Math.round(player.y) - Math.round(this.y)) > 5
      ) {
        this.body.velocity.x = 0;
        if (Math.round(player.y) > Math.round(this.y)) {
          this.body.velocity.y = this.speed;
          this.enemyMovement('down');
          return;
        } else {
          this.body.velocity.y = -this.speed;
          this.enemyMovement('up');
          return;
        }
      } else if (
        Math.abs(Math.round(player.y) - Math.round(this.y)) <= 5 &&
        Math.abs(Math.round(player.x) - Math.round(this.x)) > 5
      ) {
        this.body.velocity.y = 0;
        if (Math.round(player.x) > Math.round(this.x)) {
          this.body.velocity.x = this.speed;
          this.enemyMovement('right');
          return;
        } else {
          this.body.velocity.x = -this.speed;
          this.enemyMovement('left');
          return;
        }
      }

      // if player to left of enemy AND enemy moving to right (or not moving)
      if (
        Math.abs(player.y - this.y) < 1.5 &&
        player.x < this.x &&
        Math.round(this.body.velocity.x) >= 0
      ) {
        // move enemy to left
        this.body.velocity.x = -this.speed;
        this.enemyMovement('left');
        this.isMoving = true;
        return;
      }
      // if player to right of enemy AND enemy moving to left (or not moving)
      else if (
        player.x > this.x &&
        Math.abs(player.y - this.y) < 1.5 &&
        Math.round(this.body.velocity.x) <= 0
      ) {
        // move enemy to right
        this.body.velocity.x = this.speed;
        this.enemyMovement('right');
        this.isMoving = true;
        return;
      } else if (
        player.y < this.y &&
        Math.abs(player.x - this.x) < 1.5 &&
        Math.round(this.body.velocity.y) >= 0
      ) {
        this.body.velocity.y = -this.speed;
        this.enemyMovement('up');
        this.isMoving = true;
        return;
      } else if (
        player.y > this.y &&
        Math.abs(player.x - this.x) <= 1.5 &&
        Math.round(this.body.velocity.y) <= 0
      ) {
        this.body.velocity.y = this.speed;
        this.enemyMovement('down');
        this.isMoving = true;
        return;
      }
    } else if (
      Phaser.Math.Distance.Between(player.x, player.y, this.x, this.y) >=
      aggroRange
    ) {
      //if player is out of range, enemy stops then after 5 secs goes on patrol
      this.body.velocity.y = 0;
      this.body.velocity.x = 0;
      if (!this.isDead) {
        this.scene.time.delayedCall(6000, () => {
          if (!this.scene.dialogueInProgress && !this.isDead) {
            this.randomPatrol(player, aggroRange);
          }
        });
      }
    }
  }

  randomPatrol(player, aggroRange) {
    if (this.isDead) {
      return;
    } else {
      if (
        Phaser.Math.Distance.Between(player.x, player.y, this.x, this.y) >
          aggroRange &&
        !this.isDead
      ) {
        // makes sure player is still out of range and starts patrol of by stopping first
        this.body.velocity.y = 0;
        this.body.velocity.x = 0;
        this.scene.time.delayedCall(3000, () => {
          if (
            // if enemy is going left or this is the first time patrol is called we want him to go right
            (this.goingLeft ||
              (this.goingLeft === false && this.goingRight === false)) &&
            Phaser.Math.Distance.Between(player.x, player.y, this.x, this.y) >
              aggroRange
          ) {
            if (this.isDead) {
              return;
            } else {
              //going right
              this.body.velocity.y = 0;
              this.body.velocity.x = 35;
              this.enemyMovement('right');

              this.scene.time.delayedCall(2000, () => {
                // after 5 seconds switch to going left
                this.goingLeft = false;
                this.goingRight = true;
              });
              return;
            }
          } else if (
            this.goingRight &&
            Phaser.Math.Distance.Between(player.x, player.y, this.x, this.y) >
              aggroRange
          ) {
            if (this.isDead) {
              return;
            } else {
              // checks if enemy is still outta range and if enemy was going right switch to going left
              this.body.velocity.y = 0;
              this.body.velocity.x = -this.speed;

              this.enemyMovement('left');

              this.scene.time.delayedCall(2000, () => {
                // switch back to going right after 5 seconds
                this.goingRight = false;
                this.goingLeft = true;
              });
              return;
            }
          } else {
            return;
          }
        });
      } else {
        return;
      }
    }
  }

  update() {
    const player1 = this.scene.player;
    if (!this.isDead && !this.scene.dialogueInProgress) {
      this.updateEnemyMovement(player1);
      this.separate();
    }
  }
}
