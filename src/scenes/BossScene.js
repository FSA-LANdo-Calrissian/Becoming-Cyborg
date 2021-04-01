import Phaser from 'phaser';
import Player from '../entity/Player';
import Boss from '../entity/Boss';
import createPlayerAnims from '../animations/createPlayerAnims';

export default class FgScene extends Phaser.Scene {
  constructor() {
    super('BossScene');
  }

  create() {
    createPlayerAnims.call(this);

    this.map = this.make.tilemap({ key: 'bossMap' });

    this.terrainTiles = this.map.addTilesetImage('allGround', 'terrain');
    this.worldTiles = this.map.addTilesetImage('allWorldLayer', 'worldTileset');

    this.ground = this.map.createLayer('ground', this.terrainTiles);

    this.worldGround = this.map.createLayer('world-ground', this.terrainTiles);
    this.worldGround.setCollisionByProperty({ collides: true });

    this.world = this.map.createLayer('world', this.worldTiles);
    this.world.setCollisionByProperty({ collides: true });

    this.player = new Player(this, 1104, 1104, 'player', this.loadBullet)
      .setScale(0.5)
      .setSize(30, 35)
      .setOffset(10, 12);

    this.boss = new Boss(this, 750, 200, 'boss').setScale(2);

    this.physics.add.collider(this.player, this.worldGround);
    this.physics.add.collider(this.player, this.world);

    this.cameras.main.startFollow(this.player);

    this.cursors = this.input.keyboard.addKeys({
      inventory: Phaser.Input.Keyboard.KeyCodes.ESC,
      interact: Phaser.Input.Keyboard.KeyCodes.SPACE,
      up: Phaser.Input.Keyboard.KeyCodes.W,
      left: Phaser.Input.Keyboard.KeyCodes.A,
      down: Phaser.Input.Keyboard.KeyCodes.S,
      right: Phaser.Input.Keyboard.KeyCodes.D,
      upgrade: Phaser.Input.Keyboard.KeyCodes.U,
      hp: Phaser.Input.Keyboard.KeyCodes.H,
    });
  }

  update(time, delta) {
    this.player.update(this.cursors, time);

    if (this.cursors.upgrade.isDown) {
      // TODO: Remove this for production
      this.player.upgradeStats('msUp');
    }

    if (this.cursors.hp.isDown) {
      // Press h button to see stats.
      // TODO: Remove this for production
      console.log(
        `Current health: ${this.player.health}/${this.player.maxHealth}`
      );
      console.log(`Current move speed: ${this.player.speed}`);
      console.log(`Current armor: ${this.player.armor}`);
      console.log(`Current regen: ${this.player.regen}`);
      console.log(`Current weapon: ${this.player.currentLeftWeapon}`);
      console.log(`Current damage: ${this.player.damage}`);
      console.log(`Current attackSpeed: ${this.player.attackSpeed}`);
      console.log(`Current player position: `, this.player.x, this.player.y);
      console.log(
        `Current camera position: `,
        this.cameras.main.scrollX,
        this.cameras.main.scrollY
      );
    }
  }
}
