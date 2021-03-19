import Phaser from 'phaser';

export default class Enemy extends Phaser.Physics.Arcade.Sprite {
  constructor(scene, x, y, spriteKey) {
    super(scene, x, y, spriteKey);
    this.scene = scene;
    this.scene.physics.world.enable(this);
    this.scene.add.existing(this);
    this.body.setAllowGravity(false);
    this.speed = 80;
    this.health = 100;
    this.direction = '';
  }

  enemyMovement(direction) {
    switch (direction) {
      case 'left':
        this.direction = 'left';
        return this.play('enemyRunLeft', true);
      case 'right':
        this.direction = 'right';
        return this.play('enemyRunRight', true);
      case 'up':
        this.direction = 'up';
        return this.play('enemyRunUp', true);
      case 'down':
        this.direction = 'down';
        return this.play('enemyRunDown', true);
      case 'idle':
        return this.play('enemyIdleLeft', true);
      case 'punchLeft':
        return this.play('enemyPunchLeft', true);
      case 'punchRight':
        return this.play('enemyPunchRight', true);
      case 'punchUp':
        return this.play('enemyPunchUp', true);
      case 'punchDown':
        return this.play('enemyPunchDown', true);
    }
  }

  updateEnemyMovement(player) {

    if (this.active) {
      if (
        Phaser.Math.Distance.Between(player.x, player.y, this.x, this.y) <= 18
      ) {
        this.body.velocity.x = 0;
        this.body.velocity.y = 0;

        if (player.y < this.y && player.x < this.x) {
          this.enemyMovement('punchLeft');
          this.body.velocity.x = 0;
          this.body.velocity.y = 0;

          return;
        }

        if (player.y > this.y && player.x > this.x) {
          this.enemyMovement('punchRight');
          this.body.velocity.x = 0;
          this.body.velocity.y = 0;

          return;
        }

        if (player.y > this.y) {
          if (player.x < this.x) {
            this.enemyMovement('punchLeft');
          }
          this.enemyMovement('punchDown');
          this.body.velocity.x = 0;
          this.body.velocity.y = 0;

          return;
        }

        if (player.y < this.y) {
          if (player.x > this.x) {
            this.enemyMovement('punchRight');
          } else {
            this.enemyMovement('punchUp');
            this.body.velocity.x = 0;
            this.body.velocity.y = 0;

            return;
          }
        }

        if (player.x < this.x) {
          // console.log('player on the left');
          this.enemyMovement('punchLeft');

          this.body.velocity.x = 0;
          this.body.velocity.y = 0;

          return;
        }
        if (player.x > this.x) {
          // console.log('player on the right');
          this.enemyMovement('punchRight');
          this.body.velocity.x = 0;
          this.body.velocity.y = 0;
          return;
        }
      }

      if (Math.round(player.x) === Math.round(this.x)) {
        this.body.velocity.x = 0;
      } else if (Math.round(player.y) === Math.round(this.y)) {
        this.body.velocity.y = 0;
      }

      if (
        Phaser.Math.Distance.Between(player.x, player.y, this.x, this.y) <= 100
      ) {
        // if player to left of enemy AND enemy moving to right (or not moving)
        if (
          Math.round(player.x) < Math.round(this.x) &&
          Math.round(this.body.velocity.x) >= 0
        ) {
          // move enemy to left
          this.body.velocity.x = -35;
          this.enemyMovement('left');
        }
        // if player to right of enemy AND enemy moving to left (or not moving)
        else if (
          Math.round(player.x) > Math.round(this.x) &&
          Math.round(this.body.velocity.x) <= 0
        ) {
          // move enemy to right
          this.body.velocity.x = 35;
          this.enemyMovement('right');
        } else if (
          Math.round(player.y) < Math.round(this.y) &&
          Math.round(this.body.velocity.y) >= 0
        ) {
          this.body.velocity.y = -35;
          this.enemyMovement('up');
        } else if (
          Math.round(player.y) > Math.round(this.y) &&
          Math.round(this.body.velocity.y) <= 0
        ) {
          this.body.velocity.y = 35;
          this.enemyMovement('down');
        }
      }
    }
  }

  update(player) {
    this.updateEnemyMovement(player);
  }
}
