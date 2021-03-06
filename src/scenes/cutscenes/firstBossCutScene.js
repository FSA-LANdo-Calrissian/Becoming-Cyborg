import Phaser from 'phaser';
import { dialogueHelper } from './cutscenes';

export default class firstBossCutScene extends Phaser.Scene {
  constructor() {
    super('firstBossCutScene');
    this.firstDialoguePlayed = false;
    this.secondDialoguePlayed = false;
    this.thirdDialoguePlayed = false;
  }

  firstDialogue() {
    const textLines = [
      'Who are you to disturb my hibernation?',
      'I detect organic material...but also robotic.',
      'It seems like you have been gearing yourself up with',
      'my robots. And you have the gall to show yourself to me?',
      'Give me a reason to not smite you where you stand.',
      'Letters, you say?',
      'Ah, I see. You are the binary clone of the old man in that town.',
      'Your name was....',
      '...Roberto, if I recall',
      'Hand me those letters, Roberto.',
      'Domo arigato, Mr. Roberto.',
      'Why are you here in place of your father?',
      "He told you to come? You've lost your memory?",
      'I see.',
      'Well, you look like a capable young human.',
      "How about you take your father's place for me?",
      "You don't know?",
      'He infiltrated the human rebel camp just south of here',
      'and passes me notes on their plans.',
      'They have good defenses against my kind.',
      'Our pen tests have all come back inconclusive.',
      'If you were to infiltrate them and tell me what they are up to',
      'I will leave your village in peace.',
      'You refuse?',
      'Then die like all the other fools who come here.',
    ];

    const nameTextLines = Array(textLines.length).fill('Robot King');

    dialogueHelper.call(this, textLines, nameTextLines);
    this.firstDialoguePlayed = true;
  }

  secondDialogue() {
    const textLines = [
      'H-how were you able to destroy one of my hands??',
      "It looks like I can't underestimate you",
    ];

    const nameTextLines = Array(textLines.length).fill('Robot King');

    dialogueHelper.call(this, textLines, nameTextLines);
    this.secondDialoguePlayed = true;
  }

  thirdDialogue() {
    const textLines = [
      'My hands!!',
      "You're better than you look",
      "But now here's my final form",
    ];

    const nameTextLines = Array(textLines.length).fill('Robot King');

    dialogueHelper.call(this, textLines, nameTextLines);
    this.thirdDialoguePlayed = true;
  }

  finalDialogue() {
    const textLines = [
      'Noooo!!',
      'How could I lose to a human?!',
      "You haven't seen the last of me!!",
    ];

    const nameTextLines = Array(textLines.length).fill('Robot King');

    dialogueHelper.call(this, textLines, nameTextLines);
  }

  gameEnd() {
    const bossScene = this.scene.get('BossScene');
    bossScene.cameras.main.fadeOut(1000);
    this.scene.get('HUDScene').scene.stop();
    let end;
    bossScene.cameras.main.on('camerafadeoutcomplete', () => {
      bossScene.scene.stop();
      end = this.add.image(
        this.cameras.main.midPoint.x,
        this.cameras.main.midPoint.y,
        'end'
      );

      this.time.delayedCall(4000, () => {
        end.destroy();
        this.add.image(
          this.cameras.main.midPoint.x,
          this.cameras.main.midPoint.y,
          'ty'
        );
      });
    });
  }

  endScene() {
    if (this.end) {
      this.gameEnd();
    } else {
      if (this.handsKilled === 0) {
        console.log(`Starting fight...`);
        this.scene.get('BossScene').events.emit('startFight');
      } else if (this.handsKilled === 2) {
        console.log(`Starting boss....`);
        this.scene.get('BossScene').events.emit('startBoss');
      }
      this.endCutScene();
    }
  }

  endCutScene() {
    this.scene.get('BossScene').events.emit('dialogueEnd');
    this.scene.stop();
  }

  create({ npc, player, data }) {
    this.handsKilled = this.scene.get('BossScene').handsKilled;
    this.boss = npc;
    this.player = player;
    this.end = data.end || false;
    if (this.end) {
      this.finalDialogue();
    } else {
      if (this.handsKilled === 0) {
        this.firstDialogue();
      } else if (this.handsKilled === 1) {
        this.secondDialogue();
      } else {
        this.thirdDialogue();
      }
    }
  }
}
