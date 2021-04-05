export function fireballQuestSetup() {
  this.alphaKilled = 0;
}

export function fireballQuestUpdate() {
  this.alphaKilled++;

  if (this.alphaKilled === 1) {
    this.quest.objectiveReqs.enemiesCleared = true;
  }
}
