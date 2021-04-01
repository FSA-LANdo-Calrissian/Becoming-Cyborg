import Enemy from '../entity/Enemy';

export function secondTestSetUp() {
  this.enemiesKilled = 0;

  this.scene.wolf11 = new Enemy(
    this.scene,
    this.scene.player.x + 30,
    this.scene.player.y + 30,
    'meleeRobot',
    'animal'
  )
    .setScale(0.2)
    .setSize(45, 45);

  this.scene.wolf11.on('animationcomplete-death', () => {
    this.scene.events.emit('updateQuest-' + this.quest.key);
    this.scene.wolf11.removeAllListeners();
  });

  this.scene.wolf12 = new Enemy(
    this.scene,
    this.scene.player.x + 100,
    this.scene.player.y,
    'meleeRobot',
    'animal'
  )
    .setScale(0.2)
    .setSize(45, 45);

  this.scene.wolf12.on('animationcomplete-death', () => {
    this.scene.events.emit('updateQuest-' + this.quest.key);
    this.scene.wolf12.removeAllListeners();
  });

  this.scene.wolf13 = new Enemy(
    this.scene,
    this.scene.player.x,
    this.scene.player.y + 300,
    'meleeRobot',
    'animal'
  )
    .setScale(0.2)
    .setSize(45, 45);

  this.scene.wolf13.on('animationcomplete-death', () => {
    this.scene.events.emit('updateQuest-' + this.quest.key);
    this.scene.wolf13.removeAllListeners();
  });

  this.scene.wolf14 = new Enemy(
    this.scene,
    this.scene.player.x,
    this.scene.player.y + 310,
    'meleeRobot',
    'animal'
  )
    .setScale(0.2)
    .setSize(45, 45);

  this.scene.wolf14.on('animationcomplete-death', () => {
    this.scene.events.emit('updateQuest-' + this.quest.key);
    this.scene.wolf14.removeAllListeners();
  });

  this.scene.wolf15 = new Enemy(
    this.scene,
    this.scene.player.x,
    this.scene.player.y + 320,
    'meleeRobot',
    'animal'
  )
    .setScale(0.2)
    .setSize(45, 45);

  this.scene.wolf15.on('animationcomplete-death', () => {
    this.scene.events.emit('updateQuest-' + this.quest.key);
    this.scene.wolf15.removeAllListeners();
  });

  this.scene.enemiesGroup.add(this.scene.wolf11);
  this.scene.enemiesGroup.add(this.scene.wolf12);
  this.scene.enemiesGroup.add(this.scene.wolf13);
  this.scene.enemiesGroup.add(this.scene.wolf14);
  this.scene.enemiesGroup.add(this.scene.wolf15);
}

export function secondTestUpdate() {
  this.enemiesKilled++;

  if (this.enemiesKilled === 5) {
    this.quest.objectiveReqs.enemiesCleared = true;
  }
  console.log(this.quest.objectiveReqs.enemiesCleared);
}
