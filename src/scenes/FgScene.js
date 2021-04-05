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
import Collision from '../entity/Collision';

export default class FgScene extends Phaser.Scene {
  constructor() {
    super('FgScene');
    this.finishedTutorial = false;
    this.dialogueInProgress = false;
    this.initTutorial = false;
    this.upgradeOpened = false;
    this.allowUpgrade = false;
    this.sceneOver = false;
    this.key = 'FgScene';

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
      data: { player: this.player, camera: this.camera, scene: 'FgScene' },
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
      data: { player: this.player, scene: 'FgScene' },
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

    // If wrong texture, reset texture and size
    if (bullet && bullet.texture.key !== sprite) {
      const size = sprite === 'bullet' ? 9 : 20;
      bullet.setTexture(sprite);
      bullet.setSize(size, size);
    }

    // If none found, create it.
    if (!bullet) {
      bullet = new Projectile(this, x, y, sprite, angle)
        .setScale(0.5)
        .setDepth(7);
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

    enemy.takeDamage(this.player.damage);

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
    this.map = this.make.tilemap({ key: 'tutorialMap' });
    this.terrainTiles = this.map.addTilesetImage('terrain', 'terrain');
    this.worldTiles = this.map.addTilesetImage('worldTileset', 'worldTileset');
    this.groundBottom = this.map.createLayer(
      'ground-bottom',
      this.terrainTiles,
      0,
      0
    );
    this.groundMid = this.map.createLayer(
      'ground-mid',
      this.terrainTiles,
      0,
      0
    );
    this.groundTop = this.map.createLayer(
      'ground-top',
      this.terrainTiles,
      0,
      0
    );
    this.worldBottom = this.map.createLayer(
      'world-bottom',
      this.worldTiles,
      0,
      0
    );
    this.worldMid = this.map.createLayer('world-mid', this.worldTiles, 0, 0);
    this.worldTop = this.map.createLayer('world-top', this.worldTiles, 0, 0);
    this.worldAbove = this.map.createLayer(
      'world-above',
      this.worldTiles,
      0,
      0
    );
    this.worldCollision = this.map.createLayer(
      'collision',
      this.worldTiles,
      0,
      0
    );
    this.worldCollision.setCollisionByProperty({ collides: true });

    // Show debug collisions on the map.
    // const debugGraphics = this.add.graphics().setAlpha(0.75);
    // this.worldCollision.renderDebug(debugGraphics, {
    //   tileColor: null, // Color of non-colliding tiles
    //   collidingTileColor: new Phaser.Display.Color(243, 134, 48, 255), // Color of colliding tiles
    //   faceColor: new Phaser.Display.Color(40, 39, 37, 255), // Color of colliding face edges
    // });
    // debugGraphics.setDepth(10);

    // Load in audio
    this.bite = this.sound.add('bite', { loop: false });
    this.fireBall = this.sound.add('fireBall', { loop: false, volume: 0.1 });
    this.gun = this.sound.add('gun', { loop: false, volume: 0.03 });
    this.knife = this.sound.add('knife', { loop: false, volume: 0.2 });
    this.laser = this.sound.add('laser', { loop: false });
    this.punch = this.sound.add('punch', { loop: false, volume: 1.5 });
    this.scream = this.sound.add('scream', { loop: false });
    this.TutorialSceneMusic = this.sound.add('TutorialSceneMusic', {
      loop: true,
      volume: 0.1,
    });

    // Start playing scene scene music
    this.TutorialSceneMusic.play();

    // Spawning the entities
    this.upgradeStation = new UpgradeStation(this, 456, 936, 'upgradeStation')
      .setScale(0.5)
      .setSize(10, 10);

    this.player = new Player(
      this,
      1400,
      1300,
      'player',
      this.loadBullet,
      this.punch,
      this.knife,
      this.gun,
      this.fireBall
    )
      .setScale(0.5)
      .setSize(30, 30)
      .setOffset(10, 12);

    this.sceneEnd = new Collision(this, 1836, 1328, 'blank').setSize(10, 110);

    this.enemy = new Enemy(this, 1728, 1280, 'meleeRobot', 'robot')
      .setScale(0.6)
      .setSize(38, 35)
      .setOffset(5);

    this.doctor = new NPC(this, 1728, 1330, 'drDang').setScale(0.5).setDepth(7);

    this.deadNPC = new NPC(this, 1700, 1280, 'mac').setScale(0.5).setDepth(7);

    this.startingNPC = new NPC(this, 702, 515, 'tutorialNPC')
      .setScale(0.5)
      .setDepth(1);

    this.questNPC = new NPC(this, 1264, 992, 'bittenNPC')
      .setScale(0.5)
      .setSize(30, 35)
      .setOffset(10, 12)
      .setName('testQuest');

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
    this.npcGroup.add(this.startingNPC);
    this.enemiesGroup.add(this.enemy);
    this.npcGroup.add(this.questNPC);

    // Collision logic
    this.physics.add.collider(this.player, this.worldCollision);
    this.physics.add.overlap(this.player, this.sceneEnd, () => {
      if (this.allowUpgrade && !this.sceneOver) {
        this.sceneOver = true;
        this.cameras.main.fadeOut(1000);
        this.time.delayedCall(1000, () => {
          this.scene.stop('HUDScene');
          this.scene.transition({
            target: 'RobotCityScene',
            sleep: true,
            duration: 10,
            data: {
              player: this.player,
              camera: this.camera,
              scene: 'FgScene',
            },
          });
          this.scene.launch('HUDScene', { mainScene: 'RobotCityScene' });
        });
      }
    });
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
          this.player.takeDamage(enemy.damage, this.gg);
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
          // This else statement only runs if the npc was given a name.
          // NPCs are only given names if they're used for quests. So far.
          // If the quest hasn't been started yet
          if (!quests[npc.name].isStarted) {
            // Call the dialogue to start the quest
            playDialogue.call(this, npc, npc.name);

            // and initialize the quest.
            this[npc.name] = new Quest(this, npc.name, npc);

            // Start quest when dialogue is over.
            this.events.on('startQuest', () => {
              this[npc.name].startQuest();
              this.events.removeListener('startQuest');
            });
            // Otherwise, if quest is started, but reward hasn't been grabbed
            // yet...
          } else if (
            quests[npc.name].isStarted &&
            !quests[npc.name].isCompleted
          ) {
            // It will call the complete quest method for that quest.
            this[npc.name].completeQuest();
          } else {
            // If the reward was already grabbed, it will play the final
            // dialogue
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

    this.physics.add.collider(this.enemiesGroup, this.worldCollision);

    // Adding world boundaries
    this.boundaryX = 1840;
    this.boundaryY = 1840;
    // TODO: Fix world boundary when we finish tileset
    this.physics.world.setBounds(0, 0, this.boundaryX, this.boundaryY);
    this.player.setCollideWorldBounds();
    this.enemy.setCollideWorldBounds();

    // Camera logic
    this.camera = this.cameras.main;
    this.camera.setZoom(3);
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
      this.sceneOver = false;
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
      this.player.setPosition(1700, 1330);
      this.cameras.main.fadeIn(1000);
      robotKilled.call(this);
    });

    // data.choice is only available when player restarts game.
    if (data.choice) {
      this.scene.restart({ choice: false });
      const main = this.scene.get('MainScene');
      main.scene.restart({ choice: false });
    }

    // Setting depth of everything in scene
    this.groundBottom.setDepth(0);
    this.groundMid.setDepth(1);
    this.groundTop.setDepth(2);
    this.worldBottom.setDepth(3);
    this.worldMid.setDepth(4);
    this.worldTop.setDepth(5);
    this.worldAbove.setDepth(10);
    this.player.setDepth(8);
    this.enemiesGroup.setDepth(7);
    this.npcGroup.setDepth(7);
    this.itemsGroup.setDepth(7);
    this.playerProjectiles.setDepth(7);
    this.worldCollision.setDepth(10);
    this.upgradeStation.setDepth(7);
    this.sceneEnd.setDepth(12);
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
    if (this.tutorialHelper(210)) {
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
          .setAlpha(1, 1, 1, 1)
          .setDepth(7);
        this.time.delayedCall(1000, () => {
          huh.destroy();
        });
        initCutScene.call(this);
      }
    }

    // If player within 51 range, play tutorial scene.
    if (this.tutorialHelper(100)) {
      this.dialogueInProgress = true;
      // stop animations
      this.player.play(
        this.player.facingRight ? 'idleRight' : 'idleLeft',
        true
      );
      this.enemy.play('tutorial');
      playCutScene.call(this, 'TutorialCutScene');
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
