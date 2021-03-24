export default function createAnimalAnims() {
  //wolf animations
  this.anims.create({
    key: 'wolfRunLeft',
    frames: this.anims.generateFrameNumbers('wolf', {
      start: 50,
      end: 54,
    }),
    frameRate: 7,
    repeat: -1,
  });
  this.anims.create({
    key: 'wolfRunRight',
    frames: this.anims.generateFrameNumbers('wolf', {
      start: 20,
      end: 24,
    }),
    frameRate: 7,
    repeat: -1,
  });
  this.anims.create({
    key: 'wolfRunUp',
    frames: this.anims.generateFrameNumbers('wolf', {
      start: 35,
      end: 39,
    }),
    frameRate: 7,
    repeat: -1,
  });
  this.anims.create({
    key: 'wolfRunDown',
    frames: this.anims.generateFrameNumbers('wolf', {
      start: 30,
      end: 34,
    }),
    frameRate: 7,
    repeat: -1,
  });
  this.anims.create({
    key: 'wolfIdleRight',
    frames: [{ key: 'wolf', frame: 0 }],
  });
  this.anims.create({
    key: 'wolfAttackLeft',
    frames: this.anims.generateFrameNumbers('wolf', {
      start: 55,
      end: 59,
    }),
    frameRate: 7,
    repeat: -1,
  });
  this.anims.create({
    key: 'wolfAttackRight',
    frames: this.anims.generateFrameNumbers('wolf', {
      start: 25,
      end: 29,
    }),
    frameRate: 7,
    repeat: -1,
  });
  this.anims.create({
    key: 'wolfAttackUp',
    frames: this.anims.generateFrameNumbers('wolf', {
      start: 45,
      end: 49,
    }),
    frameRate: 7,
    repeat: -1,
  });
  this.anims.create({
    key: 'wolfAttackDown',
    frames: this.anims.generateFrameNumbers('wolf', {
      start: 40,
      end: 44,
    }),
    frameRate: 7,
    repeat: -1,
  });
}
