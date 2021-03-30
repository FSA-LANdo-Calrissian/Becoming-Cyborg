import quests from '../quests/quests';

export default class Quest {
  constructor(scene, questKey) {
    this.scene = scene;
    this.quest = quests[questKey];
  }

  startQuest() {
    /*
      This currently runs the instant you talk to the npc -  before dialogue is over
    */
    this.quest.setUp.forEach((func) => {
      func.call(this);
    });
    this.quest.isStarted = true;
    this.scene.events.on('updateQuest', () => {
      console.log(`Enemy killed. Sending to quest update`);
      this.updateReq();
    });
  }

  objectiveChecker() {
    for (let keys of Object.keys(this.quest.objectiveReqs)) {
      if (!this.quest.objectiveReqs[keys]) {
        return false;
      }
      return true;
    }
  }

  completeQuest() {
    const isCleared = this.objectiveChecker();
    if (isCleared) {
      console.log(`Quest completed! Handing reward...`);
      this.giveReward();
    } else {
      console.log(`Objective incomplete`);
    }
  }

  giveReward() {
    console.log(`Reward given`);
    this.quest.isCompleted = true;
  }

  updateReq() {
    this.quest.update.forEach((func) => {
      func.call(this);
    });
  }
}
