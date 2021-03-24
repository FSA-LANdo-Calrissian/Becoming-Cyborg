import Phaser from 'phaser';

export default class UpgradeUI extends Phaser.Scene {
  constructor() {
    super('UpgradeUI');
    this.upgrades = ['knife', 'gun', 'fireBall'];
    this.upgradesIdx = 0;
    this.upgradeMaterials = {
      knife: { iron: 5, oil: 5, knifeAttachment: 1 },
      gun: { iron: 10, oil: 10, gunAttachment: 1 },
      fireBall: { iron: 15, oil: 15, fireBallAttachment: 1 },
    };
    this.currLeftIron = 5;
    this.currLeftOil = 5;
    this.currLeftPart = 1;
  }

  checkLeftMaterials() {
    /*
      Function to compare player materials to required materials for upgrade. If player has required materials, upgrade will be added to player's inventory and used materials will be subtracted from player's inventory. If player does not have required materials, alert will be displayed.
      Returns null
    */
    const currUpgrade = this.upgrades[this.upgradesIdx];
    if (
      this.player.inventory.iron >= this.currLeftIron &&
      this.player.inventory.oil >= this.currLeftOil &&
      this.player.inventory[`${currUpgrade}Attachment`] >= this.currLeftPart
    ) {
      this.player.inventory[currUpgrade]++;
      this.player.inventory.iron -= this.currLeftIron;
      this.player.inventory.oil -= this.currLeftOil;
      this.player.inventory[`${currUpgrade}Attachment`] -= this.currLeftPart;
    }
  }

  updateUpgradeButtons({ gun, knife, fireBall }) {
    /*
      Function to update upgrade button to either create or equip depending on if characcter has weapon in inventory.
      param gun: comes from this.player.inventory --> number of gun upgrades in inventory
      param knife: comes from this.player.inventory --> number of knife upgrades in inventory
      param fireBall: comes from this.player.inventory --> number of fireBall upgrades in inventory
    */
  }

  equipLeft() {
    /*
      Function to equip left arm weapon
      returns null
    */
  }

  returnToGame(player) {
    /*
      Function to return us to where we left off on FgScene
    */
    this.scene.transition({
      target: 'FgScene',
      duration: 1000,
    });
  }

  upgradeHelper(upgradeName) {
    /*
      Function to increase/decrease player's stats based on which upgrade button was hit. This calls the player's upgradeStats method. Uses switch case based on the upgradeName passed into the function, which comes from the gameObject's name property.
      param upgradeName: string -> The name of the gameObject that was pressed. This will determine which stat to change and which direction to change it
      Current upgradeNames: hpUp, hpDown
      returns null
    */

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
  }

  create({ player }) {
    // We save this to this.player so that we have access to it
    // when we transition back to FgScene
    this.player = player;
    this.player = {
      upgrade: {
        maxHealth: 0,
        damage: 0,
        attackSpeed: 0,
        moveSpeed: 0,
        regen: 0,
        armor: 0,
      },
      inventory: {
        iron: 10,
        oil: 10,
        gunAttachment: 1,
        knifeAttachment: 0,
        fireBallAttachment: 1,
        gun: 0,
        knife: 0,
        fireball: 0,
      },
    };
    // The upgrade UI image
    this.add.sprite(400, 300, 'upgrade').setScale(1.2);

    // Current player inventory
    this.add.text(350, 10, 'Inventory:');
    this.add.text(
      310,
      30,
      `Iron: ${this.player.inventory.iron}, Oil: ${this.player.inventory.iron}`
    );
    this.add.text(
      100,
      50,
      `Knife Attachments: ${this.player.inventory.knifeAttachment}, Gun Attachments: ${this.player.inventory.gunAttachment}, Fire Ball Attachments: ${this.player.inventory.fireBallAttachment}`
    );

    // For hp upgrades
    const hpUp = this.add.sprite(400, 155, 'arrow').setScale(0.8);
    const hpDown = this.add.sprite(400, 195, 'arrow').setScale(0.8);
    hpDown.angle = 180;
    hpDown.setName('hpDown');
    hpUp.setName('hpUp');
    hpUp.setInteractive();
    hpDown.setInteractive();
    this.hpText = this.add.text(
      360,
      235,
      `Health: ${this.player.upgrade.maxHealth}`
    );

    // For the top left upgrade area
    const upgrade = this.add.image(168, 165, 'knife').setScale(0.19);
    const materials = this.add
      .text(85, 200, 'Iron: 5, Oil: 5, Part: 1')
      .setScale(0.7);
    const createButton = this.add.sprite(168, 240, 'button').setScale(0.2);
    const createText = this.add
      .text(135, 235, 'create')
      .setInteractive()
      .on('pointerup', this.checkLeftMaterials);
    const equipText = this.add
      .text(135, 235, 'equip')
      .setInteractive()
      .on('pointerup', this.equipLeft);
    const nextButton = this.add.sprite(250, 240, 'button').setScale(0.2);
    const nextText = this.add
      .text(230, 235, 'next')
      .setInteractive()
      .on('pointerup', () => {
        if (this.upgradesIdx !== this.upgrades.length - 1) {
          const nextUpgrade = this.upgrades[++this.upgradesIdx];
          upgrade.setTexture(nextUpgrade);
          this.currLeftIron = this.upgradeMaterials[nextUpgrade].iron;
          this.currLeftOil = this.upgradeMaterials[nextUpgrade].oil;
          this.currLeftPart = this.upgradeMaterials[nextUpgrade][
            `${nextUpgrade}Attachment`
          ];
          materials.setText(
            `Iron: ${this.currLeftIron}, Oil: ${this.currLeftOil}, Part: ${this.currLeftPart}`
          );
        }
      });
    const prevButton = this.add.sprite(90, 240, 'button').setScale(0.2);
    const prevText = this.add
      .text(70, 235, 'prev')
      .setInteractive()
      .on('pointerup', () => {
        if (this.upgradesIdx !== 0) {
          const prevUpgrade = this.upgrades[--this.upgradesIdx];
          upgrade.setTexture(prevUpgrade);
          this.currLeftIron = this.upgradeMaterials[prevUpgrade].iron;
          this.currLeftOil = this.upgradeMaterials[prevUpgrade].oil;
          this.currLeftPart = this.upgradeMaterials[prevUpgrade][
            `${prevUpgrade}Attachment`
          ];
          materials.setText(
            `Iron: ${this.currLeftIron}, Oil: ${this.currLeftOil}, Part: ${this.currLeftPart}`
          );
        }
      });
    // topLeftDown.angle = 180;
    // topLeftDown.setName('topLeftDown');
    // topLeftUp.setName('topLeftUp');
    // topLeftUp.setInteractive();
    // topLeftDown.setInteractive();
    // this.topLeftText = this.add.text(128, 235, `UpgradeTextHere`);

    // For the top right upgrade area
    const topRightUp = this.add.sprite(627, 155, 'arrow').setScale(0.8);
    const topRightDown = this.add.sprite(627, 195, 'arrow').setScale(0.8);
    topRightDown.angle = 180;
    topRightDown.setName('topRightDown');
    topRightUp.setName('topRightUp');
    topRightUp.setInteractive();
    topRightDown.setInteractive();
    this.topRightText = this.add.text(585, 235, `UpgradeTextHere`);

    // For move speed upgrades
    const msUp = this.add.sprite(627, 315, 'arrow').setScale(0.8);
    const msDown = this.add.sprite(627, 355, 'arrow').setScale(0.8);
    msDown.angle = 180;
    msDown.setName('msDown');
    msUp.setName('msUp');
    msUp.setInteractive();
    msDown.setInteractive();
    this.msText = this.add.text(
      585,
      395,
      `Move Speed: ${this.player.upgrade.moveSpeed}`
    );

    // For regen upgrades
    const regenUp = this.add.sprite(400, 315, 'arrow').setScale(0.8);
    const regenDown = this.add.sprite(400, 355, 'arrow').setScale(0.8);
    regenDown.angle = 180;
    regenDown.setName('regenDown');
    regenUp.setName('regenUp');
    regenUp.setInteractive();
    regenDown.setInteractive();
    this.regenText = this.add.text(
      360,
      395,
      `Regen: ${this.player.upgrade.regen}`
    );

    // For armor upgrades
    const armorUp = this.add.sprite(168, 315, 'arrow').setScale(0.8);
    const armorDown = this.add.sprite(168, 355, 'arrow').setScale(0.8);
    armorDown.angle = 180;
    armorDown.setName('armorDown');
    armorUp.setName('armorUp');
    armorUp.setInteractive();
    armorDown.setInteractive();
    this.armorText = this.add.text(
      128,
      395,
      `Armor: ${this.player.upgrade.armor}`
    );

    // Button to return to FgScene button
    const text = this.add.text(320, 103, 'Go Back!');
    text.setInteractive({ useHandCursor: true }).on('pointerdown', () => {
      this.returnToGame(player);
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
    this.input.on('pointerdown', (pointer) => {
      console.log(`Pointer position: `, pointer.x, pointer.y);
    });

    this.events.on('transitioncomplete', () => {
      this.player.y += 20;
    });
  }
}
