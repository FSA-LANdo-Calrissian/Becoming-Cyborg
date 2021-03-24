export default function createWorldAnims() {
  //upgrade station animations
  this.anims.create({
    key: 'upgradeStationAnim',
    frames: this.anims.generateFrameNumbers('upgradeStation', {
      start: 0,
      end: 15,
    }),
    frameRate: 6,
    yoyo: true,
    repeat: 0,
  });
}
