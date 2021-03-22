import Phaser from 'phaser';

export default class HUDScene extends Phaser.Scene {
  constructor() {
    super('HUDScene');

    this.size = {
      width: 150,
      height: 10,
    };
  }

  draw(newHealth, maxHealth) {
    const x = 10;
    const y = 10;
    // First we clear the old bar - so that we can draw the new/updated one
    this.bar.clear();
    const { width, height } = this.size;
    const margin = 2;

    // Black border around hp bar
    this.bar.fillStyle(0x000000);
    this.bar.fillRect(x, y, width + margin, height + margin);

    // White beneath the hp bar
    this.bar.fillStyle(0xffffff);
    this.bar.fillRect(x + margin, y + margin, width - margin, height - margin);

    // This makes it so the health bar goes with the camera instead of staying in that spot of the world.
    this.bar.setScrollFactor(0, 0);

    // How much of the hp bar to deplete on damage
    const pixelPerHealth = this.size.width / maxHealth;

    // How much of the bar to fill up
    const healthWidth = Math.floor(newHealth * pixelPerHealth);

    // Bar colors based on health %
    if (healthWidth <= width / 4) {
      this.bar.fillStyle(0xff0000);
    } else if (healthWidth <= width / 2) {
      this.bar.fillStyle(0xfee12b);
    } else {
      this.bar.fillStyle(0x00ff00);
    }

    // Logic for if we have <= 0 health
    if (healthWidth > 0) {
      this.bar.fillRect(
        x + margin,
        y + margin,
        healthWidth - margin,
        height - margin
      );
    }
  }

  create() {
    // Create the bar
    this.bar = this.add.graphics();

    // This is to grab our main scene
    const mainGame = this.scene.get('FgScene');
    let player;
    // Need to wait for the FgScene to load first
    const loadScene = new Promise((res, rej) => {
      this.time.delayedCall(1000, () => {
        res(console.log(`Loading scene info...`));
      });
    });

    loadScene.then(() => {
      player = mainGame.player;
    });
    // Event listener to see when to update the health bar
    mainGame.events.on('takeDamage', (newHealth, maxHealth) => {
      this.draw(newHealth, maxHealth);
    });

    // Initializes the bar with 100 health/100 max health.
    loadScene.then(() => {
      this.draw(player.health, player.maxHealth);
    });

    // Shaping the minimap + border?
    loadScene.then(() => {
      const borderCam = mainGame.cameras
        .add(625, 0, 175, 175)
        .setZoom(10)
        .ignore(player)
        .ignore(mainGame.enemy)
        .ignore(mainGame.belowLayer1)
        .ignore(mainGame.playerProjectiles)
        // .ignore(mainGame.textBox)
        // .ignore(mainGame.debugGraphics)
        // .ignore(mainGame.worldLayer1)
        .setBackgroundColor(0x000000);
      const minimapCam = mainGame.cameras
        .add(640, 10, 150, 150)
        .setZoom(0.6)
        .setBounds(0, 0, 3000, 1000)
        .setName('minimap')
        .setBackgroundColor(0x000000)
        .startFollow(player);

      const minimapBorder = new Phaser.GameObjects.Graphics(this);
      minimapBorder.fillStyle(0x000000);
      minimapBorder.fillCircle(715, 85, 80);
      const border = new Phaser.Display.Masks.GeometryMask(this, minimapBorder);
      borderCam.setMask(border, true);

      const minimapCircle = new Phaser.GameObjects.Graphics(this);
      minimapCircle.fillCircle(715, 85, 75);
      const circle = new Phaser.Display.Masks.GeometryMask(this, minimapCircle);
      minimapCam.setMask(circle, true);
      console.log(`Fully loaded!`);

      mainGame.events.on('dialogue', () => {
        console.log(`Adding cam ignore...`);
        minimapCam.ignore(mainGame.textBox);
        minimapCam.ignore(mainGame.tutorialText);
        minimapCam.ignore(mainGame.nameText);
      });
    });
  }
}
