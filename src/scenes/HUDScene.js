import Phaser from 'phaser';

export default class HUDScene extends Phaser.Scene {
  constructor() {
    super('HUDScene');

    // The size of the hp bar
    this.size = {
      width: 150,
      height: 10,
    };
  }

  draw(newHealth, maxHealth) {
    /*
      Renders the hp bar.
      param newHealth: int -> The updated health of the player. This is the value we will use to determine what percentage of health the player has left.
      param maxHealth: int -> The player's total health amount. This is used to determine the percentage of health the player has left.
      returns null.
    */

    // Constants for the x,y coordinate of the hp bar.
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

  updateBottomHUD(mainGame) {
    /*
      Function to create the weaponHUD at bottom of HUDScene. Includes player's current weapons and quantity of iron and oil.
      param mainGame: obj -> mainGame scene so weaponHUD has access to player inventory.
      returns null.
    */

    this.add.image(400, 650, 'weaponHUD').setScale(0.3);

    this.leftWeapon = this.add
      .image(330, 560, `${mainGame.player.currentLeftWeapon}`)
      .setScale(0.18);
    this.leftWeapon.flipX = true;

    this.rightWeapon = this.add.image(470, 560, 'none').setScale(0.18);

    this.inventory = this.add.text(
      530,
      540,
      `Iron: ${mainGame.player.inventory.iron}\nOil: ${mainGame.player.inventory.oil}`
    );
  }

  create() {
    // Create the bar
    this.bar = this.add.graphics();

    // This is to grab our main scene
    const mainGame = this.scene.get('FgScene');
    let player;
    // Need to wait for the FgScene to load first
    const loadScene = new Promise((res) => {
      this.time.delayedCall(1000, () => {
        res(console.log(`Loading scene info...`));
      });
    });

    // After FgScene "loads" (we really just wait one second)
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
      // Make the cameras

      const minimapCam = mainGame.cameras
        .add(640, 10, 150, 150)
        .setZoom(0.6)
        .setBounds(0, 0, 3000, 1000)
        .setName('minimap')
        .setBackgroundColor(0x000000)
        .startFollow(player);

      // Make the border
      this.add.sprite(716, 85, 'minimap').setScale(0.52);

      const minimapCircle = new Phaser.GameObjects.Graphics(this);
      minimapCircle.fillCircle(715, 85, 75);
      const circle = new Phaser.Display.Masks.GeometryMask(this, minimapCircle);
      minimapCam.setMask(circle, true);
      console.log(`Fully loaded!`);

      // If in dialogue, ignore the text box and texts.
      mainGame.events.on('dialogue', () => {
        if (mainGame.textBox) {
          minimapCam.ignore(mainGame.textBox);
        }
        if (mainGame.dialogueText) {
          minimapCam.ignore(mainGame.dialogueText);
        }
        if (mainGame.nameText) {
          minimapCam.ignore(mainGame.nameText);
        }
        if (mainGame.tooltip) {
          minimapCam.ignore(mainGame.tooltip);
        }
      });
    });
    loadScene.then(() => {
      // Make the weapon HUD frame

      this.updateBottomHUD(mainGame);
    });
  }
}
