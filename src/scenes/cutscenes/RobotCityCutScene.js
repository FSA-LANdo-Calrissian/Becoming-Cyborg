import Phaser from 'phaser';
import { dialogueHelper } from './cutscenes';

export default class RobotCityCutScene extends Phaser.Scene {
  constructor() {
    super('RobotCityCutScene');
  }
  create({ player, camera, doctor }) {
    this.player = player;
    this.camera = camera;
    this.doctor = doctor;
    this.mainScene = this.scene.get('RobotCityScene');
    this.sceneOne = false;
    this.sceneTwo = false;
    this.sceneThree = false;
    this.sceneFour = false;
    this.sceneFive = false;

    this.playSceneOne();
  }

  playSceneOne() {
    /*
      First meeting other doctor/Stacy
    */
    this.mainScene.initCutScene = true;
    this.sceneOne = true;
    const textLines = [
      "Hey!!! Where do you think you're going?!",
      "Don't you know the city is crawling with robots?!",
    ];

    const nameTextLines = ['Stacy', 'Stacy'];

    this.time.delayedCall(1000, () => {
      this.doctor.play('stacyWalk', true);
      this.mainScene.physics.moveTo(
        this.doctor,
        this.player.x + 25,
        this.player.y,
        30,
        2000
      );
      this.time.delayedCall(2000, () => {
        this.doctor.body.stop();
        this.doctor.play('stacyIdle', true);
        dialogueHelper.call(this, textLines, nameTextLines);
      });
    });
  }

  playSceneTwo() {
    /*
      Panning up to city then cutting back
    */
    this.sceneTwo = true;
    this.camera = this.mainScene.cameras.main;
    this.camera.stopFollow();

    this.camera.setZoom(1.5);
    this.camera.pan(1168, 832, 4000);
    this.time.delayedCall(5000, () => {
      this.camera.fadeOut(1000);
      this.time.delayedCall(1000, () => {
        this.camera.startFollow(this.player);
        this.camera.setZoom(3);
        this.camera.fadeIn(1000);
        this.time.delayedCall(1000, () => {
          this.endScene();
        });
      });
    });
  }

  playSceneThree() {
    /*
      Stacy giving you lots of backstory and continuing main quest
    */
    this.sceneThree = true;
    const textLines = [
      "Wait a minute, don't I know you?",
      'Yeah, you live in the town to the West!',
      'Remember I always used to come over at night...',
      'to spend some "quality time" with your dad.',
      'But now we just work together.',
      '...',
      'Oh you lost your memories?',
      'And you died and are part robot now?',
      'I thought something looked different about you.',
      'I just saw some robots head your way, what happened?',
      "Oh my God! They destroyed your town!? I'm so sorry.",
      'Did anything else happen?',
      '...',
      "You KILLED one?!? And now you're trying to get to the robot king!?",
      "That's going to be pretty difficult since the robot king's lair...",
      "isn't accessible without a clearance chip programmed into your body.",
      "Normally I'd tell you it's impossible, but I'm desperate right now too.",
      'I need you to kill some robots for me.',
      'Their demands are becoming too aggressive.',
      "They're forcing your dad and me to spy on other humans.",
      "And they said they'll come after us if we don't deliver the reports on time.",
      "I guess that's what happened to your dad.",
      'All of the robots are in Robot City to the North.',
      'To save your dad, me, and the rest of the humans...',
      "you'll have to kill most of the robot hoard in the city.",
      "I'd say 10 should be more than enough.",
      "And if you bring me their clearance chips, I'll be able to make one for you.",
      "But you'll die if you go there with only that knife.",
      'The last group of humans strong enough to hold out against the robots...',
      'that your dad and I have been spying on is located South-East of here.',
      'They sometimes have spare weapon parts.',
      'Go there and get some better weapon attachments.',
      'To get there, follow the street North and make the first right.',
      "When the street ends, you'll see a path that will lead you to the encampment.",
    ];

    const nameTextLines = [
      'Stacy',
      'Stacy',
      'Stacy',
      'Stacy',
      'Stacy',
      'Stacy',
      'Stacy',
      'Stacy',
      'Stacy',
      'Stacy',
      'Stacy',
      'Stacy',
      'Stacy',
      'Stacy',
      'Stacy',
      'Stacy',
      'Stacy',
      'Stacy',
      'Stacy',
      'Stacy',
      'Stacy',
      'Stacy',
      'Stacy',
      'Stacy',
      'Stacy',
      'Stacy',
      'Stacy',
      'Stacy',
      'Stacy',
      'Stacy',
      'Stacy',
      'Stacy',
      'Stacy',
      'Stacy',
    ];

    dialogueHelper.call(this, textLines, nameTextLines);
  }

  playSceneFour() {
    /*
      Panning to path so directions are more clear
    */
    this.sceneFour = true;
    this.camera.stopFollow();

    this.camera.setZoom(2);
    this.camera.pan(1120, 1312, 1500);
    this.time.delayedCall(1600, () => {
      this.camera.pan(1952, 1312, 4000);
      this.time.delayedCall(5000, () => {
        this.camera.fadeOut(1000);
        this.time.delayedCall(1000, () => {
          this.camera.startFollow(this.player);
          this.camera.setZoom(3);
          this.camera.fadeIn(1000);
          this.time.delayedCall(1000, () => {
            this.endScene();
          });
        });
      });
    });
  }

  playSceneFive() {
    /*
      Stacy finishing up the backstory/quest details and ending the cutscene
    */
    this.sceneFive = true;
    const textLines = [
      "Come talk to me again once you've killed the robots.",
      "I'll be waiting by my house just behind me.",
      'And feel free to use the upgrade station outside my house.',
      'Good luck.',
    ];

    const nameTextLines = ['Stacy', 'Stacy', 'Stacy', 'Stacy'];

    dialogueHelper.call(this, textLines, nameTextLines);
  }

  endScene() {
    /*
      Helper function to determine what to do next in cutscene
    */
    if (this.sceneOne && !this.sceneTwo) {
      this.playSceneTwo();
    } else if (this.sceneTwo && !this.sceneThree) {
      this.playSceneThree();
    } else if (this.sceneThree && !this.sceneFour) {
      this.playSceneFour();
    } else if (this.sceneFour && !this.sceneFive) {
      this.playSceneFive();
    } else if (this.sceneFive) {
      this.camera.fadeOut(500);
      this.time.delayedCall(500, () => {
        this.doctor.x = 1184;
        this.doctor.y = 1408;
        this.camera.fadeIn(500);
        this.time.delayedCall(500, () => {
          this.endCutScene();
        });
      });
    }
  }

  endCutScene() {
    this.scene.get('RobotCityScene').events.emit('cutSceneEnd');
    this.scene.stop();
  }
}
