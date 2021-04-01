export default function createNPCAnims() {
  this.anims.create({
    key: 'MacRIP',
    frames: this.anims.generateFrameNumbers('mac', {
      start: 80,
      end: 88,
    }),
    frameRate: 7,
    repeat: 0,
  });

  this.anims.create({
    key: 'scaredTutorialNPC',
    frames: this.anims.generateFrameNumbers('tutorialNPC', {
      start: 152,
      end: 152,
    }),
    frameRate: 7,
    repeat: 0,
  });

  this.anims.create({
    key: 'stacyWalk',
    frames: this.anims.generateFrameNumbers('stacy', {
      start: 1,
      end: 3,
    }),
    frameRate: 5,
    repeat: -1,
  });

  this.anims.create({
    key: 'stacyIdle',
    frames: this.anims.generateFrameNumbers('stacy', {
      start: 0,
      end: 0,
    }),
    frameRate: 1,
    repeat: -1,
  });
}
