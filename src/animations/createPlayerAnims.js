export default function createPlayerAnims() {
  //player animations
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
      start: 20,
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
      end: 24,
    }),
    frameRate: 20,
    repeat: 0,
    // yoyo: true,
  });
  this.anims.create({
    key: 'punchRight',
    frames: this.anims.generateFrameNumbers('player', {
      start: 31,
      end: 33,
    }),
    frameRate: 20,
    repeat: 0,
    // yoyo: true,
  });
}
