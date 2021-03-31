import Phaser from 'phaser';
import { dialogueHelper } from './cutscenes';

export default class RobotCityCutScene extends Phaser.Scene {
  constructor() {
    super('RobotCityCutScene');
  }
  create({ player, camera, doctor }) {
    console.log(player);
    this.player = player;
    this.camera = camera;
    this.doctor = doctor;
    this.mainScene = this.scene.get('RobotCityScene');
    this.sceneTwo = false;

    this.playSceneOne();
  }

  playSceneOne() {
    /*
      First meeting other doctor/Stacy
    */
    const textLines = [
      "Hey!!! Where do you think you're going?!",
      "Don't you know the city is crawling with robots?!",
    ];

    const nameTextLines = ['Stacy', 'Stacy'];

    this.time.delayedCall(
      1000,
      () => {
        this.doctor.play('stacyWalk', true);
        this.mainScene.physics.moveTo(
          this.doctor,
          this.player.x + 25,
          this.player.y,
          30,
          2000
        );
        this.time.delayedCall(
          2000,
          () => {
            this.doctor.body.stop();
            this.doctor.play('stacyIdle', true);
            dialogueHelper.call(this, textLines, nameTextLines);
          },
          null,
          this
        );
      },
      null,
      this
    );
    this.mainScene.initTutorial = true;
  }

  playSceneTwo() {
    /*
      Panning up to city then cutting back
    */
    this.sceneTwo = true;
    this.camera = this.mainScene.cameras.main;
    this.camera.stopFollow();

    const currX = this.camera.scrollX;
    const currY = this.camera.scrollY;

    this.camera.setZoom(2);
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

  endScene() {
    /*
      Helper function to determine what to do next in cutscene
    */
    if (this.mainScene.initTutorial && !this.sceneTwo) {
      this.playSceneTwo();
    } else if (this.sceneTwo) {
      this.endCutScene();
    }
  }

  endCutScene() {
    this.scene.get('RobotCityScene').events.emit('tutorialEnd');
    this.scene.stop();
  }
}
