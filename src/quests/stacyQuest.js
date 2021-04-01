import Enemy from '../entity/Enemy';

export function stacyQuestSetUp() {
  /*
    Setting up main quest for Robot City Scene. Will spawn 15 big robots in the city that will be tracked. Player will need to kill at least 10.
  */

  // Initializing the tracker
  this.enemiesKilled = 0;

  //Spawning the robots
  this.scene.robot1 = new Enemy(1136, 896, 'meleeRobot', 'robot').setScale(0.6);

  this.scene.robot2 = new Enemy(1104, 1056, 'meleeRobot', 'robot').setScale(
    0.6
  );

  this.scene.robot3 = new Enemy(1456, 864, 'meleeRobot', 'robot').setScale(0.6);

  this.scene.robot4 = new Enemy(1504, 784, 'meleeRobot', 'robot').setScale(0.6);

  this.scene.robot5 = new Enemy(1232, 720, 'meleeRobot', 'robot').setScale(0.6);

  this.scene.robot6 = new Enemy(1056, 784, 'meleeRobot', 'robot').setScale(0.6);

  this.scene.robot7 = new Enemy(816, 944, 'meleeRobot', 'robot').setScale(0.6);

  this.scene.robot8 = new Enemy(1216, 1184, 'meleeRobot', 'robot').setScale(
    0.6
  );

  this.scene.robot9 = new Enemy(1552, 1072, 'meleeRobot', 'robot').setScale(
    0.6
  );

  this.scene.robot10 = new Enemy(1408, 960, 'meleeRobot', 'robot').setScale(
    0.6
  );

  this.scene.robot11 = new Enemy(1648, 608, 'meleeRobot', 'robot').setScale(
    0.6
  );

  this.scene.robot12 = new Enemy(864, 800, 'meleeRobot', 'robot').setScale(0.6);

  this.scene.robot13 = new Enemy(816, 1104, 'meleeRobot', 'robot').setScale(
    0.6
  );

  //Adding to group
  this.scene.enemiesGroup.add(this.scene.robot1);
  this.scene.enemiesGroup.add(this.scene.robot2);
  this.scene.enemiesGroup.add(this.scene.robot3);
  this.scene.enemiesGroup.add(this.scene.robot4);
  this.scene.enemiesGroup.add(this.scene.robot5);
  this.scene.enemiesGroup.add(this.scene.robot6);
  this.scene.enemiesGroup.add(this.scene.robot7);
  this.scene.enemiesGroup.add(this.scene.robot8);
  this.scene.enemiesGroup.add(this.scene.robot9);
  this.scene.enemiesGroup.add(this.scene.robot10);
  this.scene.enemiesGroup.add(this.scene.robot11);
  this.scene.enemiesGroup.add(this.scene.robot12);
  this.scene.enemiesGroup.add(this.scene.robot13);

  // Adding event emitters on death for tracking purposes
  this.scene.robot1.on('animationcomplete-death', () => {
    /*
      This will emit the updateQuest- with the quest key to tell the right quest to run its update function. It is very important that you use the quest key or else it will activate all quest updates at once.
    */
    this.scene.events.emit('updateQuest-' + this.quest.key);
    this.scene.robot1.removeAllListeners();
  });

  this.scene.robot2.on('animationcomplete-death', () => {
    this.scene.events.emit('updateQuest-' + this.quest.key);
    this.scene.robot2.removeAllListeners();
  });

  this.scene.robot3.on('animationcomplete-death', () => {
    this.scene.events.emit('updateQuest-' + this.quest.key);
    this.scene.robot3.removeAllListeners();
  });

  this.scene.robot4.on('animationcomplete-death', () => {
    this.scene.events.emit('updateQuest-' + this.quest.key);
    this.scene.robot4.removeAllListeners();
  });

  this.scene.robot5.on('animationcomplete-death', () => {
    this.scene.events.emit('updateQuest-' + this.quest.key);
    this.scene.robot5.removeAllListeners();
  });

  this.scene.robot6.on('animationcomplete-death', () => {
    this.scene.events.emit('updateQuest-' + this.quest.key);
    this.scene.robot6.removeAllListeners();
  });

  this.scene.robot7.on('animationcomplete-death', () => {
    this.scene.events.emit('updateQuest-' + this.quest.key);
    this.scene.robot7.removeAllListeners();
  });

  this.scene.robot8.on('animationcomplete-death', () => {
    this.scene.events.emit('updateQuest-' + this.quest.key);
    this.scene.robot8.removeAllListeners();
  });

  this.scene.robot9.on('animationcomplete-death', () => {
    this.scene.events.emit('updateQuest-' + this.quest.key);
    this.scene.robot9.removeAllListeners();
  });

  this.scene.robot10.on('animationcomplete-death', () => {
    this.scene.events.emit('updateQuest-' + this.quest.key);
    this.scene.robot10.removeAllListeners();
  });

  this.scene.robot11.on('animationcomplete-death', () => {
    this.scene.events.emit('updateQuest-' + this.quest.key);
    this.scene.robot11.removeAllListeners();
  });

  this.scene.robot12.on('animationcomplete-death', () => {
    this.scene.events.emit('updateQuest-' + this.quest.key);
    this.scene.robot12.removeAllListeners();
  });

  this.scene.robot13.on('animationcomplete-death', () => {
    this.scene.events.emit('updateQuest-' + this.quest.key);
    this.scene.robot13.removeAllListeners();
  });
}

export function stacyQuestUpdate() {
  /*
    Stacy quest update function. Increases the kill tracker on big robot death. Once 10 are killed, objective will be completed.
  */
  this.enemiesKilled++;

  if (this.eneimesKilled >= 10) {
    this.quest.objectiveReqs.enemiesCleared = true;
  }
}
