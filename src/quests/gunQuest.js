import Item from '../entity/Item';

export function gunQuestSetup() {
  /*
    The set up function for my test quest. I will use this as the backbone to set up future quests. All this does is spawn the monsters and initialize the tracking system for the quest. The "this" context is the quest class itself. If you want to access the scene, do so with this.scene and if you want to access the quest object, use this.quest.
  */

  // Initializing the tracker

  this.questItem = 0;
  // Spawning the enemies
  this.scene.item = new Item(
    this.scene,
    686.6386666666683,
    902.25,
    'robotPart'
  ).setScale(0.1);

  // Adding event emitters on death for tracking purposes

  this.scene.itemsGroup.add(this.scene.item);
  this.scene.item.reset();

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
    this.quest.objectiveReqs.enemiesCleared = true;
  }
}
