import Phaser from 'phaser';
import config from './config/config';
import FgScene from './scenes/FgScene';
import MainScene from './scenes/MainScene';
import PreGameScene from './scenes/PreGameScene';
import HUDScene from './scenes/HUDScene';
import GameOverScene from './scenes/GameOverScene';
import UpgradeUI from './scenes/UpgradeUI';
import TitleScene from './scenes/TitleScene';
import TutorialCutScene from './scenes/cutscenes/TutorialCutScene';
import Dialogue from './scenes/dialogue/dialogue';
import Inventory from './scenes/Inventory';
import testQuest from './scenes/dialogue/testQuest';
import secondTestQuest from './scenes/dialogue/secondTestQuest';
import BossScene from './scenes/BossScene';
import RobotCityScene from './scenes/RobotCityScene';
import RobotCityCutScene from './scenes/cutscenes/RobotCityCutScene';
import stacyQuest from './scenes/dialogue/stacyQuest';

export default class Game extends Phaser.Game {
  constructor() {
    super(config);

    // Import all the scenes and call it here

    this.scene.add('TitleScene', TitleScene);
    this.scene.add('PreGameScene', PreGameScene);
    this.scene.add('RobotCityScene', RobotCityScene);
    this.scene.add('stacyQuest', stacyQuest);
    this.scene.add('FgScene', FgScene);
    this.scene.add('BossScene', BossScene);
    this.scene.add('MainScene', MainScene);
    this.scene.add('TutorialCutScene', TutorialCutScene);
    this.scene.add('RobotCityCutScene', RobotCityCutScene);
    this.scene.add('Dialogue', Dialogue);
    this.scene.add('HUDScene', HUDScene);
    this.scene.add('UpgradeUI', UpgradeUI);
    this.scene.add('GameOver', GameOverScene);
    this.scene.add('Inventory', Inventory);
    this.scene.add('testQuest', testQuest);
    this.scene.add('secondTestQuest', secondTestQuest);
    this.scene.bringToTop('HUDScene');

    // Then start the game by calling the main scene - or the very first one
    this.scene.start('TitleScene');
  }
}

// This loads up our game when the browser window loads.
window.onload = function () {
  window.game = new Game();
};
