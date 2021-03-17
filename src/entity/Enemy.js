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
  }

  enemyMovement(direction) {
    switch (direction) {
      case 'left':
        return this.play('enemyRunLeft');
      case 'right':
        return this.play('enemyRunRight');
      case 'up':
        return this.play('enemyRunUp');
      case 'down':
        return this.play('enemyRunDown');
    }
  }
}
