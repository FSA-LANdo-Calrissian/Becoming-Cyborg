import Phaser from 'phaser';

export default {
  type: Phaser.AUTO,
  // parent: null,
  width: 800,
  height: 600,
  scale: {
    autoCenter: Phaser.Scale.CENTER_BOTH,
  },
  autoRound: false,
  physics: {
    default: 'arcade',
    arcade: {
      debug: false,
    },
  },
};
