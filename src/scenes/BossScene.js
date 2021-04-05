import Phaser from 'phaser';
import Projectile from '../entity/Projectile';
import Player from '../entity/Player';
import Enemy from '../entity/Enemy';
import Item from '../entity/Item';
import Boss from '../entity/Boss';
import createPlayerAnims from '../animations/createPlayerAnims';
import createBossAnims from '../animations/createBossAnims';
import createRobotAnims from '../animations/createRobotAnims';
import { playDialogue } from './cutscenes/cutscenes';

export default class BossScene extends Phaser.Scene {
  constructor() {
    super('BossScene');
    this.bossCinematic = false;
    this.dialogueInProgress = false;
    this.fightStarted = false;
    this.handsKilled = 0;
    this.key = 'BossScene';

    this.loadBullet = this.loadBullet.bind(this);
  }

  initScene() {
    this.bossCinematic = false;
    this.dialogueInProgress = false;
    this.fightStarted = false;
  }

  loadBullet(x, y, sprite, angle) {
    /*
      Function to pass into any entity that uses projectiles on creation.
      This function will fire a newly created projectile or use a dead one with the appropriate key if available. Projectile logic will move the projectile to where it needs to go on its own.

      param x: int -> X coordinate of whatever is shooting the projectile (not of the target).
      param y: int -> Y coordinate of whatever is shooting the projectile (not of the target).
      param sprite: string -> the key for the sprite to use.
      param angle: The angle at which to shoot and render projectile.
      returns null.
    */

    // Grab dead projectile from group if available.
    let bullet = this.playerProjectiles.getFirstDead(false, x, y, sprite);

    // If none found, create it.
    if (!bullet) {
      bullet = new Projectile(this, x, y, sprite, angle).setScale(0.5);
      // Add to projectiles group.
      // TODO: Add logic for whether to add to player or enemy projectile group
      this.playerProjectiles.add(bullet);
    }
    // Pew pew the bullet.
    bullet.reset();
    bullet.shoot(x, y, angle);
  }

  create({ player }) {
    // Saving initial player to pass to scene restart on game over
    this.restartData = player;

    // Initialize variables for restart
    this.bossCinematic = false;
    this.dialogueInProgress = false;
    this.fightStarted = false;
    this.handsKilled = 0;

    // Create animations
    createPlayerAnims.call(this);
    createBossAnims.call(this);
    createRobotAnims.call(this);

    // Load sounds
    this.gg = this.sound.add('gg');
    this.bossMusic = this.sound.add('bossTrack2', { volume: 0.1 });
    this.fireBall = this.sound.add('fireBall', { loop: false, volume: 0.1 });
    this.gun = this.sound.add('gun', { loop: false, volume: 0.03 });
    this.knife = this.sound.add('knife', { loop: false, volume: 0.2 });
    this.punch = this.sound.add('punch', { loop: false, volume: 1.5 });

    // Make the world
    this.map = this.make.tilemap({ key: 'bossMap' });

    this.terrainTiles = this.map.addTilesetImage('allGround', 'terrain');
    this.worldTiles = this.map.addTilesetImage('allWorldLayer', 'worldTileset');

    this.ground = this.map.createLayer('ground', this.terrainTiles);

    this.worldGround = this.map.createLayer('world-ground', this.terrainTiles);
    this.worldGround.setCollisionByProperty({ collides: true });

    this.world = this.map.createLayer('world', this.worldTiles);
    this.world.setCollisionByProperty({ collides: true });

    this.shockwaveCollision = this.map.createLayer(
      'collision',
      this.terrainTiles
    );
    this.shockwaveCollision.setCollisionByProperty({ collides: true });

    // Create the entities
    this.player = new Player(
      this,
      658,
      1455,
      'player',
      this.loadBullet,
      this.punch,
      this.knife,
      this.gun,
      this.fireBall
    )
      .setScale(0.5)
      .setSize(30, 35)
      .setOffset(10, 12);
    if (player) {
      const { inventory, upgrade, health, currentLeftWeapon, stats } = player;
      this.player.inventory = inventory;
      this.player.upgrade = upgrade;
      this.player.health = health;
      this.player.currentLeftWeapon = currentLeftWeapon;
      this.player.stats = stats;
      this.player.updateStats();
    }

    this.player.currentLeftWeapon = 'fireBall';
    this.player.updateStats();

    this.boss = new Boss(this, 750, 200, 'boss')
      .setScale(1)
      .setSize(300, 290)
      .setOffset(10, -10);

    // Make the groups
    this.enemiesGroup = this.physics.add.group({
      classType: Enemy,
      runChildUpdate: true,
    });

    this.bossGroup = this.physics.add.group({
      classType: Boss,
      runChildUpdate: true,
    });

    this.shockwavesGroup = this.physics.add.group({
      class: Projectile,
      runChildUpdate: true,
    });

    this.playerProjectiles = this.physics.add.group({
      classType: Projectile,
      runChildUpdate: true,
    });

    this.itemsGroup = this.physics.add.group({
      classType: Item,
      runChildUpdate: true,
    });
    // Add entities to groups
    this.bossGroup.add(this.boss);

    // Add collisions
    this.physics.add.collider(this.player, this.worldGround);
    this.physics.add.collider(this.player, this.world);
    this.physics.add.collider(this.enemiesGroup, this.shockwaveCollision);
    // this.physics.add.collider(this.enemiesGroup, this.world);

    this.physics.add.overlap(
      this.shockwavesGroup,
      this.shockwaveCollision,
      (proj, world) => {
        proj.setVisible(false);
        proj.setActive(false);
        proj.body.enable = false;
      },
      (proj, world) => world.canCollide
    );

    this.physics.add.overlap(
      this.playerProjectiles,
      this.shockwaveCollision,
      (proj, world) => {
        proj.destroy();
      },
      (proj, world) => world.canCollide
    );

    this.physics.add.overlap(
      this.player,
      this.shockwavesGroup,
      (player, proj) => {
        proj.lifespan = 0;
        player.takeDamage(proj.damage, this.gg);
      }
    );

    this.physics.add.overlap(
      this.player,
      this.enemiesGroup,
      (player, enemy) => {
        // TODO: Replace this with actual enemy damage numbers
        player.takeDamage(10, this.gg);
      }
    );

    this.physics.add.overlap(this.player, this.bossGroup, (player, enemy) => {
      // TODO: Replace this with actual enemy damage numbers
      player.takeDamage(15, this.gg);
    });

    this.physics.add.overlap(
      this.playerProjectiles,
      this.bossGroup,
      (proj, enemy) => {
        proj.lifespan -= 100;
        enemy.takeDamage(
          this.player.damage,
          this.leftHand.health,
          this.rightHand.health,
          this.boss.health
        );
      }
    );

    this.physics.add.overlap(
      this.playerProjectiles,
      this.enemiesGroup,
      (proj, enemy) => {
        proj.lifespan -= 600;
        enemy.takeDamage(proj.damage);
      }
    );

    this.physics.add.overlap(this.player, this.itemsGroup, (player, item) => {
      // If player full on health, don't pick up potions.
      if (
        item.texture.key === 'potion' &&
        this.player.health === this.player.maxHealth
      ) {
        return;
      }
      // Otherwise, pick up items
      player.pickUpItem(item.texture.key);
      // And make it disappear from screen.
      item.lifespan = 0;
    });

    // Set world bounds
    this.boundaryX = 1600;
    this.boundaryY = 1600;
    this.physics.world.setBounds(0, 0, this.boundaryX, this.boundaryY);
    this.player.setCollideWorldBounds();

    // Init camera
    this.cameras.main.startFollow(this.player).setZoom(2);
    this.cameras.main.setBounds(0, 0, this.boundaryX, this.boundaryY);

    // Init cursors
    this.cursors = this.input.keyboard.addKeys({
      inventory: Phaser.Input.Keyboard.KeyCodes.ESC,
      interact: Phaser.Input.Keyboard.KeyCodes.SPACE,
      up: Phaser.Input.Keyboard.KeyCodes.W,
      left: Phaser.Input.Keyboard.KeyCodes.A,
      down: Phaser.Input.Keyboard.KeyCodes.S,
      right: Phaser.Input.Keyboard.KeyCodes.D,
      upgrade: Phaser.Input.Keyboard.KeyCodes.U,
      hp: Phaser.Input.Keyboard.KeyCodes.H,
      sound: Phaser.Input.Keyboard.KeyCodes.P,
    });

    // Make event listeners
    this.events.on('dialogueEnd', () => {
      this.time.delayedCall(500, () => {
        this.dialogueInProgress = false;
      });
      this.player.canAttack = true;
      this.player.shooting = false;
      this.scene.resume();
    });

    this.events.on('startFight', () => {
      this.boss.startFight();
      this.bossMusic.play();
      this.cameras.main.shake(2000, 0.005);
      this.rightHand = new Boss(
        this,
        this.boss.x - 100,
        this.boss.y - 10,
        'bossfistright'
      ).setSize(50, 100);

      this.rightHand.play('rightHand');

      this.leftHand = new Boss(
        this,
        this.boss.x + 130,
        this.boss.y - 10,
        'bossfistleft'
      ).setSize(50, 100);

      this.leftHand.play('leftHand');

      this.bossGroup.add(this.rightHand);
      this.bossGroup.add(this.leftHand);

      this.leftHand.attack();
      this.rightHand.attack();
      // this.boss.laser();
    });

    this.events.on('startBoss', () => {
      this.time.delayedCall(1000, () => {
        console.log(`Starting boss`);
        this.boss.attack();
      });
    });

    this.events.on('rip', ({ hand }) => {
      this.handsKilled++;
      console.log(`${this.handsKilled} hands killed`);
      if (hand === 'left' && this.handsKilled !== 2) {
        console.log(`Lefty nooo!!`);
        playDialogue.call(this, this.rightHand, 'firstBossCutScene');
        this.rightHand.attackCD = 4000;
        this.rightHand.resetTime = 1500;
        this.rightHand.loadAttack = 500;
      } else if (hand === 'right' && this.handsKilled !== 2) {
        console.log(`Righty nooo! Grr. Me angry!`);
        playDialogue.call(this, this.rightHand, 'firstBossCutScene');
        this.leftHand.attackCD = 4000;
        this.leftHand.resetTime = 1500;
        this.leftHand.loadAttack = 500;
      }
      if (this.handsKilled === 2) {
        console.log(`Play body cinematic`);
        playDialogue.call(this, this.boss, 'firstBossCutScene');
        this.boss.setActive(true);
        this.boss.setVisible(true);
        this.boss.body.enable = true;
      }
    });
  }

  update(time, delta) {
    if (this.player.y < 940 && !this.bossCinematic) {
      this.player.setVelocityX(0);
      this.player.setVelocityY(0);
      this.dialogueInProgress = true;
      this.player.play('idleRight');
      this.cameras.main.shake(2000, 0.005);
      this.bossCinematic = true;

      this.player.flipX = !this.player.flipX;

      this.time.delayedCall(1000, () => {
        this.player.flipX = !this.player.flipX;
        this.player.flipX = !this.player.flipX;
        this.time.delayedCall(1000, () => {
          this.player.flipX = !this.player.flipX;
          playDialogue.call(this, this.boss, 'firstBossCutScene');
        });
      });
    }

    if (!this.dialogueInProgress) {
      this.player.update(this.cursors, time);

      if (this.cursors.upgrade.isDown) {
        // TODO: Remove this for production
        this.player.upgradeStats('msUp');
        this.player.damage += 60;
      }

      if (this.cursors.sound.isDown) {
        this.bossMusic.stop();
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
}
