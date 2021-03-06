import Phaser from 'phaser';

export default class UpgradeUI extends Phaser.Scene {
  constructor() {
    super('UpgradeUI');
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

    this.checkLeftMaterials = this.checkLeftMaterials.bind(this);
  }

  checkLeftMaterials() {
    /*
      Function to compare player materials to required materials for upgrade. If player has required materials, upgrade will be added to player's inventory and used materials will be subtracted from player's inventory. If player does not have required materials, alert will be displayed.
      Returns null
    */
    const currWeapon = this.weapons[this.leftWeaponIdx];
    if (
      this.player.inventory.iron >= this.currLeftIron &&
      this.player.inventory.oil >= this.currLeftOil &&
      this.player.inventory[`${currWeapon}Attachment`] >= this.currLeftPart
    ) {
      this.player.inventory[currWeapon]++;
      this.player.inventory.iron -= this.currLeftIron;
      this.player.inventory.oil -= this.currLeftOil;
      this.player.inventory[`${currWeapon}Attachment`] -= this.currLeftPart;
    } else {
      alert('You do not have the required materials for that upgrade.');
    }
  }

  updateUpgradeButtons(inventory) {
    /*
      Function to update text on upgrades to either set createButton, equipButton, or unequipButton as visible and active depending on if characcter has weapon in inventory.
      param inventory: object -> Comes from this.player.inventory. Will be used to check quantity of player's weapons
      Returns null
    */
    if (this.player.currentLeftWeapon === this.weapons[this.leftWeaponIdx]) {
      this.leftUnequipText.setActive(true).setVisible(true);
      this.leftCreateText.setActive(false).setVisible(false);
      this.leftEquipText.setActive(false).setVisible(false);
    } else if (inventory[this.weapons[this.leftWeaponIdx]]) {
      this.leftEquipText.setActive(true).setVisible(true);
      this.leftCreateText.setActive(false).setVisible(false);
      this.leftUnequipText.setActive(false).setVisible(false);
    } else if (this.canCreate()) {
      this.leftCreateText.setActive(true).setVisible(true);
      this.leftEquipText.setActive(false).setVisible(false);
      this.leftUnequipText.setActive(false).setVisible(false);
    } else {
      this.leftCreateText.setActive(false).setVisible(false);
      this.leftEquipText.setActive(false).setVisible(false);
      this.leftUnequipText.setActive(false).setVisible(false);
    }
  }

  canCreate() {
    const currWeapon = this.weapons[this.leftWeaponIdx];
    if (
      this.player.inventory.iron >= this.currLeftIron &&
      this.player.inventory.oil >= this.currLeftOil &&
      this.player.inventory[`${currWeapon}Attachment`] >= this.currLeftPart
    ) {
      return true;
    }
    return false;
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
      Function to return us to where we left off in main scene
    */

    // Resume HUDScene
    this.scene.wake('HUDScene');

    // Switch back to main scene
    this.scene.transition({
      target: scene,
      duration: 10,
    });
  }

  upgradeHelper(upgradeName) {
    /*
      Function to increase/decrease player's stats based on which upgrade button was hit. This calls the player's upgradeStats method. Uses switch case based on the upgradeName passed into the function, which comes from the gameObject's name property.
      param upgradeName: string -> The name of the gameObject that was pressed. This will determine which stat to change and which direction to change it
      Current upgradeNames: hpUp, hpDown
      returns null
    */

    if (upgradeName.includes('Up') && !this.player.upgrade.points) {
      alert('You do not have any more upgrade points.');
      return;
    }

    switch (upgradeName) {
      case 'hpUp':
        this.player.upgradeStats('hpUp');
        this.hpText.setText(`Health: ${this.player.upgrade.maxHealth}`);

        break;
      case 'hpDown':
        if (this.player.upgrade.maxHealth > 0) {
          this.player.upgradeStats('hpDown');
          this.hpText.setText(`Health: ${this.player.upgrade.maxHealth}`);
        } else {
          console.log(`Cannot decrease maxHealth any lower.`);
        }
        break;

      case 'msUp':
        this.player.upgradeStats('msUp');
        this.msText.setText(`Move Speed: ${this.player.upgrade.moveSpeed}`);
        break;
      case 'msDown':
        if (this.player.upgrade.moveSpeed > 0) {
          this.player.upgradeStats('msDown');
          this.msText.setText(`Move Speed: ${this.player.upgrade.moveSpeed}`);
        } else {
          console.log(`Cannot decrease move speed any lower.`);
        }
        break;

      case 'regenUp':
        this.player.upgradeStats('regenUp');
        this.regenText.setText(`Regen: ${this.player.upgrade.regen}`);

        break;
      case 'regenDown':
        if (this.player.upgrade.regen > 0) {
          this.player.upgradeStats('regenDown');
          this.regenText.setText(`Regen: ${this.player.upgrade.regen}`);
        } else {
          console.log(`Cannot decrease regen any lower.`);
        }
        break;

      case 'armorUp':
        this.player.upgradeStats('armorUp');
        this.armorText.setText(`Armor: ${this.player.upgrade.armor}`);

        break;
      case 'armorDown':
        if (this.player.upgrade.armor > 0) {
          this.player.upgradeStats('armorDown');
          this.armorText.setText(`Armor: ${this.player.upgrade.armor}`);
        } else {
          console.log(`Cannot decrease armor any lower.`);
        }
        break;

      default:
        throw new Error('Invalid upgrade type');
    }
    this.player.updateStats();
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

    // For hp upgrades
    const hpUp = this.add.sprite(400, 155, 'arrow').setScale(0.8);
    const hpDown = this.add.sprite(400, 195, 'arrow').setScale(0.8);
    hpDown.angle = 180;
    hpDown.setName('hpDown');
    hpUp.setName('hpUp');
    hpUp.setInteractive({ useHandCursor: true });
    hpDown.setInteractive({ useHandCursor: true });
    this.hpText = this.add.text(
      360,
      235,
      `Health: +${this.player.upgrade.maxHealth}`
    );

    // For the top left upgrade area
    const rect = new Phaser.Geom.Rectangle(83, 133, 178, 100);
    const background = this.add.graphics({ fillStyle: { color: 0x00ffff } });
    background.fillRectShape(rect);
    const weapon = this.add.image(168, 175, 'knife').setScale(0.2);
    this.add.text(82, 95, 'Weapon Crafting Cost:').setScale(0.8);
    const materials = this.add
      .text(58, 107, 'Iron: 5, Oil: 5, Attachment: 1')
      .setScale(0.8);
    const createButton = this.add.sprite(168, 240, 'button').setScale(0.2);
    this.leftCreateText = this.add
      .text(145, 232, 'Craft')
      .setInteractive({ useHandCursor: true })
      .on('pointerup', this.checkLeftMaterials);
    this.leftEquipText = this.add
      .text(145, 232, 'Equip')
      .setInteractive({ useHandCursor: true })
      .on(
        'pointerup',
        () => {
          this.equipLeft(this.weapons[this.leftWeaponIdx]);
        },
        this
      );
    this.leftUnequipText = this.add
      .text(135, 232, 'Unequip')
      .setInteractive({ useHandCursor: true })
      .on(
        'pointerup',
        () => {
          this.unequipLeft(this.weapons[this.leftWeaponIdx]);
        },
        null,
        this
      );
    const nextButton = this.add.sprite(250, 240, 'button').setScale(0.2);
    const nextText = this.add
      .text(230, 232, 'Next')
      .setInteractive({ useHandCursor: true })
      .on('pointerup', () => {
        if (this.leftWeaponIdx !== this.weapons.length - 1) {
          const nextWeapon = this.weapons[++this.leftWeaponIdx];
          weapon.setTexture(nextWeapon);
          this.currLeftIron = this.weaponMaterials[nextWeapon].iron;
          this.currLeftOil = this.weaponMaterials[nextWeapon].oil;
          this.currLeftPart = this.weaponMaterials[nextWeapon][
            `${nextWeapon}Attachment`
          ];
          materials.setText(
            `Iron: ${this.currLeftIron}, Oil: ${this.currLeftOil}, Attachment: ${this.currLeftPart}`
          );
        }
      });
    const prevButton = this.add.sprite(90, 240, 'button').setScale(0.2);
    const prevText = this.add
      .text(70, 232, 'Prev')
      .setInteractive({ useHandCursor: true })
      .on('pointerup', () => {
        if (this.leftWeaponIdx !== 0) {
          const prevWeapon = this.weapons[--this.leftWeaponIdx];
          weapon.setTexture(prevWeapon);
          this.currLeftIron = this.weaponMaterials[prevWeapon].iron;
          this.currLeftOil = this.weaponMaterials[prevWeapon].oil;
          this.currLeftPart = this.weaponMaterials[prevWeapon][
            `${prevWeapon}Attachment`
          ];
          materials.setText(
            `Iron: ${this.currLeftIron}, Oil: ${this.currLeftOil}, Attachment: ${this.currLeftPart}`
          );
        }
      });

    // For the top right upgrade area
    const topRightUp = this.add.sprite(627, 155, 'arrow').setScale(0.8);
    const topRightDown = this.add.sprite(627, 195, 'arrow').setScale(0.8);
    topRightDown.angle = 180;
    topRightDown.setName('topRightDown');
    topRightUp.setName('topRightUp');
    topRightUp.setInteractive({ useHandCursor: true });
    topRightDown.setInteractive({ useHandCursor: true });
    this.topRightText = this.add.text(555, 235, `Not yet implemented`);

    // For move speed upgrades
    const msUp = this.add.sprite(627, 315, 'arrow').setScale(0.8);
    const msDown = this.add.sprite(627, 355, 'arrow').setScale(0.8);
    msDown.angle = 180;
    msDown.setName('msDown');
    msUp.setName('msUp');
    msUp.setInteractive({ useHandCursor: true });
    msDown.setInteractive({ useHandCursor: true });
    this.msText = this.add.text(
      585,
      395,
      `Move Speed: +${this.player.upgrade.moveSpeed}`
    );

    // For regen upgrades
    const regenUp = this.add.sprite(400, 315, 'arrow').setScale(0.8);
    const regenDown = this.add.sprite(400, 355, 'arrow').setScale(0.8);
    regenDown.angle = 180;
    regenDown.setName('regenDown');
    regenUp.setName('regenUp');
    regenUp.setInteractive({ useHandCursor: true });
    regenDown.setInteractive({ useHandCursor: true });
    this.regenText = this.add.text(
      360,
      395,
      `Regen: +${this.player.upgrade.regen}`
    );

    // For armor upgrades
    const armorUp = this.add.sprite(168, 315, 'arrow').setScale(0.8);
    const armorDown = this.add.sprite(168, 355, 'arrow').setScale(0.8);
    armorDown.angle = 180;
    armorDown.setName('armorDown');
    armorUp.setName('armorUp');
    armorUp.setInteractive({ useHandCursor: true });
    armorDown.setInteractive({ useHandCursor: true });
    this.armorText = this.add.text(
      128,
      395,
      `Armor: +${this.player.upgrade.armor}`
    );

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

    // This is just for debugging purposes. Shows pointer
    // position for easier x,y coordinate selection when making
    // the UI
    // this.input.on('pointerdown', (pointer) => {
    //   console.log(`Pointer position: `, pointer.x, pointer.y);
    // });

    this.events.on('transitioncomplete', () => {
      this.player.y += 30;
    });
  }

  update() {
    this.updateUpgradeButtons(this.player.inventory);
    this.updateInventory(this.player.inventory);
  }
}
