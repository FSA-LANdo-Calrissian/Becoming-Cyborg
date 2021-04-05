import Phaser from 'phaser';
import Projectile from './Projectile';
import Enemy from './Enemy';

export default class Boss extends Phaser.Physics.Arcade.Sprite {
  constructor(scene, x, y, spriteKey) {
    super(scene, x, y, spriteKey);
    this.scene = scene;
    this.scene.physics.world.enable(this);
    this.defaultX = x;
    this.defaultY = y;
    this.fist =
      spriteKey === 'boss'
        ? 'body'
        : spriteKey === 'bossfistleft'
        ? 'left'
        : 'right';
    this.scene.add.existing(this);
    this.body.setAllowGravity(false);
    this.damage = 8;
    this.isDead = false;
    this.fightStarted = false;
    this.attackCD = 10000;
    this.nextAttack = 0;
    this.preppingAttack = false;
    this.resetting = false;
    this.loadAttack = 1000;
    this.firingLaser = false;
    this.turnRate = 12 / 1000;
    this.resetTime = 3000;
    this.tracking = false;
    this.bossAttacks = false;
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

  // Left hand skill
  leftHandSmash() {
    console.log(`Left hand preparing to smash...`);
    const target = this.scene.add.sprite(925, 700, 'target').setScale(0.3);

    const angle = Phaser.Math.Angle.Between(this.x, this.y, 925, 700);
    this.angle = angle * Phaser.Math.RAD_TO_DEG;

    this.scene.time.delayedCall(this.loadAttack, () => {
      if (!this.scene.dialogueInProgress) {
        this.scene.physics.moveTo(this, 925, 700, 700, 1000);
        this.scene.time.delayedCall(1000, () => {
          target.destroy();
          this.body.stop();
          this.scene.cameras.main.shake(300, 0.006);
          this.releaseShockwaves();
          this.scene.time.delayedCall(this.resetTime, () => {
            this.resetPosition();
          });
        });
      }
    });
  }

  // Right hand version
  rightHandSmash() {
    console.log(`Right hand preparing to smash...`);
    const target = this.scene.add.sprite(500, 700, 'target').setScale(0.3);

    const angle = Phaser.Math.Angle.Between(this.x, this.y, 500, 700);
    this.angle = angle * Phaser.Math.RAD_TO_DEG;

    this.scene.time.delayedCall(this.loadAttack, () => {
      if (!this.scene.dialogueInProgress) {
        this.scene.physics.moveTo(this, 500, 700, 700, 1000);
        this.scene.time.delayedCall(1000, () => {
          this.body.stop();
          target.destroy();
          this.scene.cameras.main.shake(300, 0.006);
          this.releaseShockwaves();
          this.scene.time.delayedCall(this.resetTime, () => {
            this.resetPosition();
          });
        });
      }
    });
  }

  // Helper function for smash skills
  releaseShockwaves() {
    for (let i = 0; i < 360; i++) {
      const proj = new Projectile(this.scene, this.x, this.y, 'shockwave');
      proj.play('shockwave');
      proj.damage = 15;
      proj.lifespan = 10000;
      proj.shoot(this.x, this.y, i);
      this.scene.shockwavesGroup.add(proj);
    }
  }

  // Resets fist positioning
  resetPosition() {
    this.resetting = true;
    this.scene.physics.moveTo(this, this.defaultX, this.defaultY, 400, 2000);
    this.scene.time.delayedCall(2000, () => {
      this.body.stop();
      this.angle = 0;
      this.resetting = false;
      this.preppingAttack = false;
    });
  }

  // Rocket punch
  punch() {
    console.log(`Tracking player...preparing to punch with ${this.fist}`);
    this.tracking = true;
    this.setTint(0xff0000);
    this.scene.time.delayedCall(this.loadAttack * 3, () => {
      if (!this.scene.dialogueInProgress) {
        this.tracking = false;
        const targetX = this.player.x;
        const targetY = this.player.y;
        this.scene.physics.moveTo(this, targetX, targetY, 5500, 700);
        this.scene.time.delayedCall(925, () => {
          this.body.stop();
          this.clearTint();
          this.scene.time.delayedCall(this.resetTime, () => {
            this.resetPosition();
          });
        });
      }
    });
  }

  trackPlayer(player) {
    if (this.target) {
      this.target.destroy();
    }
    this.target = this.scene.add
      .sprite(this.player.x, this.player.y, 'target')
      .setScale(0.05);
  }

  // Damage logic
  takeDamage(damage, leftHp, rightHp, bodyHp) {
    this.health -= damage;

    let newHealth;
    if (this.fist === 'left') {
      newHealth = this.health + rightHp + bodyHp;
    } else if (this.fist === 'right') {
      newHealth = this.health + leftHp + bodyHp;
    } else if (this.fist === 'body') {
      newHealth = this.health;
    }

    this.scene.events.emit('bossDamaged', newHealth, 10000);

    if (this.health <= 0) {
      this.health = 0;
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

  // Initiate attacking
  attack() {
    if (this.fist === 'left') {
      this.scene.time.delayedCall(1000, () => {
        this.fightStarted = true;
      });
    } else if (this.fist === 'right') {
      this.scene.time.delayedCall(3000, () => {
        this.fightStarted = true;
      });
    } else if (this.fist === 'boss') {
      this.bossAttacks = true;
    }
  }

  // Main body skills
  callBackup() {
    console.log(`Reinforcements called`);
    for (let i = 0; i <= 5; i++) {
      const maxVal = 250;
      const minVal = -250;
      const randX = Math.random() * (maxVal - minVal + 1) + minVal;
      const randY = Math.random() * (maxVal - minVal + 1) + minVal;
      const backup = new Enemy(
        this.scene,
        this.scene.player.x + randX,
        this.scene.player.y + randY,
        'meleeRobot',
        'robot'
      ).setSize(27, 30);
      backup.health = 100;
      this.scene.enemiesGroup.add(backup);
    }
  }

  spawnPillars() {
    console.log(`Fire!!!`);
    for (let i = 0; i <= 5; i++) {
      const maxVal = 150;
      const minVal = -150;
      const randX = Math.random() * (maxVal - minVal + 1) + minVal;
      const randY = Math.random() * (maxVal - minVal + 1) + minVal;
      const pillar = new Enemy(
        this.scene,
        this.scene.player.x + randX,
        this.scene.player.y + randY,
        'firePillar',
        'robot'
      )
        .setScale(0.2)
        .setSize(60, 180);

      pillar.health = Infinity;
      pillar.isDead = true;
      this.scene.time.delayedCall(5000, () => {
        this.scene.enemiesGroup.add(pillar);
        pillar.play('firePillar', true);
        this.scene.time.delayedCall(20000, () => {
          pillar.destroy();
        });
      });
    }
  }

  // laser() {
  //   this.firingLaser = true;
  //   this.laser = this.scene.add
  //     .sprite(this.x - 10, this.y + 50, 'laser')
  //     .setScale(3, 1)
  //     .setOrigin(0.05, 0.5);
  //   this.scene.physics.world.enable(this.laser);
  //   this.laser.angle = 90;
  // }

  updateLaser(i) {
    // If player to left of boss
    if (this.scene.player.x < this.x) {
      this.laser.angle += i;
    } else {
      this.laser.angle -= i;
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
      this.trackPlayer(this.player);
    } else {
      if (this.target) this.target.destroy();
    }

    // if (this.firingLaser) {
    //   const addedAngle = delta * this.turnRate;
    //   this.updateLaser(addedAngle);
    // }

    if (this.scene.dialogueInProgress && this.target) {
      this.target.destroy();
    }

    if (this.bossAttacks) {
      if (time > this.nextAttack) {
        const attack = Math.floor(Math.random() * 101);
        if (attack > 80) {
          console.log(`Calling for backup`);
          this.callBackup();
        } else {
          console.log(`Making fire!`);
          this.spawnPillars();
        }
        this.nextAttack = time + this.attackCD;
      }
    }

    if (
      this.fightStarted &&
      !this.isDead &&
      !this.resetting &&
      !this.preppingAttack &&
      !this.scene.dialogueInProgress
    ) {
      if (time > this.nextAttack) {
        const attack = Math.floor(Math.random() * 101);
        this.preppingAttack = true;
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
