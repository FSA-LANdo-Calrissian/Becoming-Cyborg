import Enemy from '../entity/Enemy';

export function fireballQuestSetup() {
  this.alphaKilled = 0;

  this.scene.alphaWolf = new Enemy(
    this.scene,
    1731.6386666666674,
    1989.4166666666633,
    'wolf',
    'animal'
  )
    .setScale(0.5)
    .setSize(45, 45);

  this.scene.wolf1 = new Enemy(
    this.scene,
    this.scene.alphaWolf.x + 30,
    this.scene.alphaWolf.y + 30,
    'wolf',
    'animal'
  )
    .setScale(0.3)
    .setSize(45, 45);

  this.scene.wolf2 = new Enemy(
    this.scene,
    this.scene.alphaWolf.x - 30,
    this.scene.alphaWolf.y - 30,
    'wolf',
    'animal'
  )
    .setScale(0.3)
    .setSize(45, 45);

  this.scene.wolf3 = new Enemy(
    this.scene,
    this.scene.alphaWolf.x + 60,
    this.scene.alphaWolf.y + 60,
    'wolf',
    'animal'
  )
    .setScale(0.3)
    .setSize(45, 45);

  this.scene.enemiesGroup.add(this.scene.wolf1);
  this.scene.enemiesGroup.add(this.scene.wolf2);
  this.scene.enemiesGroup.add(this.scene.wolf3);
  this.scene.enemiesGroup.add(this.scene.alphaWolf);
  this.scene.alphaWolf.health = 10;

  // Adding event emitters on death for tracking purposes

  this.scene.alphaWolf.on('animationcomplete-death', () => {
    this.scene.events.emit('updateQuest-' + this.quest.key);
    this.scene.alphaWolf.removeAllListeners();
  });
}

export function fireballQuestUpdate() {
  this.alphaKilled++;

  if (this.alphaKilled === 1) {
    this.quest.objectiveReqs.enemiesCleared = true;
  }
}
