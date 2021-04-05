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
      start: 13,
      end: 15,
    }),
    frameRate: 7,
    repeat: -1,
    yoyo: true,
  });
  this.anims.create({
    key: 'runUp',
    frames: this.anims.generateFrameNumbers('player', {
      start: 20,
      end: 21,
    }),
    frameRate: 5,
    repeat: -1,
    yoyo: true,
  });
  this.anims.create({
    key: 'runDown',
    frames: this.anims.generateFrameNumbers('player', {
      start: 8,
      end: 9,
    }),
    frameRate: 5,
    repeat: -1,
    yoyo: true,
  });
  this.anims.create({
    key: 'idleRight',
    frames: this.anims.generateFrameNumbers('player', {
      start: 12,
      end: 12,
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
    frames: [
      { key: 'player', frame: 35, duration: 3 },
      { key: 'player', frame: 34, duration: 3 },
      { key: 'player', frame: 33, duration: 8 },
      { key: 'player', frame: 34, duration: 3 },
      { key: 'player', frame: 35, duration: 3 },
    ],
    frameRate: 10,
    repeat: 0,
  });
  this.anims.create({
    key: 'punchRight',
    frames: [
      { key: 'player', frame: 47, duration: 3 },
      { key: 'player', frame: 46, duration: 3 },
      { key: 'player', frame: 45, duration: 8 },
      { key: 'player', frame: 46, duration: 3 },
      { key: 'player', frame: 47, duration: 3 },
    ],
    frameRate: 10,
    repeat: 0,
  });
  this.anims.create({
    key: 'knifeLeft',
    frames: [
      { key: 'player', frame: 96, duration: 5 },
      { key: 'player', frame: 34, duration: 5 },
      { key: 'player', frame: 100, duration: 5 },
    ],
    frameRate: 10,
    repeat: 0,
  });
  this.anims.create({
    key: 'knifeRight',
    frames: [
      { key: 'player', frame: 108, duration: 5 },
      { key: 'player', frame: 46, duration: 5 },
      { key: 'player', frame: 112, duration: 5 },
    ],
    frameRate: 10,
    repeat: 0,
  });
}
