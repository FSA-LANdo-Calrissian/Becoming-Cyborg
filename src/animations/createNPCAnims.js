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
}
