import { testFunc, testFunc1 } from './testQuest';
import { secondTestSetUp, secondTestUpdate } from './secondTestQuest';

const quests = {
  testQuest: {
    key: 'testQuest',
    title: 'Clear the mob', // Not yet implemented
    reward: ['iron', 'potion'],

    description:
      'A quest to clear the big bad wolves from the city so that the little piggy next door can go to the market in peace.', // not yet implemented
    objectiveReqs: {
      enemiesCleared: false,
    },
    isStarted: false,
    setUp: [testFunc],
    update: [testFunc1],
    isCompleted: false,
    requirements: false, // Not implemented yet
  },

  secondTestQuest: {
    key: 'secondTestQuest',
    title: 'idk',
    reward: ['iron', 'iron', 'potion', 'potion', 'potion', 'potion'],
    description: 'Idk. Just testing',
    objectiveReqs: {
      enemiesCleared: false,
    },
    isStarted: false,
    setUp: [secondTestSetUp],
    update: [secondTestUpdate],
    isCompleted: false,
    requirements: false,
  },
};

export default quests;
