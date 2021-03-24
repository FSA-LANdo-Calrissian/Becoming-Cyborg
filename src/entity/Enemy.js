import Phaser from 'phaser';
import Item from './Item';

export default class Enemy extends Phaser.Physics.Arcade.Sprite {
  constructor(scene, x, y, spriteKey, classType) {
    super(scene, x, y, spriteKey);
    this.spriteKey = spriteKey.includes('wolf') ? 'wolf' : spriteKey;
    this.scene = scene;
    this.class = classType;
    this.scene.physics.world.enable(this);
    this.scene.add.existing(this);
    this.body.setAllowGravity(false);
    this.speed = 80;
    this.health = 4;
    this.direction = '';
    this.isMoving = false;
    this.isMelee = false;
    this.canMelee = true;
    this.goingLeft = false;
    this.goingRight = false;
    this.dropTable = {
      robot: ['potion', 'iron'],
      animal: ['potion'],
    };
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
        ).setScale(0.1);
        this.scene.itemsGroup.add(drop);
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
      this.dropItems();
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

  updateEnemyMovement(player) {
    /*
      Function to determine enemy aggro and enemy movement.
      If player is within a range of the constant aggroRange, enemy will move toward the player. If player is within attack range, enemy will stop moving and play attack animation.
      param player: object -> The player object, passed in through FgScene's update -> enemy update -> here. No need to change or touch.
      returns null.
    */
    if (!this.body) return;

    const aggroRange = 85;
    const attackRange = 8;

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
    } else if (
      Phaser.Math.Distance.Between(player.x, player.y, this.x, this.y) >=
      aggroRange
    ) {
      //if player is out of range, enemy stops then after 5 secs goes on patrol
      this.body.velocity.y = 0;
      this.body.velocity.x = 0;
      if (this.scene.tutorialInProgress) {
        return;
      } else {
        this.scene.time.delayedCall(6000, () => {
          this.randomPatrol(player, aggroRange);
        });
      }
    }
  }

  randomPatrol(player, aggroRange) {
    if (
      Phaser.Math.Distance.Between(player.x, player.y, this.x, this.y) >
      aggroRange
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
        } else if (
          this.goingRight &&
          Phaser.Math.Distance.Between(player.x, player.y, this.x, this.y) >
            aggroRange
        ) {
          // checks if enemy is still outta range and if enemy was going right switch to going left
          this.body.velocity.y = 0;
          this.body.velocity.x = -35;

          this.enemyMovement('left');

          this.scene.time.delayedCall(2000, () => {
            // switch back to going right after 5 seconds
            this.goingRight = false;
            this.goingLeft = true;
          });
          return;
        } else {
          return;
        }
      });
    } else {
      return;
    }
  }

  update(player) {
    this.updateEnemyMovement(player);
  }
}
