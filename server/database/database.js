const admin = require('firebase-admin');
let serviceAccount;
if (process.env.NODE_ENV === 'development') {
  serviceAccount = require('../../secrets').serviceAccount;
} else {
  serviceAccount = process.env.GOOGLE_APPLICATION_CREDENTIALS;
}

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

const db = admin.firestore();

module.exports = db;
