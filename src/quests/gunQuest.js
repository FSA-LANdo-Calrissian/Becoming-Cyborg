import Item from '../entity/Item';
import Enemy from '../entity/Enemy';

export function gunQuestSetup(bite) {
  this.scene.alphaWolf = new Enemy(
    this.scene,
    1731.6386666666674,
    1989.4166666666633,
    'wolf',
    'animal',

    bite
  )
    .setScale(0.5)
    .setSize(45, 45)
    .setDepth(7);

  this.scene.wolf1 = new Enemy(
    this.scene,
    this.scene.alphaWolf.x + 30,
    this.scene.alphaWolf.y + 30,
    'wolf',
    'animal',

    bite
  )
    .setScale(0.3)
    .setSize(45, 45)
    .setDepth(7);

  this.scene.wolf2 = new Enemy(
    this.scene,
    this.scene.alphaWolf.x - 30,
    this.scene.alphaWolf.y - 30,
    'wolf',
    'animal',

    bite
  )
    .setScale(0.3)
    .setSize(45, 45)
    .setDepth(7);

  this.scene.wolf3 = new Enemy(
    this.scene,
    this.scene.alphaWolf.x + 60,
    this.scene.alphaWolf.y + 60,
    'wolf',
    'animal',

    bite
  )
    .setScale(0.3)
    .setSize(45, 45)
    .setDepth(7);

  this.scene.enemiesGroup.add(this.scene.wolf1);
  this.scene.enemiesGroup.add(this.scene.wolf2);
  this.scene.enemiesGroup.add(this.scene.wolf3);
  this.scene.enemiesGroup.add(this.scene.alphaWolf);
  this.scene.alphaWolf.health = 10;

  this.scene.wolf1.visible = false;
  this.scene.wolf1.setActive(false);

  this.scene.wolf2.visible = false;
  this.scene.wolf2.setActive(false);

  this.scene.wolf3.visible = false;
  this.scene.wolf3.setActive(false);

  this.scene.alphaWolf.visible = false;
  this.scene.alphaWolf.setActive(false);

  this.scene.alphaWolf.on('animationcomplete-death', () => {
    this.scene.events.emit('updateQuest-' + this.quest.key);
    this.scene.alphaWolf.removeAllListeners();
  });

  this.questItem = 0;

  this.scene.item = new Item(this.scene, 686.6386666666683, 902.25, 'robotPart')
    .setScale(0.3)
    .setDepth(7);

  this.scene.item.lifespan = Infinity;
  this.scene.itemsGroup.add(this.scene.item);
  this.scene.item.reset();
  // Adding event emitters on death for tracking purposes

  this.scene.physics.add.overlap(
    this.scene.player,
    this.scene.itemsGroup,
    () => {
      this.scene.events.emit('updateQuest-' + this.quest.key);
    }
  );
}

export function gunQuestUpdate() {
  /*
    Test quest's update function. Just increases the tracker on every death. Once all 3 die, it will set the cleared objective to true. The main point of this function is to keep track of all objectives and set them to true when completed. You can split this into one function for every objective, if you wish. Just make sure to pass them all into the update array in the quest object.
  */

  this.questItem++;

  if (this.questItem === 1) {
    this.quest.objectiveReqs.itemFetched = true;
  }
}
