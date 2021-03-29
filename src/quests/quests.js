const quests = {
  testQuest: {
    key: 'testQuest',
    title: 'Clear the mob',
    reward: ['iron', 'potion'],
    description:
      'A quest to clear the remaining wolves from the city so that the little piggy next door can go to the market in peace.',
    objectiveReqs: {
      enemiesCleared: false,
    },
    setUp: {
      // TODO: Spawn some more wolves in the area once I get proper coordinates.
    },
    NPC: 'player',
    completionNPC: 'player',
    isCompleted: false,
    requirements: false,
  },
};

export default quests;
