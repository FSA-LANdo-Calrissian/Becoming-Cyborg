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
      start: 7,
      end: 7,
    }),
    frameRate: 7,
    repeat: -1,
  });
}
