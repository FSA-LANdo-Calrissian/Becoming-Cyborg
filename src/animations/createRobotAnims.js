export default function createRobotAnims() {
  //Melee robot animations
  this.anims.create({
    key: 'meleeRobotRunLeft',
    frames: this.anims.generateFrameNumbers('meleeRobot', {
      start: 9,
      end: 11,
    }),
    frameRate: 7,
    repeat: -1,
    yoyo: true,
  });
  this.anims.create({
    key: 'meleeRobotRunRight',
    frames: this.anims.generateFrameNumbers('meleeRobot', {
      start: 3,
      end: 5,
    }),
    frameRate: 7,
    repeat: -1,
    yoyo: true,
  });
  this.anims.create({
    key: 'meleeRobotRunUp',
    frames: this.anims.generateFrameNumbers('meleeRobot', {
      start: 6,
      end: 8,
    }),
    frameRate: 5,
    repeat: -1,
    yoyo: true,
  });
  this.anims.create({
    key: 'meleeRobotRunDown',
    frames: this.anims.generateFrameNumbers('meleeRobot', {
      start: 0,
      end: 2,
    }),
    frameRate: 5,
    repeat: -1,
    yoyo: true,
  });
  this.anims.create({
    key: 'meleeRobotIdleRight',
    frames: [{ key: 'meleeRobot', frame: 4 }],
  });
  this.anims.create({
    key: 'meleeRobotIdleLeft',
    frames: [{ key: 'meleeRobot', frame: 10 }],
  });
  this.anims.create({
    key: 'meleeRobotAttackLeft',
    frames: this.anims.generateFrameNumbers('meleeRobotAttack', {
      start: 9,
      end: 11,
    }),
    frameRate: 2,
    repeat: -1,
    yoyo: true,
  });
  this.anims.create({
    key: 'meleeRobotAttackRight',
    frames: this.anims.generateFrameNumbers('meleeRobotAttack', {
      start: 3,
      end: 5,
    }),
    frameRate: 2,
    repeat: -1,
    yoyo: true,
  });
  this.anims.create({
    key: 'meleeRobotAttackUp',
    frames: this.anims.generateFrameNumbers('meleeRobotAttack', {
      start: 6,
      end: 8,
    }),
    frameRate: 2,
    repeat: -1,
    yoyo: true,
  });
  this.anims.create({
    key: 'meleeRobotAttackDown',
    frames: this.anims.generateFrameNumbers('meleeRobotAttack', {
      start: 0,
      end: 2,
    }),
    frameRate: 2,
    repeat: -1,
    yoyo: true,
  });
  this.anims.create({
    key: 'tutorial',
    frames: this.anims.generateFrameNumbers('tutorialShoot', {
      start: 19,
      end: 19,
    }),
    frameRate: 0,
  });
  this.anims.create({
    key: 'tutorial1',
    frames: this.anims.generateFrameNumbers('tutorialShoot', {
      start: 15,
      end: 19,
    }),
    frameRate: 4,
    repeat: 5,
  });
  this.anims.create({
    key: 'tutorial2',
    frames: this.anims.generateFrameNumbers('tutorialShoot', {
      start: 4,
      end: 4,
    }),
    frameRate: 4,
    repeat: -1,
  });
  this.anims.create({
    key: 'death',
    frames: this.anims.generateFrameNumbers('explode', {
      start: 0,
      end: 24,
    }),
    frameRate: 50,
    repeat: 0,
  });
}
