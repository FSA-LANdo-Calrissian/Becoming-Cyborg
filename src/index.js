import Phaser from 'phaser';
import config from './config/config';
import BgScene from './scenes/BgScene';
import FgScene from './scenes/FgScene';
import MainScene from './scenes/MainScene';

class Game extends Phaser.Game {
  constructor() {
    super(config);

    // Import all the scenes and call it here
    this.scene.add('BgScene', BgScene);
    this.scene.add('FgScene', FgScene);
    this.scene.add('MainScene', MainScene);

    // Then start the game by calling the main scene - or the very first one
    this.scene.start('MainScene');
  }
}

// This loads up our game when the browser window loads.
window.onload = function () {
  window.game = new Game();
};
