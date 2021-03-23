import Phaser from 'phaser';

export default class UpgradeUI extends Phaser.Scene {
  constructor() {
    super('UpgradeUI');
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
      Function to increase/decrease player's stats based on which upgrade button was hit. This calls the player's upgradeStats method.
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
    // The upgrade UI image
    this.add.sprite(400, 300, 'upgrade').setScale(1.2);

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
    const topLeftUp = this.add.sprite(168, 155, 'arrow').setScale(0.8);
    const topLeftDown = this.add.sprite(168, 195, 'arrow').setScale(0.8);
    topLeftDown.angle = 180;
    topLeftDown.setName('topLeftDown');
    topLeftUp.setName('topLeftUp');
    topLeftUp.setInteractive();
    topLeftDown.setInteractive();
    this.topLeftText = this.add.text(128, 235, `UpgradeTextHere`);

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
  }
}
