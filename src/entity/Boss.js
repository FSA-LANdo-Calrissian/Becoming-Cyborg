import Phaser from 'phaser';

export default class Boss extends Phaser.Physics.Arcade.Sprite {
  constructor(scene, x, y, spriteKey) {
    super(scene, x, y, spriteKey);
    this.scene = scene;
    this.scene.physics.world.enable(this);
    this.scene.add.existing(this);
    this.body.setAllowGravity(false);
    this.fightStarted = false;
    this.attackCD = 5000;
  }

  startFight() {
    this.play('unarmed');
    this.setVisible(false);
    this.body.enable = false;
    console.log(`Starting boss fight...`);
  }

  attack() {}

  update() {}
}
