import Phaser from 'phaser';
import Projectile from './Projectile';

export default class Boss extends Phaser.Physics.Arcade.Sprite {
  constructor(scene, x, y, spriteKey) {
    super(scene, x, y, spriteKey);
    this.scene = scene;
    this.scene.physics.world.enable(this);
    this.scene.add.existing(this);
    this.body.setAllowGravity(false);
    this.fightStarted = false;
    this.attackCD = 5000;
    this.health =
      spriteKey === 'bossfightleft' || spriteKey === 'bossfistright'
        ? 2500
        : 5000;
  }

  startFight() {
    this.play('unarmed');
    this.setVisible(false);
    this.setActive(false);
    this.body.enable = false;
    console.log(`Starting boss fight...`);
  }

  // Left hand skills
  leftHandSmash() {
    // 950 700
    const angle = Phaser.Math.Angle.Between(this.x, this.y, 925, 700);
    this.angle = angle * Phaser.Math.RAD_TO_DEG;

    this.scene.time.delayedCall(1000, () => {
      this.scene.physics.moveTo(this, 925, 700, 700, 1000);
      this.scene.time.delayedCall(1000, () => {
        this.body.stop();
        this.scene.cameras.main.shake(300, 0.001);
        this.releaseShockwaves();
      });
    });
  }

  releaseShockwaves() {
    for (let i = 0; i < 30; i++) {
      const proj = new Projectile(this.scene, this.x, this.y, 'shockwave');
      proj.play('shockwave');
      proj.lifespan = 10000;
      proj.shoot(this.x, this.y, i);
      this.scene.shockwavesGroup.add(proj);
    }
  }

  attack() {}

  update() {}
}
