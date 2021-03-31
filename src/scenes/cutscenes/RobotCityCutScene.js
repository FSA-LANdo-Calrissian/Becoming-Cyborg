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

    this.playSceneOne();
  }

  playSceneOne() {
    /*
      First meeting other doctor
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

    // const collider = this.mainScene.physics.add.overlap(
    //   this.doctor,
    //   this.player,
    //   (doc) => {
    //     doc.body.stop();
    //     this.physics.world.removeCollider(collider);
    //   },
    //   null,
    //   this
    // );
    // dialogueHelper.call(this, textLines, nameTextLines);
  }

  endScene() {
    /*
      Helper function to determine what to do next in cutscene
    */
    this.endCutScene();
  }

  endCutScene() {
    this.scene.get('RobotCityScene').events.emit('tutorialEnd');
    this.scene.stop();
  }
}
