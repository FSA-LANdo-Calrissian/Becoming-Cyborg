import Phaser from 'phaser';

export default class HealthBar {
  constructor(scene, x, y, health) {
    this.scene = scene;
    this.bar = new Phaser.GameObjects.Graphics(scene);
    this.x = x;
    this.y = y;
    this.health = health;
    this.size = {
      width: 150,
      height: 10,
    };
    this.pixelPerHealth = this.size.width / this.health;
    scene.add.existing(this.bar);

    this.draw(x, y);
  }

  takeDamage(damage) {
    this.health -= damage;
    this.draw(this.x, this.y);
    if (this.health <= 0) {
      console.log('LOL ded noob');
    }
  }

  draw(x, y) {
    // First we clear the old bar - so that we can draw the new/updated one
    this.bar.clear();
    const { width, height } = this.size;
    const margin = 2;

    this.bar.fillStyle(0x000000);
    this.bar.fillRect(x, y, width + margin, height + margin);

    this.bar.fillStyle(0xffffff);
    this.bar.fillRect(x + margin, y + margin, width - margin, height - margin);

    const healthWidth = Math.floor(this.health * this.pixelPerHealth);

    if (healthWidth <= width / 4) {
      this.bar.fillStyle(0xff0000);
    } else if (healthWidth <= width / 2) {
      this.bar.fillStyle(0xffff00);
    } else {
      this.bar.fillStyle(0x00ff00);
    }

    if (healthWidth > 0) {
      this.bar.fillRect(
        x + margin,
        y + margin,
        healthWidth - margin,
        height - margin
      );
    }
  }
}
