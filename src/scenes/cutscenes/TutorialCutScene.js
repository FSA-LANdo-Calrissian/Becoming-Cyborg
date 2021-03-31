import Phaser from 'phaser';
import { dialogueHelper } from './cutscenes';

export default class TutorialCutScene extends Phaser.Scene {
  constructor() {
    super('TutorialCutScene');
    this.sceneOne = false;
    this.sceneTwo = false;
    this.sceneThree = false;
    this.finalScene = false;
    this.finalPart1 = false;
    this.finalPart2 = false;
  }

  endScene() {
    /*
      Helper function to determine what to do next in cutscene
    */
    // If we're not in the final scene, play the first scene
    if (!this.finalScene) {
      // If scene one is done playing, start scene 2
      if (this.sceneOne && !this.sceneTwo) {
        this.enemy.play('tutorial1', true);
        this.playSceneTwo();
        this.time.delayedCall(1000, () => {
          this.deadNPC.flipX = !this.deadNPC.flipX;
          this.deadNPC.play('MacRIP');
        });
        this.time.delayedCall(2000, () => {
          this.enemy.play('tutorial2', false);
        });
        // If scene 2 done, start 3
      } else if (this.sceneTwo && !this.sceneThree) {
        this.enemy.play(
          this.enemy.x - this.player.x > 0
            ? 'meleeRobotIdleLeft'
            : 'meleeRobotIdleRight'
        );
        this.events.emit('tutorialPause');
        this.playSceneThree();
        // If scene 3 done, end cutscene.
      } else if (this.sceneThree) {
        this.endCutScene();
      }
    } else {
      // Else play final scene logic here
      if (this.finalPart1 && !this.finalPart2) {
        this.playFinalScenePart2();
      } else if (this.finalPart2) {
        this.endCutScene();
      }
    }
  }

  playSceneOne() {
    /*
      Scene before the killing
    */

    const textLines = [
      "Human, you've been found guilty of scratching my metallic hull",
      'I will now sentence you to death',
      'Any last words?',
      "It was an accident, please! I'll be careful next time!",
      'Weird choice of final words. Die, human',
    ];

    const nameTextLines = [
      'Mr. Robot',
      'Mr. Robot',
      'Mr. Robot',
      'Mac',
      'Mr. Robot',
    ];

    dialogueHelper.call(this, 0, textLines, nameTextLines);

    this.sceneOne = true;
  }

  playSceneTwo() {
    /*
      Post killing scene
    */

    const textLines = [
      'AaaAaArRRggGGggGhHhHHh',
      '...',
      "You, human. You're guilty of not stopping him from scratching my beautiful metal. ",
      'You will also perish once my laser cools down',
      'Any last words?',
      '...',
    ];

    const nameTextLines = [
      'Mac',
      'Mr. Robot',
      'Mr. Robot',
      'Mr. Robot',
      'Mr. Robot',
      'Dr. Dang',
    ];

    dialogueHelper.call(this, 0, textLines, nameTextLines);

    this.sceneTwo = true;
  }

  playSceneThree() {
    /*
      Tutorial dialogue. Contains the logic to advance through the dialogue on player clicking on the text.
      Can increase the click area by changing the setInteractive rectangle width/height.
      No params.
      Returns null.
    */

    // Lines to display in conversation.
    const textLines = [
      'Halt human, stop right there!',
      'Name...?',
      'ID..?',
      '...',
      '"Just looking for directions" is not a valid response....',
      'What is that you are wearing human....?',
      'Please stand still as you are being scanned.....',
      'Scan Complete....',
      'Illegal Activity Detected...',
      'Where did you get these parts, human...?',
      'Come with me human you are being detained for questioning.....',
      'Please do not resist....',
    ];

    const nameTextLines = Array(textLines.length).fill('Mr. Robot');

    dialogueHelper.call(this, 0, textLines, nameTextLines);

    this.scene.get('FgScene').finishedTutorial = true;
    this.sceneThree = true;
  }

  playFinalScenePart1() {
    // Lines to display in conversation.
    const textLines = [
      'Y-y-you killed it??',
      'How did you manage to do that?!',
      "You don't know?",
      '...',
      'You have a metal arm? That is awesome, dude!',
      'I guess you really came at him with an entire ARMy',
      '...',
      '...',
      '*Ahem*',
      'Why did you decide to help us?',
      'You need to deliver a letter to the robot king?',
      "I don't think the robots will take kindly to you",
      '...wearing them...',
      'You woke up like that?',
      'I see. Well, I am Doctor Dang. I think I can help you',
      'Come, follow me.',
    ];

    this.events.emit('TutorialCutScene');
    const nameTextLines = Array(textLines.length).fill('Dr. Dang');

    generateDialogueUI.call(this, textLines, nameTextLines);

    // Add click area to advance text. Change the numbers after
    // the dialogueText width/height in order to increase click
    // area.
    advanceDialogue.call(
      this,
      0,
      this.textLines,
      this.textBox,
      this.nameText,
      this.nameTextLines,
      this.dialogueText
    );

    this.finalPart1 = true;
  }

  playFinalScenePart2() {
    this.camera.fadeOut(1000);
    this.player.setPosition(348, 275);
    this.doctor.setPosition(365, 276);
    this.camera.fadeIn(2000);

    const textLines = [
      'My house!!!!',
      'Well, my modification machine is still in tact, at least...',
      '...sigh. Anyway, this is a machine of my own creation',
      "It's meant to upgrade our human capabilities so that we can become stronger.",
      '...however, using it on a human seems to add too much stress to the body that they end up dying...',
      "...you should be fine, though because you're part robot...probably.",
      '...I hope',
      'Just step onto the platform and you should see a display come up',
      'From here, you can choose which stats you want to upgrade',
      'And after you\'re done, you can return with the "Go Back" button.',
      "And that's it! Simple, right? Try it out.",
      "After you're done, follow the road. It'll take you to the robot king",
    ];

    const nameTextLines = Array(textLines.length).fill('Dr. Dang');

    this.time.delayedCall(3000, () => {
      generateDialogueUI.call(this, textLines, nameTextLines);

      advanceDialogue.call(
        this,
        0,
        this.textLines,
        this.textBox,
        this.nameText,
        this.nameTextLines,
        this.dialogueText
      );
    });

    this.finalPart2 = true;
  }

  endCutScene() {
    this.scene.get('FgScene').events.emit('tutorialEnd');
    this.scene.stop();
  }

  create({ player, enemy, camera, deadNPC, finalScene, doctor }) {
    this.player = player;
    this.enemy = enemy;
    this.deadNPC = deadNPC;
    this.camera = camera;
    this.finalScene = finalScene || false;
    this.doctor = doctor;

    // const mainGame = this.scene.get('FgScene');

    this.cursors = this.input.keyboard.addKeys({
      cont: Phaser.Input.Keyboard.KeyCodes.SPACE,
    });
    if (!this.finalScene) {
      this.playSceneOne();
    } else {
      this.playFinalScenePart1();
    }
  }
}
