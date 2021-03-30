import Phaser from 'phaser';
import Player from '../entity/Player';
import Enemy from '../entity/Enemy';
import Projectile from '../entity/Projectile';
import createAnimalAnims from '../animations/createAnimalAnims';
import createPlayerAnims from '../animations/createPlayerAnims';
import createRobotAnims from '../animations/createRobotAnims';
import createNPCAnims from '../animations/createNPCAnims';
import createWorldAnims from '../animations/createWorldAnims';
import NPC from '../entity/NPC';
import UpgradeStation from '../entity/UpgradeStation';
import Item from '../entity/Item';
import Quest from '../entity/Quest';
import quests from '../quests/quests';
import {
  initCutScene,
  playCutScene,
  robotKilled,
  playDialogue,
} from './cutscenes/cutscenes';

export default class FgScene extends Phaser.Scene {
  constructor() {
    super('FgScene');
    this.finishedTutorial = false;
    this.dialogueInProgress = false;
    this.initTutorial = false;
    this.upgradeOpened = false;
    this.allowUpgrade = false;

    // Bindings
    this.loadBullet = this.loadBullet.bind(this);
    this.damageEnemy = this.damageEnemy.bind(this);
  }
  openInventory() {
    this.dialogueInProgress = true;
    this.scene.transition({
      target: 'Inventory',
      sleep: true,
      duration: 10,
      data: { player: this.player, camera: this.camera },
    });
  }
  openUpgrade() {
    /*
      Opens up the upgrade window for the player. Should only be accessed when player is at a workbench.
      No params
      returns null.
    */
    this.dialogueInProgress = true;
    this.scene.transition({
      target: 'UpgradeUI',
      sleep: true,
      duration: 10,
      data: { player: this.player },
    });
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
    bullet.shoot(x, y, angle);
  }

  damageEnemy(enemy, source) {
    /*
      Logic to damage enemy. Checks if enemy isn't dead and if whatever is doing the damage is active before doing damage.

      param enemy: object -> enemy that's being damaged
      param projectile: object -> Thing doing the damage (must have the this.damage property on it)
      returns null.
    */

    enemy.takeDamage(source.damage / 60);

    // if (enemy.active === true && projectile.active === true) {
    //   projectile.destroy();

    //   enemy.takeDamage(projectile.damage);
    // }
  }

  create(data) {
    //Creating animations
    createWorldAnims.call(this);
    createPlayerAnims.call(this);
    createNPCAnims.call(this);
    createRobotAnims.call(this);
    createAnimalAnims.call(this);

    // Initializing the game.
    this.finishedTutorial = false;
    this.dialogueInProgress = false;
    this.initTutorial = false;
    this.upgradeOpened = false;
    this.allowUpgrade = false;
    this.cameras.main.fadeIn(2000, 0, 0, 0);
    this.gg = this.sound.add('gg');

    //Load in map stuff
    this.map = this.make.tilemap({ key: 'map' });

    this.darkGrass = this.map.addTilesetImage('forest', 'forest');

    this.grassAndBuildings = this.map.addTilesetImage(
      'apocalypse',
      'apocalypse'
    );

    this.belowLayer1 = this.map.createLayer('ground', this.darkGrass, 0, 0);

    this.worldLayer1 = this.map.createLayer(
      'above-ground',
      this.grassAndBuildings,
      0,
      0
    );

    this.worldLayer1.setCollisionByProperty({ collides: true });

    // Show debug collisions on the map.
    const debugGraphics = this.add.graphics().setAlpha(0.75);
    this.worldLayer1.renderDebug(debugGraphics, {
      tileColor: null, // Color of non-colliding tiles
      collidingTileColor: new Phaser.Display.Color(243, 134, 48, 255), // Color of colliding tiles
      faceColor: new Phaser.Display.Color(40, 39, 37, 255), // Color of colliding face edges
    });

    // Spawning the entities
    this.upgradeStation = new UpgradeStation(this, 357, 257, 'upgradeStation')
      .setScale(0.3)
      .setSize(10, 10);

    this.player = new Player(this, 38, 23, 'player', this.loadBullet)
      .setScale(0.3)
      .setSize(30, 35)
      .setOffset(10, 12);

    this.enemy = new Enemy(this, 473, 176, 'meleeRobot', 'robot')
      .setScale(0.4)
      .setSize(38, 35)
      .setOffset(5);

    this.wolf = new Enemy(this, 38, 388, 'wolf', 'animal')
      .setScale(0.2)
      .setSize(45, 45);

    this.doctor = new NPC(this, 473, 190, 'drDang').setScale(0.3);

    this.deadNPC = new NPC(this, 453, 176, 'mac').setScale(0.3);
    this.startingNPC = new NPC(this, 196, 155, 'tutorialNPC')
      .setScale(0.3)
      .setDepth(1);

    this.questNPC = new NPC(this, 90, 30, 'player')
      .setScale(0.3)
      .setSize(30, 35)
      .setOffset(10, 12)
      .setName('testQuest');

    this.questNPC2 = new NPC(this, 150, 30, 'mac')
      .setScale(0.3)
      .setName('secondTestQuest');

    // Groups
    this.playerProjectiles = this.physics.add.group({
      classType: Projectile,
      runChildUpdate: true,
      maxSize: 30,
    });
    this.enemyProjectiles = this.physics.add.group({
      classType: Projectile,
      runChildUpdate: true,
      maxSize: 30,
    });

    this.enemiesGroup = this.physics.add.group({
      classType: Enemy,
      runChildUpdate: true,
      collideWorldBounds: true,
    });

    this.npcGroup = this.physics.add.group({
      classType: NPC,
      runChildUpdate: true,
    });

    this.itemsGroup = this.physics.add.group({
      classType: Item,
      runChildUpdate: true,
    });

    // Adding entities to groups
    this.npcGroup.add(this.doctor);
    this.npcGroup.add(this.startingNPC);
    this.enemiesGroup.add(this.enemy);
    this.enemiesGroup.add(this.wolf);
    this.npcGroup.add(this.questNPC);
    this.npcGroup.add(this.questNPC2);

    // Collision logic
    this.physics.add.collider(this.player, this.worldLayer1);
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
    this.physics.add.overlap(
      this.player,
      this.enemiesGroup,
      (player, enemy) => {
        if (enemy.isMelee === true) {
          this.player.takeDamage(10, this.gg);
        }

        if (
          player.isMelee &&
          Phaser.Math.Distance.Between(player.x, player.y, enemy.x, enemy.y) <=
            16 &&
          ((this.player.x < enemy.x && this.player.facingRight === true) ||
            (this.player.x > enemy.x && this.player.facingRight === false))
        ) {
          this.damageEnemy(enemy, player);
        }
      }
    );

    this.physics.add.overlap(this.player, this.npcGroup, (player, npc) => {
      npc.displayTooltip();

      // Displays tooltip on overlap.
      if (
        npc.body.touching.none &&
        !this.dialogueInProgress &&
        this.cursors.interact.isDown
      ) {
        if (npc.name === '') {
          // BUG: Find out how to play dialogue based on NPC.
          // Or make list of generic text to pick from.
          playDialogue.call(this, npc, 'Dialogue');
        } else {
          if (!quests[npc.name].isStarted) {
            playDialogue.call(this, npc, npc.name);

            this[npc.name] = new Quest(this, npc.name, npc);
            this.events.on('startQuest', () => {
              this[npc.name].startQuest();
              this.events.removeListener('startQuest');
            });
          } else if (
            quests[npc.name].isStarted &&
            !quests[npc.name].isCompleted
          ) {
            this[npc.name].completeQuest();
          } else {
            playDialogue.call(this, npc, npc.name);
          }
        }
      }
    });

    this.physics.add.overlap(
      this.enemiesGroup,
      this.playerProjectiles,
      this.damageEnemy
    );

    this.physics.add.overlap(this.player, this.upgradeStation, () => {
      if (this.allowUpgrade) {
        this.upgradeStation.playAnim();
        if (!this.upgradeOpened) {
          this.upgradeOpened = true;
          this.time.delayedCall(4000, () => {
            this.openUpgrade();
          });
        }
      }
    });

    this.physics.add.collider(this.enemiesGroup, this.worldLayer1);

    // Adding world boundaries
    this.boundaryX = 600;
    this.boundaryY = 400;
    // TODO: Fix world boundary when we finish tileset
    this.physics.world.setBounds(0, 0, this.boundaryX, this.boundaryY);
    this.player.setCollideWorldBounds();
    this.enemy.setCollideWorldBounds();

    // Camera logic
    this.camera = this.cameras.main;
    this.camera.setZoom(4.4);
    this.camera.setBounds(0, 0, this.boundaryX, this.boundaryY);
    this.camera.startFollow(this.player);

    // Keymapping
    this.cursors = this.input.keyboard.addKeys({
      inventory: Phaser.Input.Keyboard.KeyCodes.ESC,
      interact: Phaser.Input.Keyboard.KeyCodes.SPACE,
      up: Phaser.Input.Keyboard.KeyCodes.W,
      left: Phaser.Input.Keyboard.KeyCodes.A,
      down: Phaser.Input.Keyboard.KeyCodes.S,
      right: Phaser.Input.Keyboard.KeyCodes.D,
      // TODO: Remove this
      hp: Phaser.Input.Keyboard.KeyCodes.H,
      speed: Phaser.Input.Keyboard.KeyCodes.I,
      upgrade: Phaser.Input.Keyboard.KeyCodes.U,
    });

    // Event emitters

    // Event listeners
    this.events.on('transitioncomplete', (fromScene) => {
      this.scene.wake();
      // If we're coming from the upgrade UI
      // Set upgradeOpened to false so we can get back into it
      switch (fromScene.scene.key) {
        case 'UpgradeUI':
          this.upgradeOpened = false;
          // Waiting to set dialogue in progress to false so you don't shoot when pressing Go Back
          this.time.delayedCall(500, () => {
            this.dialogueInProgress = false;
          });
          break;
        default:
          return;
      }
    });

    this.events.on('transitioncomplete', (fromScene) => {
      this.scene.wake();
      // If we're coming from the upgrade UI
      // Set upgradeOpened to false so we can get back into it
      switch (fromScene.scene.key) {
        case 'Inventory':
          this.upgradeOpened = false;
          // Waiting to set dialogue in progress to false so you don't shoot when pressing Go Back
          this.time.delayedCall(500, () => {
            this.dialogueInProgress = false;
          });
          break;
        default:
          return;
      }
    });

    this.scene.get('TutorialCutScene').events.on('tutorialPause', () => {
      this.scene.pause();
    });

    this.events.on('tutorialEnd', () => {
      this.time.delayedCall(500, () => {
        this.dialogueInProgress = false;
      });
      this.player.canAttack = true;
      this.player.shooting = false;
      this.enemy.body.moves = true;
      this.scene.resume();
    });

    this.enemy.on('animationcomplete-death', () => {
      this.cameras.main.fadeOut(1000);
      this.player.setPosition(450, 189);
      this.cameras.main.fadeIn(1000);
      robotKilled.call(this);
    });

    // data.choice is only available when player restarts game.
    if (data.choice) {
      this.scene.restart({ choice: false });
      const main = this.scene.get('MainScene');
      main.scene.restart({ choice: false });
    }

    // For debugging purposes to see pointer position
    //   this.input.on('pointerdown', (pointer) => {
    //     console.log(`pointer position: `, pointer.x, pointer.y);
    //   });
  }

  tutorialHelper(distance) {
    /*
      Method to help check whether or not to run tutorial.
      param distance: int -> Range to start check
      returns bool
    */

    return (
      !this.dialogueInProgress &&
      !this.finishedTutorial &&
      Phaser.Math.Distance.Between(
        this.player.x,
        this.player.y,
        this.enemy.x,
        this.enemy.y
      ) < distance
    );
  }

  update(time, delta) {
    if (this.cursors.inventory.isDown) {
      this.openInventory();
    }
    if (!this.finishedTutorial && !this.dialogueInProgress) {
      this.enemy.body.moves = false;
    }

    // If player in 150 range of enemy, play initial cutscene
    if (this.tutorialHelper(150)) {
      if (!this.initTutorial) {
        this.dialogueInProgress = true;
        // stop animations
        this.player.play(
          this.player.facingRight ? 'idleRight' : 'idleLeft',
          true
        );
        this.enemy.play('meleeRobotIdleLeft');
        const huh = this.add
          .sprite(this.player.x + 8, this.player.y - 8, '?')
          .setScale(0.015)
          .setAlpha(1, 1, 1, 1);
        this.time.delayedCall(1000, () => {
          huh.destroy();
        });
        initCutScene.call(this);
      }
    }

    // If player within 51 range, play tutorial scene.
    if (this.tutorialHelper(51)) {
      this.dialogueInProgress = true;
      // stop animations
      this.player.play(
        this.player.facingRight ? 'idleRight' : 'idleLeft',
        true
      );
      this.enemy.play('tutorial');
      playCutScene.call(this);
    }

    // If not in dialogue, allow player to move with cursors.
    if (!this.dialogueInProgress) {
      this.player.update(this.cursors, time);

      if (this.cursors.upgrade.isDown) {
        // TODO: Remove this for production
        this.openUpgrade();
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
        console.log(`Current enemy position: `, this.enemy.x, this.enemy.y);
        console.log(
          `Current camera position: `,
          this.cameras.main.scrollX,
          this.cameras.main.scrollY
        );
      }
    }
  }
}
