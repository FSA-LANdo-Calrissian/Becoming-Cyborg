import quests from '../quests/quests';
import Item from '../entity/Item';
import { playDialogue } from '../scenes/cutscenes/cutscenes';

export default class Quest {
  constructor(scene, questKey, npc) {
    this.scene = scene;
    this.quest = quests[questKey];
    this.npc = npc;
  }

  startQuest() {
    /*
      This currently runs the instant you talk to the npc -  before dialogue is over
    */

    this.quest.setUp.forEach((func) => {
      func.call(this);
    });
    this.quest.isStarted = true;
    this.scene.events.on('updateQuest-' + this.quest.key, () => {
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
      playDialogue.call(this.scene, this.npc, this.npc.name);
      this.giveReward();
    } else {
      playDialogue.call(this.scene, this.npc, this.npc.name, {
        killed: this.enemiesKilled,
      });
    }
  }

  giveReward() {
    const rewards = this.quest.reward;
    const player = this.scene.player;
    const missingHealth = player.maxHealth - player.health;
    rewards.forEach((item) => {
      if (item === 'iron') {
        player.inventory.iron += 50;
      } else if (item === 'potion') {
        if (missingHealth > 10) {
          player.health += 10;
        } else if (missingHealth <= 10 && missingHealth !== 0) {
          player.health = player.maxHealth;
        } else {
          const drop = new Item(
            this.scene,
            player.x + Math.random() * 5,
            player.y + Math.random() * 5,
            'potion'
          ).setScale(0.1);
          this.scene.itemsGroup.add(drop);
          drop.reset();
        }
      }
    });

    this.quest.isCompleted = true;
  }

  updateReq() {
    this.quest.update.forEach((func) => {
      func.call(this);
    });
  }
}
