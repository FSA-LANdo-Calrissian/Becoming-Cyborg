import Phaser from 'phaser';

export default {
  type: Phaser.AUTO,
  // parent: null,
  width: 1024,
  height: 768,
  scale: {
    mode: Phaser.Scale.FIT,
    autoCenter: Phaser.Scale.CENTER_BOTH,
  },
  autoRound: false,
  physics: {
    default: 'arcade',
    arcade: { debug: true },
  },
};
