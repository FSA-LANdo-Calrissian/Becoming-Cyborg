import Phaser from 'phaser';
import Projectile from './Projectile';

export default class Boss extends Phaser.Physics.Arcade.Sprite {
  constructor(scene, x, y, spriteKey) {
    super(scene, x, y, spriteKey);
    this.scene = scene;
    this.scene.physics.world.enable(this);
    this.defaultX = x;
    this.defaultY = y;
    this.fist = spriteKey === 'bossfistleft' ? 'left' : 'right';
    this.scene.add.existing(this);
    this.body.setAllowGravity(false);
    this.fightStarted = false;
    this.damage = 25;
    this.isDead = false;
    this.attacking = false;
    this.attackCD = 10000;
    this.nextAttack = 0;
    this.resetting = false;
    this.loadAttack = 1000;
    this.resetTime = 3000;
    this.tracking = false;
    this.health =
      spriteKey === 'bossfistleft' || spriteKey === 'bossfistright'
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
    console.log(`Left hand preparing to smash...`);
    // 950 700
    const angle = Phaser.Math.Angle.Between(this.x, this.y, 925, 700);
    this.angle = angle * Phaser.Math.RAD_TO_DEG;

    this.scene.time.delayedCall(this.loadAttack, () => {
      this.scene.physics.moveTo(this, 925, 700, 700, 1000);
      this.scene.time.delayedCall(1000, () => {
        this.body.stop();
        this.scene.cameras.main.shake(300, 0.001);
        this.releaseShockwaves();
        this.scene.time.delayedCall(this.resetTime, () => {
          this.resetPosition();
        });
      });
    });
  }

  rightHandSmash() {
    console.log(`Right hand preparing to smash...`);
    // 950 700
    const angle = Phaser.Math.Angle.Between(this.x, this.y, 500, 700);
    this.angle = angle * Phaser.Math.RAD_TO_DEG;

    this.scene.time.delayedCall(this.loadAttack, () => {
      this.scene.physics.moveTo(this, 500, 700, 700, 1000);
      this.scene.time.delayedCall(1000, () => {
        this.body.stop();
        this.scene.cameras.main.shake(300, 0.001);
        this.releaseShockwaves();
        this.scene.time.delayedCall(this.resetTime, () => {
          this.resetPosition();
        });
      });
    });
  }

  releaseShockwaves() {
    for (let i = 0; i < 360; i++) {
      const proj = new Projectile(this.scene, this.x, this.y, 'shockwave');
      proj.play('shockwave');
      proj.lifespan = 10000;
      proj.shoot(this.x, this.y, i);
      this.scene.shockwavesGroup.add(proj);
    }
  }

  resetPosition() {
    this.resetting = true;
    this.scene.physics.moveTo(this, this.defaultX, this.defaultY, 400, 2000);
    this.scene.time.delayedCall(2000, () => {
      this.body.stop();
      this.angle = 0;
      this.resetting = false;
    });
  }

  punch() {
    console.log(`Tracking player...preparing to punch with ${this.fist}`);
    this.tracking = true;
    this.setTint(0xff0000);
    this.scene.time.delayedCall(this.loadAttack * 3, () => {
      this.tracking = false;
      const targetX = this.player.x;
      const targetY = this.player.y;
      this.scene.physics.moveTo(this, targetX, targetY, 6000, 700);
      this.scene.time.delayedCall(1100, () => {
        this.body.stop();
        this.clearTint();
        this.scene.time.delayedCall(this.resetTime, () => {
          this.resetPosition();
        });
      });
    });
  }

  takeDamage(damage) {
    this.health -= damage;
    console.log(`Remaining health for ${this.fist} hand is ${this.health}`);
    if (this.health <= 0) {
      this.on('animationcomplete-death', () => {
        this.setActive(false);
        this.setVisible(false);
        this.scene.events.emit('rip', { hand: this.fist });
      });
      this.isDead = true;
      this.setVelocityX(0);
      this.setVelocityY(0);
      this.body.enable = false;
      this.play('death', true);
      return;
    }
  }

  attack() {
    if (this.fist === 'left') {
      this.scene.time.delayedCall(1000, () => {
        this.attacking = true;
      });
    } else {
      this.scene.time.delayedCall(3000, () => {
        this.attacking = true;
      });
    }
  }

  update(time, delta) {
    this.player = this.scene.player;
    if (this.tracking) {
      const angle = Phaser.Math.Angle.Between(
        this.x,
        this.y,
        this.player.x,
        this.player.y
      );
      this.angle = angle * Phaser.Math.RAD_TO_DEG;
    }

    if (this.attacking && !this.isDead && !this.resetting) {
      if (time > this.nextAttack) {
        const attack = Math.floor(Math.random() * 101);
        if (attack > 50) {
          if (this.fist === 'left') {
            this.leftHandSmash();
          } else if (this.fist === 'right') {
            this.rightHandSmash();
          }
        } else {
          this.punch();
        }
        this.nextAttack = time + this.attackCD;
      }
    }
  }
}
