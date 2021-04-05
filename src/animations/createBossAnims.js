export default function () {
  this.anims.create({
    key: 'attack',
    frames: this.anims.generateFrameNumbers('bossattack', {
      start: 0,
      end: 7,
    }),
    frameRate: 7,
    repeat: 0,
  });

  this.anims.create({
    key: 'unarmed',
    frames: this.anims.generateFrameNumbers('bossattack', {
      start: 1,
      end: 5,
    }),
  });

  this.anims.create({
    key: 'rightHand',
    frames: this.anims.generateFrameNumbers('bossfistright', {
      start: 0,
      end: 5,
    }),
    repeat: -1,
  });

  this.anims.create({
    key: 'leftHand',
    frames: this.anims.generateFrameNumbers('bossfistleft', {
      start: 0,
      end: 5,
    }),
    repeat: -1,
  });

  this.anims.create({
    key: 'shockwave',
    frames: this.anims.generateFrameNumbers('shockwave', { start: 0, end: 3 }),
    frameRate: 7,
    repeat: -1,
    yoyo: true,
  });

  this.anims.create({
    key: 'firePillar',
    frames: this.anims.generateFrameNumbers('firePillar', {
      start: 1,
      end: 3,
    }),
    frameRate: 7,
    repeat: -1,
    yoyo: true,
  });
}
