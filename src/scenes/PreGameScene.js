import Phaser from 'phaser';

export default class PreGameScene extends Phaser.Scene {
  constructor() {
    super('PreGameScene');
    this.introText = [
      '...',
      '...',
      "Don't you die on me.",
      'Not again.',
      '...',
      'Aaaaaand that should do it.',
      'How are you feeling? Do you know who I am?',
      'Oh... I see...',
      "I'm your father.",
      'You were just dead.',
      'I brought you back using... uh... "spare" robot parts.',
      "I wish you could recover more, but we're running out of time.",
      "You need to deliver these notes to the robot's leader.",
      "If you don't, we'll be dead before the end of the week.",
      "I'd go, but I'm confined to this damn wheelechair as you can see.",
      "I don't know how to get there, but there is a town near here.",
      'Go there and ask the robots for directions.',
      "I'm sure nothing could go wrong.",
      'Oh by the way, the robots are our overlords.',
    ];
    this.textIdx = 0;
    this.typewriteTextWrapped.bind(this);
    this.typewriteText.bind(this);
    this.startMainScene.bind(this);
    this.activateMainScene = true;
  }
  // preload() {
  //   this.load.image('apocalypse', 'assets/backgrounds/apocalypse.png');
  //   this.load.image('forest', 'assets/backgrounds/forest.png');
  //   this.load.image('bigBlast', 'assets/sprites/bigBlast.png');
  //   this.load.tilemapTiledJSON('map', 'assets/backgrounds/robot-test-map.json');
  //   this.load.spritesheet('player', 'assets/sprites/cyborg.png', {
  //     frameWidth: 47,
  //     frameHeight: 50,
  //   });
  //   this.load.spritesheet('enemy', 'assets/sprites/Walk.png', {
  //     frameWidth: 46,
  //     frameHeight: 48,
  //   });
  //   this.load.spritesheet('enemyPunch', 'assets/sprites/Punch_RightHand.png', {
  //     frameWidth: 48,
  //     frameHeight: 48,
  //   });
  //   this.load.audio('gg', 'assets/audio/SadTrombone.mp3');
  //   this.load.image('textBox', 'assets/sprites/PngItem_5053532.png');
  //   this.load.image('upgrade', 'assets/backgrounds/upgrade.jpg');
  // }
  create() {
    this.intro = this.add
      .text(400, 300, '')
      .setOrigin(0.5)
      .setWordWrapWidth(700);
    this.typewriteTextWrapped(this.introText[this.textIdx]);
  }
  startMainScene() {
    console.log('HIT');
    this.cameras.main.fadeOut(2000, 0, 0, 0, () => {
      this.cameras.main.on(
        'camerafadeoutcomplete',
        () => {
          this.scene.start('MainScene');
        },
        this
      );
    });
  }
  typewriteText(text) {
    const length = text.length;
    let i = 0;
    this.time.addEvent({
      callback: () => {
        this.intro.text += text[i];
        ++i;
        if (i === length && this.textIdx !== this.introText.length - 1) {
          this.time.delayedCall(
            1000,
            () => {
              this.intro.text = '';
              this.typewriteTextWrapped(this.introText[++this.textIdx]);
            },
            null,
            this
          );
        } else if (this.textIdx === this.introText.length - 1) {
          if (this.activateMainScene) {
            this.startMainScene();
            this.activateMainScene = false;
          }
        }
      },
      repeat: length - 1,
      delay: 100,
    });
  }
  typewriteTextWrapped(text) {
    const lines = this.intro.getWrappedText(text);
    const wrappedText = lines.join('\n');

    this.typewriteText(wrappedText);
  }
  update() {}
}
