const db = require('./database');

async function addTestData() {
  const docRef = db.collection('users').doc('alovelace');

  await docRef.set({
    first: 'Ada',
    last: 'Lovelace',
    born: 1815,
  });

  const aTuringRef = db.collection('users').doc('aturing');

  await aTuringRef.set({
    first: 'Alan',
    middle: 'Mathison',
    last: 'Turing',
    born: 1912,
  });

  const saveState = db.collection('saveState').doc('player1');

  await saveState.set({
    location: ['73.55', '78.46'],
    playerData: {
      ['this.player']: 'playerStatsHere',
      questsCompleted: 'someCompletedQuests',
      born: 1912,
    },
  });
}

addTestData();

module.exports = { db };
