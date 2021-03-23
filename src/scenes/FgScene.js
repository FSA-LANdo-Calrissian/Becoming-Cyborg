import Phaser from 'phaser';
import Player from '../entity/Player';
import Enemy from '../entity/Enemy';
import Projectile from '../entity/Projectile';
import createAnimations from '../animations/createAnimations';
import NPC from '../entity/NPC';

export default class FgScene extends Phaser.Scene {
  constructor() {
    super('FgScene');
    this.finishedTutorial = false;
    this.tutorialInProgress = false;

    // Bindings
    this.loadBullet = this.loadBullet.bind(this);
    this.damageEnemy = this.damageEnemy.bind(this);
  }

  openUpgrade() {
    /*
      Opens up the upgrade window for the player. Should only be accessed when player is at a workbench.
      No params
      returns null.
    */
    this.scene.transition({
      target: 'UpgradeUI',
      sleep: true,
      duration: 1000,
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

  addText(i) {
    /*
      Function to advance the current dialogue. Destroys the dialogue box and allows player to move again on completion of dialogue.
      param i: int -> The current index of the dialogue.
      returns null
    */

    // If the dialogue is over (index higher than length)
    if (i > this.textLines.length - 1) {
      // Destroy box + allow movement.
      this.textBox.destroy();
      this.tutorialInProgress = false;
      this.finishedTutorial = true;
      this.player.body.moves = true;
      this.player.canMelee = true;
      this.player.shooting = false;
      this.enemy.body.moves = true;
    }
    // Advance the dialogue (this will also allow
    // the text to be removed from screen)
    this.tutorialText.setText(this.textLines[i]);
    this.nameText.setText('');
  }

  playDialogue() {
    /*
      Tutorial dialogue. Contains the logic to advance through the dialogue on player clicking on the text.
      Can increase the click area by changing the setInteractive rectangle width/height.
      No params.
      Returns null.
    */

    // Make the text box
    this.textBox = this.add.image(
      this.player.x - 10,
      this.player.y + 50,
      'textBox'
    );
    this.textBox.setScale(0.09);
    // Lines to display in conversation.
    this.textLines = [
      'Halt human, stop right there!',
      'Name...?',
      'ID..?',
      '...',
      '"Just looking for directions" is not a valid response....',
      'What is that you are wearing human....?',
      'Please stand still as you are being scanned.....',
      'Scan Complete....',
      'Illegal Activity Detected...',
      'Where did you get these parts human...?',
      'Come with me human you are being detained for questioning.....',
      'Please do not resist....',
    ];

    // Initialize index.
    let i = 0;
    // Add text.
    this.tutorialText = this.add.text(
      this.textBox.x,
      this.textBox.y + 2,
      this.textLines[i],
      {
        fontSize: '.4',
        // fontFamily: 'Arial',
        align: 'left',
        wordWrap: { width: 199, useAdvancedWrap: true },
      }
    );
    this.tutorialText.setResolution(10);
    this.tutorialText.setScale(0.4).setOrigin(0.5);
    this.nameText = this.add
      .text(this.textBox.x - 33, this.textBox.y - 8, 'Mr. Robot')
      .setResolution(10)
      .setScale(0.23)
      .setOrigin(0.5);

    // Add click area to advance text. Change the numbers after
    // the tutorialText width/height in order to increase click
    // area.
    this.tutorialText.setInteractive(
      new Phaser.Geom.Rectangle(
        0,
        0,
        this.tutorialText.width + 15,
        this.tutorialText.height + 30
      ),
      Phaser.Geom.Rectangle.Contains
    );

    // Emit this so that the text doesn't show up on minimap
    this.events.emit('dialogue');

    // Freeze enemy and player movement.
    this.player.body.moves = false;
    this.player.shooting = true;
    this.player.canMelee = false;
    this.enemy.body.moves = false;

    // Add the listener for mouse click.
    this.tutorialText.on('pointerdown', () => {
      this.addText(i);
      i++;
    });
  }

  damageEnemy(enemy, source) {
    /*
      Logic to damage enemy. Checks if enemy isn't dead and if whatever is doing the damage is active before doing damage.

      param enemy: object -> enemy that's being damaged
      param projectile: object -> Thing doing the damage (must have the this.damage property on it)
      returns null.
    */

    console.log('enemy taking damage');

    enemy.takeDamage(source.damage / 60);
    console.log(enemy.health);

    // if (enemy.active === true && projectile.active === true) {
    //   projectile.destroy();

    //   enemy.takeDamage(projectile.damage);
    // }
  }

  create(data) {
    // Initializing the game.
    this.finishedTutorial = false;
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
    this.player = new Player(this, 38, 23, 'player', this.loadBullet).setScale(
      0.3
    );
    this.enemy = new Enemy(this, 473, 176, 'enemy').setScale(0.4);

    this.npc = new NPC(this, 90, 50, 'player').setScale(0.3);

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

    this.npcGroup = this.physics.add.group({
      classType: NPC,
      runChildUpdate: true,
    });

    this.npcGroup.add(this.npc);

    // Collision logic
    this.physics.add.collider(this.player, this.worldLayer1);
    this.physics.add.overlap(this.player, this.enemy, () => {
      this.player.takeDamage(10, this.gg);
    });

    this.physics.add.overlap(this.player, this.npcGroup, (player, npc) => {
      npc.displayTooltip();
    });

    this.physics.add.overlap(
      this.enemy,
      this.playerProjectiles,
      this.damageEnemy
    );

    this.physics.add.collider(this.enemy, this.worldLayer1);

    // Camera logic
    this.camera = this.cameras.main;
    this.camera.setZoom(4.5);
    this.camera.setBounds(0, 0, 1025, 768);
    this.camera.startFollow(this.player);

    // Keymapping
    this.cursors = this.input.keyboard.addKeys({
      up: Phaser.Input.Keyboard.KeyCodes.W,
      left: Phaser.Input.Keyboard.KeyCodes.A,
      down: Phaser.Input.Keyboard.KeyCodes.S,
      right: Phaser.Input.Keyboard.KeyCodes.D,
      // TODO: Remove this
      hp: Phaser.Input.Keyboard.KeyCodes.H,
      speed: Phaser.Input.Keyboard.KeyCodes.I,
      upgrade: Phaser.Input.Keyboard.KeyCodes.U,
    });

    // Adding world boundaries
    // TODO: Fix world boundary when we finish tileset
    this.physics.world.setBounds(0, 0, 1024, 768);
    this.player.setCollideWorldBounds();
    this.enemy.setCollideWorldBounds();
    createAnimations.call(this);

    this.events.on('transitioncomplete', (fromScene) => {
      this.scene.wake();
    });
    // data.choice is only available when player restarts game.
    if (data.choice) {
      this.scene.restart({ choice: false });
      const main = this.scene.get('MainScene');
      main.scene.restart({ choice: false });
    }
  }

  update(time, delta) {
    // Tutorial logic - if player hasn't talked to enemy robot
    // yet and is within a range of 51 of the robot, initialize
    // talking.
    if (
      !this.tutorialInProgress &&
      !this.finishedTutorial &&
      Phaser.Math.Distance.Between(
        this.player.x,
        this.player.y,
        this.enemy.x,
        this.enemy.y
      ) < 51
    ) {
      this.tutorialInProgress = true;
      // stop animations
      this.player.play(
        this.player.facingRight ? 'idleRight' : 'idleLeft',
        true
      );
      this.playDialogue();
    }

    // If not in dialogue, allow player to move with cursors.
    if (!this.tutorialInProgress) {
      this.player.update(this.cursors, time);
      this.enemy.update(this.player);

      if (this.cursors.upgrade.isDown) {
        this.openUpgrade();
      }
      if (this.cursors.hp.isDown) {
        // Press h button to see stats.
        console.log(
          `Current health: ${this.player.health}/${this.player.maxHealth}`
        );
        console.log(`Current move speed: ${this.player.speed}`);
        console.log(`Current armor: ${this.player.armor}`);
        console.log(`Current regen: ${this.player.regen}`);
      }
    }

    if (
      this.player.isMelee &&
      Phaser.Math.Distance.Between(
        this.player.x,
        this.player.y,
        this.enemy.x,
        this.enemy.y
      ) <= 16 &&
      ((this.player.x < this.enemy.x && this.player.facingRight === true) ||
        (this.player.x > this.enemy.x && this.player.facingRight === false))
    ) {
      this.damageEnemy(this.enemy, this.player);
    }
  }
}
