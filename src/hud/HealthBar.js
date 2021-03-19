import Phaser from 'phaser';

export default class HealthBar {
  constructor(scene, x, y, health) {
    this.scene = scene;
    this.bar = new Phaser.GameObjects.Graphics(scene);
    this.x = x;
    this.y = y;
    this.health = health;
    this.size = {
      width: 50,
      height: 5,
    };
    // How much of the hp bar to deplete on damage
    this.pixelPerHealth = this.size.width / this.health;
    scene.add.existing(this.bar);

    this.draw(x, y);
  }

  damage(newHealth) {
    this.health = newHealth;
    this.draw(this.x, this.y);
  }

  draw(x, y) {
    // First we clear the old bar - so that we can draw the new/updated one
    this.bar.clear();
    const { width, height } = this.size;
    const margin = 1;

    // Black border around hp bar
    this.bar.fillStyle(0x000000);
    this.bar.fillRect(x, y, width + margin, height + margin);

    // White beneath the hp bar
    this.bar.fillStyle(0xffffff);
    this.bar.fillRect(x + margin, y + margin, width - margin, height - margin);

    // This makes it so the health bar goes with the camera instead of staying in that spot of the world.
    this.bar.setScrollFactor(0, 0);

    const healthWidth = Math.floor(this.health * this.pixelPerHealth);

    // Bar colors based on health %
    if (healthWidth <= width / 4) {
      this.bar.fillStyle(0xff0000);
    } else if (healthWidth <= width / 2) {
      this.bar.fillStyle(0xffff00);
    } else {
      this.bar.fillStyle(0x00ff00);
    }

    // Logic for if we have <= 0 health
    if (healthWidth > 0) {
      this.bar.fillRect(
        x + margin,
        y + margin,
        (healthWidth > this.size.width ? this.size.width : healthWidth) -
          margin,
        height - margin
      );
    }
  }
}
