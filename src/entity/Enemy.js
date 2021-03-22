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
    this.takeDamage = this.takeDamage.bind(this);
  }

  takeDamage(damage) {
    this.health -= damage;
    const hitAnimation = this.playDamageAnimation();

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
    if (!this.body) return;

    const angle = Phaser.Math.Angle.Between(this.x, this.y, player.x, player.y);

    if (
      Phaser.Math.Distance.Between(player.x, player.y, this.x, this.y) <= 16
    ) {
      this.body.velocity.x = 0;
      this.body.velocity.y = 0;

      if (Math.abs(player.y - this.y) <= 10 && player.x < this.x) {
        this.enemyMovement('punchLeft', angle);
        this.body.velocity.x = 0;
        this.body.velocity.y = 0;

        return;
      } else if (player.x > this.x && Math.abs(player.y - this.y) <= 10) {
        this.enemyMovement('punchRight', angle);
        this.body.velocity.x = 0;
        this.body.velocity.y = 0;

        return;
      } else if (player.y > this.y && Math.abs(player.x - this.x) <= 10) {
        this.enemyMovement('punchDown', angle);
        this.body.velocity.x = 0;
        this.body.velocity.y = 0;

        return;
      } else if (player.y < this.y && Math.abs(player.x - this.x) <= 10) {
        this.enemyMovement('punchUp', angle);
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
      Phaser.Math.Distance.Between(player.x, player.y, this.x, this.y) <= 50
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

  update(player) {
    this.updateEnemyMovement(player);
  }
}
