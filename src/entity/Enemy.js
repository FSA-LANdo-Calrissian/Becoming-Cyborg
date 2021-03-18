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
    }
  }
}
