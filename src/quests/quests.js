import Enemy from '../entity/Enemy';

function testFunc() {
  console.log(`Initializing quest tracker`);
  this.enemiesKilled = 0;
  console.log(
    `spawning 3 wolves at positions: `,
    this.scene.player.x + 30,
    this.scene.player.y + 30,
    '||',
    this.scene.player.x + 100,
    this.scene.player.y,
    '||',
    this.scene.player.x,
    this.scene.player.y + 300
  );

  this.scene.wolf1 = new Enemy(
    this.scene,
    this.scene.player.x + 30,
    this.scene.player.y + 30,
    'wolf',
    'animal',
    true
  )
    .setScale(0.2)
    .setSize(45, 45);

  this.scene.wolf2 = new Enemy(
    this.scene,
    this.scene.player.x + 100,
    this.scene.player.y,
    'wolf',
    'animal',
    true
  )
    .setScale(0.2)
    .setSize(45, 45);

  this.scene.wolf3 = new Enemy(
    this.scene,
    this.scene.player.x,
    this.scene.player.y + 300,
    'wolf',
    'animal',
    true
  )
    .setScale(0.2)
    .setSize(45, 45);

  this.scene.enemiesGroup.add(this.scene.wolf1);
  this.scene.enemiesGroup.add(this.scene.wolf2);
  this.scene.enemiesGroup.add(this.scene.wolf3);
}

function testFunc1() {
  this.enemiesKilled++;
  console.log(
    `Updating quest tracker. Currently ${this.enemiesKilled} have been killed. `
  );
  if (this.enemiesKilled === 3) {
    this.quest.objectiveReqs.enemiesCleared = true;
    console.log(
      `Setting objective to cleared.`,
      this.quest.objectiveReqs.enemiesCleared
    );
  }
}

const quests = {
  testQuest: {
    key: 'testQuest',
    title: 'Clear the mob',
    reward: ['iron', 'potion'],
    description:
      'A quest to clear the big bad wolves from the city so that the little piggy next door can go to the market in peace.',
    objectiveReqs: {
      enemiesCleared: false,
    },
    isStarted: false,
    setUp: [
      // TODO: Spawn some more wolves in the area once I get proper coordinates.
      testFunc,
    ],

    update: [testFunc1],
    NPC: 'player',
    completionNPC: 'player',
    isCompleted: false,
    requirements: false,
  },
};

export default quests;
