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

  create() {
    this.intro = this.add
      .text(400, 300, '')
      .setOrigin(0.5)
      .setWordWrapWidth(700);
    this.typewriteTextWrapped(this.introText[this.textIdx]);
  }

  startMainScene() {
    /*
      Starts the main scene after all intro text has been displayed.
    */
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
    /*
      Displays text onto the screen
      param text: string -> text to display
      returns null
    */

    const length = text.length;
    let i = 0;

    this.time.addEvent({
      callback: () => {
        /*
          Types out intro message letter by letter then starts MainScene
        */
        //adding one letter at a time
        this.intro.text += text[i];
        ++i;
        //if end of sentence, move to next sentence and repeat
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
          //if no more sentences, start MainScene
        } else if (this.textIdx === this.introText.length - 1) {
          if (this.activateMainScene) {
            this.time.delayedCall(
              5000,
              () => this.startMainScene(),
              null,
              this
            );
            this.activateMainScene = false;
          }
        }
      },
      repeat: length - 1,
      delay: 100,
    });
  }

  typewriteTextWrapped(text) {
    /*
      Helper function for text that might be too long and ends up wrapping
      param text: string -> the full text.
      returns null
    */

    // Grab the whole text (returns an array of lines based on wrapping logic)
    const lines = this.intro.getWrappedText(text);
    // Combines them into one screen
    const wrappedText = lines.join('\n');
    // Displays text
    this.typewriteText(wrappedText);
  }

  update() {}
}
