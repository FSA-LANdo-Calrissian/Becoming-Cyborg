import Enemy from '../entity/Enemy';

export function gunQuestSetup() {
  /*
    The set up function for my test quest. I will use this as the backbone to set up future quests. All this does is spawn the monsters and initialize the tracking system for the quest. The "this" context is the quest class itself. If you want to access the scene, do so with this.scene and if you want to access the quest object, use this.quest.
  */

  // Initializing the tracker
  this.iron = 0;
  console.log(this.scene.player.inventory.iron);

  // Spawning the enemies
  this.scene.robot1 = new Enemy(
    this.scene,
    845.9719999999984,
    1038.583333333334,
    'meleeRobot',
    'robot'
  )
    .setScale(0.2)
    .setSize(45, 45);

  // this.scene.wolf2 = new Enemy(
  //   this.scene,
  //   this.scene.player.x + 100,
  //   this.scene.player.y,
  //   'wolf',
  //   'animal'
  // )
  //   .setScale(0.2)
  //   .setSize(45, 45);

  // this.scene.wolf3 = new Enemy(
  //   this.scene,
  //   this.scene.player.x,
  //   this.scene.player.y + 300,
  //   'wolf',
  //   'animal'
  // )
  //   .setScale(0.2)
  //   .setSize(45, 45);

  // Adding to group
  this.scene.enemiesGroup.add(this.scene.robot1);
  // this.scene.enemiesGroup.add(this.scene.wolf2);
  // this.scene.enemiesGroup.add(this.scene.wolf3);

  // Adding event emitters on death for tracking purposes
  this.scene.robot1.on('animationcomplete-death', () => {
    /*
      This will emit the updateQuest- with the quest key to tell the right quest to run its update function. It is very important that you use the quest key or else it will activate all quest updates at once.
    */
    this.scene.events.emit('updateQuest-' + this.quest.key);
    this.scene.robot1.removeAllListeners();
  });

  //   this.scene.wolf2.on('animationcomplete-death', () => {
  //     this.scene.events.emit('updateQuest-' + this.quest.key);
  //     this.scene.wolf2.removeAllListeners();
  //   });

  //   this.scene.wolf3.on('animationcomplete-death', () => {
  //     this.scene.events.emit('updateQuest-' + this.quest.key);
  //     this.scene.wolf3.removeAllListeners();
  //   });
}

export function gunQuestUpdate() {
  /*
    Test quest's update function. Just increases the tracker on every death. Once all 3 die, it will set the cleared objective to true. The main point of this function is to keep track of all objectives and set them to true when completed. You can split this into one function for every objective, if you wish. Just make sure to pass them all into the update array in the quest object.
  */

  console.log(this.iron);
  this.enemiesKilled++;

  if (this.enemiesKilled === 3) {
    this.quest.objectiveReqs.enemiesCleared = true;
  }
}
