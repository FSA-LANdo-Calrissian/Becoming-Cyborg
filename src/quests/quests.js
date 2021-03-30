import { testFunc, testFunc1 } from './testQuest';
import { secondTestSetUp, secondTestUpdate } from './secondTestQuest';

/*
  This quests object is a giant object of key: object pairs. The key needs to be the key for your quest. This is what is grabbed and used throughout the quest logic - including the name of your NPC, so it must be unique.

  The corresponding value pair needs to be an object with the keys:
      key, title, reward, description, objectiveReqs, isStarted, setUp, update, isCompleted, requirements
  It is case sensitive. Description, title, and requirements are not yet implemented in the quest logic but should be added in anyway.
*/
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
