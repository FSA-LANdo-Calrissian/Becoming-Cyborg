export function fireballQuestSetup() {
  console.log('wolves created');
  this.alphaKilled = 0;
  if (this.scene.wolf1 && this.scene.sendInWolves) {
    this.scene.wolf1.visible = true;
    this.scene.wolf1.setActive(true);
  }
  if (this.scene.wolf2 && this.scene.sendInWolves) {
    this.scene.wolf2.visible = true;
    this.scene.wolf2.setActive(true);
  }

  if (this.scene.wolf3 && this.scene.sendInWolves) {
    this.scene.wolf3.visible = true;
    this.scene.wolf3.setActive(true);
  }
  if (this.scene.alphaWolf && this.scene.sendInWolves) {
    this.scene.alphaWolf.visible = true;
    this.scene.alphaWolf.setActive(true);

    this.scene.alphaWolf.on('animationcomplete-death', () => {
      this.scene.events.emit('updateQuest-' + this.quest.key);
      this.scene.alphaWolf.removeAllListeners();
    });
  }

  // Adding event emitters on death for tracking purposes
}

export function fireballQuestUpdate() {
  this.alphaKilled++;

  if (this.alphaKilled === 1) {
    this.quest.objectiveReqs.enemiesCleared = true;
  }
}
