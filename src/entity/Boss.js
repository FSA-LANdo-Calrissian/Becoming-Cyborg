import Phaser from 'phaser';

export default class Boss extends Phaser.Physics.Arcade.Sprite {
  constructor(scene, x, y, spriteKey) {
    super(scene, x, y, spriteKey);
    this.fightStarted = false;
    this.attackCD = 5000;
  }

  startFight() {}

  attack() {}

  update() {}
}
