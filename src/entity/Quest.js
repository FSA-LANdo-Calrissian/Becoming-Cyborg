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
      This currently runs the instant you talk to the npc -  before dialogue is over. This function starts the quest. It's based on the setUp array in the quest object, meaning the setup is user defined.
      Takes nothing, returns nothing.
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
    /*
      Checks to see if all the requirements in objectiveReqs key of the quest object is set to true. If one is false, will return false, indicating that the quest isn't done yet.
      Takes nothing, returns bool
    */
    for (let keys of Object.keys(this.quest.objectiveReqs)) {
      console.log(keys, this.quest.objectiveReqs[keys]);
      if (!this.quest.objectiveReqs[keys]) {
        return false;
      }
      return true;
    }
  }

  completeQuest() {
    /*
      Checks to see if quest is completed. If it is, calls the completion scene and gives you your reward. If not, plays the quest incomplete cutscene.
    */
    const isCleared = this.objectiveChecker();
    if (isCleared) {
      console.log('cleared giving reward');
      playDialogue.call(this.scene, this.npc, this.npc.name);
      this.giveReward();
    } else {
      console.log('not cleared');
      playDialogue.call(this.scene, this.npc, this.npc.name, {
        killed: this.enemiesKilled,
      });
    }
  }

  giveReward() {
    /*
      Loops through the reward key in your quest object and gives player those rewards. Currently only iron and potion are implemented. Others will need to be added on themselves.
      Takes nothing, returns nothing.
    */
    const rewards = this.quest.reward;
    const player = this.scene.player;
    const missingHealth = player.maxHealth - player.health;

    player.upgrade.points += 2;

    rewards.forEach((item) => {
      console.log(item);
      if (item === 'iron') {
        player.inventory.iron += 5;
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
      } else if (item === 'oil') {
        player.inventory.oil += 5;
      } else if (item === 'clearanceChip') {
        player.inventory.clearanceChip += 1;
      } else if (item === 'fireballAttachment') {
        console.log('heres fireball');
        player.inventory.fireballAttachment += 1;
        this.quest.isCompleted = true;
      } else if (item === 'gunAttachment') {
        player.inventory.gunAttachment += 1;
        this.quest.isCompleted = true;
      }
    });

    this.quest.isCompleted = true;
  }

  updateReq() {
    /*
      Updates your quest based on your update key in the quest object. Runs every function in that array.
    */
    this.quest.update.forEach((func) => {
      func.call(this);
    });
  }
}
