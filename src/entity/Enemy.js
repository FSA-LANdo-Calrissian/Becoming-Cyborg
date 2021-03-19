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
    }
  }

  updateEnemyMovement(player, enemy) {
    if (
      Phaser.Math.Distance.Between(player.x, player.y, enemy.x, enemy.y) <= 18
    ) {
      enemy.body.velocity.x = 0;
      enemy.body.velocity.y = 0;

      if (player.y < enemy.y && player.x < enemy.x) {
        enemy.enemyMovement('punchUp');
        enemy.body.velocity.x = 0;
        enemy.body.velocity.y = 0;
        return;
      }

      if (player.y < enemy.y) {
        enemy.enemyMovement('punchUp');
        enemy.body.velocity.x = 0;
        enemy.body.velocity.y = 0;
        return;
      }

      if (player.x < enemy.x) {
        // console.log('player on the left');
        enemy.enemyMovement('punchLeft');

        enemy.body.velocity.x = 0;
        enemy.body.velocity.y = 0;

        return;
      }
      if (player.x > enemy.x) {
        // console.log('player on the right');
        enemy.enemyMovement('punchRight');
        enemy.body.velocity.x = 0;
        enemy.body.velocity.y = 0;
        return;
      }
    }

    if (Math.round(player.x) === Math.round(enemy.x)) {
      enemy.body.velocity.x = 0;
    } else if (Math.round(player.y) === Math.round(enemy.y)) {
      enemy.body.velocity.y = 0;
    }
    if (
      Phaser.Math.Distance.Between(player.x, player.y, enemy.x, enemy.y) <= 100
    ) {
      // if player to left of enemy AND enemy moving to right (or not moving)
      if (
        Math.round(player.x) < Math.round(enemy.x) &&
        Math.round(enemy.body.velocity.x) >= 0
      ) {
        // move enemy to left
        enemy.body.velocity.x = -35;
        enemy.enemyMovement('left');
      }
      // if player to right of enemy AND enemy moving to left (or not moving)
      else if (
        Math.round(player.x) > Math.round(enemy.x) &&
        Math.round(enemy.body.velocity.x) <= 0
      ) {
        // move enemy to right
        enemy.body.velocity.x = 35;
        enemy.enemyMovement('right');
      } else if (
        Math.round(player.y) < Math.round(enemy.y) &&
        Math.round(enemy.body.velocity.y) >= 0
      ) {
        enemy.body.velocity.y = -35;
        enemy.enemyMovement('up');
      } else if (
        Math.round(player.y) > Math.round(enemy.y) &&
        Math.round(enemy.body.velocity.y) <= 0
      ) {
        enemy.body.velocity.y = 35;
        enemy.enemyMovement('down');
      }
    }
  }
}
