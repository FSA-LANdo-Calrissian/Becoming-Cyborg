import Enemy from '../entity/Enemy';

export function testFunc() {
  this.enemiesKilled = 0;

  this.scene.wolf1 = new Enemy(
    this.scene,
    this.scene.player.x + 30,
    this.scene.player.y + 30,
    'wolf',
    'animal'
  )
    .setScale(0.2)
    .setSize(45, 45);

  this.scene.wolf1.on('animationcomplete-death', () => {
    this.scene.events.emit('updateQuest-' + this.quest.key);
    this.scene.wolf1.removeAllListeners();
  });

  this.scene.wolf2 = new Enemy(
    this.scene,
    this.scene.player.x + 100,
    this.scene.player.y,
    'wolf',
    'animal'
  )
    .setScale(0.2)
    .setSize(45, 45);

  this.scene.wolf2.on('animationcomplete-death', () => {
    this.scene.events.emit('updateQuest-' + this.quest.key);
    this.scene.wolf2.removeAllListeners();
  });

  this.scene.wolf3 = new Enemy(
    this.scene,
    this.scene.player.x,
    this.scene.player.y + 300,
    'wolf',
    'animal'
  )
    .setScale(0.2)
    .setSize(45, 45);

  this.scene.wolf3.on('animationcomplete-death', () => {
    this.scene.events.emit('updateQuest-' + this.quest.key);
    this.scene.wolf3.removeAllListeners();
  });

  this.scene.enemiesGroup.add(this.scene.wolf1);
  this.scene.enemiesGroup.add(this.scene.wolf2);
  this.scene.enemiesGroup.add(this.scene.wolf3);
}

export function testFunc1() {
  this.enemiesKilled++;

  if (this.enemiesKilled === 3) {
    this.quest.objectiveReqs.enemiesCleared = true;
  }
}
