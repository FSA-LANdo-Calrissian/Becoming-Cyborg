export default function () {
  this.anims.create({
    key: 'runLeft',
    frames: this.anims.generateFrameNumbers('player', {
      start: 1,
      end: 3,
    }),
    frameRate: 7,
    repeat: -1,
    yoyo: true,
  });

  this.anims.create({
    key: 'runRight',
    frames: this.anims.generateFrameNumbers('player', {
      start: 10,
      end: 12,
    }),
    frameRate: 7,
    repeat: -1,
    yoyo: true,
  });

  this.anims.create({
    key: 'runUp',
    frames: this.anims.generateFrameNumbers('player', {
      start: 28,
      end: 29,
    }),
    frameRate: 5,
    repeat: -1,
    yoyo: true,
  });

  this.anims.create({
    key: 'runDown',
    frames: this.anims.generateFrameNumbers('player', {
      start: 19,
      end: 21,
    }),
    frameRate: 5,
    repeat: -1,
    yoyo: true,
  });

  this.anims.create({
    key: 'idleRight',
    frames: this.anims.generateFrameNumbers('player', {
      start: 9,
      end: 9,
    }),
    frameRate: 0,
    repeat: 0,
  });

  this.anims.create({
    key: 'idleLeft',
    frames: this.anims.generateFrameNumbers('player', {
      start: 0,
      end: 0,
    }),
    frameRate: 0,
    repeat: 0,
  });

  this.anims.create({
    key: 'punchLeft',
    frames: this.anims.generateFrameNumbers('player', {
      start: 22,
      end: 25,
    }),
    frameRate: 20,
    repeat: -1,
    yoyo: true,
  });

  this.anims.create({
    key: 'punchRight',
    frames: this.anims.generateFrameNumbers('player', {
      start: 31,
      end: 34,
    }),
    frameRate: 20,
    repeat: -1,
    yoyo: true,
  });

  this.anims.create({
    key: 'enemyRunLeft',
    frames: this.anims.generateFrameNumbers('enemy', {
      start: 9,
      end: 11,
    }),
    frameRate: 7,
    repeat: -1,
    yoyo: true,
  });

  this.anims.create({
    key: 'enemyRunRight',
    frames: this.anims.generateFrameNumbers('enemy', {
      start: 3,
      end: 5,
    }),
    frameRate: 7,
    repeat: -1,
    yoyo: true,
  });

  this.anims.create({
    key: 'enemyRunUp',
    frames: this.anims.generateFrameNumbers('enemy', {
      start: 6,
      end: 8,
    }),
    frameRate: 5,
    repeat: -1,
    yoyo: true,
  });

  this.anims.create({
    key: 'enemyRunDown',
    frames: this.anims.generateFrameNumbers('enemy', {
      start: 0,
      end: 2,
    }),
    frameRate: 5,
    repeat: -1,
    yoyo: true,
  });

  this.anims.create({
    key: 'enemyIdleRight',
    frames: this.anims.generateFrameNumbers('enemy', {
      start: 4,
      end: 4,
    }),
    frameRate: 0,
    repeat: 0,
  });

  this.anims.create({
    key: 'enemyPunchLeft',
    frames: this.anims.generateFrameNumbers('enemyPunch', {
      start: 9,
      end: 11,
    }),
    frameRate: 2,
    repeat: -1,
    yoyo: true,
  });

  this.anims.create({
    key: 'enemyPunchRight',
    frames: this.anims.generateFrameNumbers('enemyPunch', {
      start: 3,
      end: 5,
    }),
    frameRate: 2,
    repeat: -1,
    yoyo: true,
  });

  this.anims.create({
    key: 'enemyPunchUp',
    frames: this.anims.generateFrameNumbers('enemyPunch', {
      start: 6,
      end: 8,
    }),
    frameRate: 2,
    repeat: -1,
    yoyo: true,
  });

  this.anims.create({
    key: 'enemyPunchDown',
    frames: this.anims.generateFrameNumbers('enemyPunch', {
      start: 0,
      end: 2,
    }),
    frameRate: 2,
    repeat: -1,
    yoyo: true,
  });
}
