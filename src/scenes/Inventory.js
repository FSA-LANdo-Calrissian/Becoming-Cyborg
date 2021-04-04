import Phaser from 'phaser';

export default class Inventory extends Phaser.Scene {
  constructor() {
    super('Inventory');
    this.weapons = ['knife', 'gun', 'fireBall'];
    this.leftWeaponIdx = 0;
    this.weaponMaterials = {
      knife: { iron: 5, oil: 5, knifeAttachment: 1 },
      gun: { iron: 10, oil: 10, gunAttachment: 1 },
      fireBall: { iron: 15, oil: 15, fireBallAttachment: 1 },
    };
    this.currLeftIron = 5;
    this.currLeftOil = 5;
    this.currLeftPart = 1;
  }

  updateUpgradeButtons(inventory) {
    /*
      Function to update text on upgrades to either set createButton, equipButton, or unequipButton as visible and active depending on if characcter has weapon in inventory.
      param inventory: object -> Comes from this.player.inventory. Will be used to check quantity of player's weapons
      Returns null
    */
    if (this.player.currentLeftWeapon === this.weapons[this.leftWeaponIdx]) {
      this.leftUnequipText.setActive(true).setVisible(true);

      this.leftEquipText.setActive(false).setVisible(false);
    } else if (inventory[this.weapons[this.leftWeaponIdx]]) {
      this.leftEquipText.setActive(true).setVisible(true);

      this.leftUnequipText.setActive(false).setVisible(false);
    } else {
      this.leftEquipText.setActive(false).setVisible(false);
      this.leftUnequipText.setActive(false).setVisible(false);
    }
  }

  updateInventory(inventory) {
    /*
      Function to continuously update inventory text values
      param inventory: object -> Comes from this.player.inventory. Will be used to check quantity of all the player's inventory items
      Returns null
    */
    this.inventoryItems.setText(
      `Iron: ${inventory.iron}, Oil: ${inventory.iron}`
    );
    this.inventoryWeapons.setText(
      `Knife: ${this.player.inventory.knife}, Gun: ${this.player.inventory.gun}, Fire Ball: ${this.player.inventory.fireBall}`
    );
    this.inventoryAttachments.setText(
      `Knife Attachments: ${inventory.knifeAttachment}, Gun Attachments: ${inventory.gunAttachment}, Fire Ball Attachments: ${inventory.fireBallAttachment}`
    );
    this.upgradePoints.setText(`Upgrade Points: ${this.player.upgrade.points}`);
  }

  equipLeft(weapon) {
    /*
      Function to equip left arm weapon as this.player.currentLeftWeapon and subtract weapon from player inventory
      param weapon: string -> The weapon name of the current weapon the player is trying to equip
      returns null
    */
    if (this.player.currentLeftWeapon !== 'none') {
      this.unequipLeft(this.player.currentLeftWeapon);
    }
    this.player.currentLeftWeapon = weapon;
    this.player.inventory[weapon]--;
    this.player.updateStats();
  }

  unequipLeft(weapon) {
    /*
      Function to unequip left arm weapon as this.player.currentLeftWeapon (setting to none) and add weapon to player inventory
      param weapon: string -> The weapon name of the current weapon the player is trying to equip
      returns null
    */
    this.player.currentLeftWeapon = 'none';
    this.player.inventory[weapon]++;
    this.player.updateStats();
  }

  returnToGame(player, scene) {
    /*
      Function to return us to where we left off on FgScene
    */

    // Resume HUDScene
    this.scene.wake('HUDScene');

    // Switch back to main scene
    this.scene.transition({
      target: scene,
      duration: 10,
    });
  }

  create({ player, scene }) {
    // We sleep the HUDScene
    this.scene.sleep('HUDScene');

    // We save this to this.player so that we have access to it
    // when we transition back to FgScene
    this.player = player;

    // The upgrade UI image
    this.add.sprite(400, 300, 'upgrade').setScale(1.2);

    // Current player inventory
    this.add.text(350, 5, 'Inventory:');
    this.inventoryItems = this.add.text(
      310,
      20,
      `Iron: ${this.player.inventory.iron}, Oil: ${this.player.inventory.iron}`
    );
    this.inventoryWeapons = this.add.text(
      250,
      35,
      `Knife: ${this.player.inventory.knife}, Gun: ${this.player.inventory.gun}, Fire Ball: ${this.player.inventory.fireBall}`
    );
    this.inventoryAttachments = this.add.text(
      75,
      50,
      `Knife Attachments: ${this.player.inventory.knifeAttachment}, Gun Attachments: ${this.player.inventory.gunAttachment}, Fire Ball Attachments: ${this.player.inventory.fireBallAttachment}`
    );
    this.upgradePoints = this.add.text(
      310,
      65,
      `Upgrade Points: ${this.player.upgrade.points}`
    );

    // For the top left upgrade area
    const rect = new Phaser.Geom.Rectangle(83, 133, 178, 100);
    const background = this.add.graphics({ fillStyle: { color: 0x00ffff } });
    background.fillRectShape(rect);
    const weapon = this.add.image(168, 175, 'knife').setScale(0.2);
    const createButton = this.add.sprite(168, 240, 'button').setScale(0.2);
    this.leftEquipText = this.add
      .text(145, 232, 'Equip')
      .setInteractive()
      .on(
        'pointerup',
        () => {
          this.equipLeft(this.weapons[this.leftWeaponIdx]);
        },
        this
      )
      .setVisible(false);
    this.leftUnequipText = this.add
      .text(135, 232, 'Unequip')
      .setInteractive()
      .on(
        'pointerup',
        () => {
          this.unequipLeft(this.weapons[this.leftWeaponIdx]);
        },
        null,
        this
      )
      .setVisible(false);
    const nextButton = this.add.sprite(250, 240, 'button').setScale(0.2);
    const nextText = this.add
      .text(230, 232, 'Next')
      .setInteractive()
      .on('pointerup', () => {
        if (this.leftWeaponIdx !== this.weapons.length - 1) {
          const nextWeapon = this.weapons[++this.leftWeaponIdx];
          weapon.setTexture(nextWeapon);
          this.currLeftIron = this.weaponMaterials[nextWeapon].iron;
          this.currLeftOil = this.weaponMaterials[nextWeapon].oil;
          this.currLeftPart = this.weaponMaterials[nextWeapon][
            `${nextWeapon}Attachment`
          ];
        }
      });
    const prevButton = this.add.sprite(90, 240, 'button').setScale(0.2);
    const prevText = this.add
      .text(70, 232, 'Prev')
      .setInteractive()
      .on('pointerup', () => {
        if (this.leftWeaponIdx !== 0) {
          const prevWeapon = this.weapons[--this.leftWeaponIdx];
          weapon.setTexture(prevWeapon);
          this.currLeftIron = this.weaponMaterials[prevWeapon].iron;
          this.currLeftOil = this.weaponMaterials[prevWeapon].oil;
          this.currLeftPart = this.weaponMaterials[prevWeapon][
            `${prevWeapon}Attachment`
          ];
        }
      });

    // Button to return to FgScene button
    this.add.image(400, 560, 'button').setScale(0.4);
    const text = this.add
      .text(337, 546, 'Go Back')
      .setFontSize(40)
      .setScale(0.7);
    text.setInteractive({ useHandCursor: true }).on('pointerdown', () => {
      this.leftWeaponIdx = 0;
      this.returnToGame(player, scene);
    });

    // This is the event propagator.
    // It'll tell us which object we clicked on
    this.input.on('gameobjectdown', (pointer, gameObject) => {
      if (gameObject.name !== '') {
        this.upgradeHelper(gameObject.name);
      }
    });
  }

  update() {
    this.updateUpgradeButtons(this.player.inventory);
    this.updateInventory(this.player.inventory);
  }
}
