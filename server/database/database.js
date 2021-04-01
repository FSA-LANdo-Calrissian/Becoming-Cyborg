const admin = require('firebase-admin');
let serviceAccount;
if (process.env.NODE_ENV === 'development') {
  serviceAccount = require('../../secrets').serviceAccount;
} else {
  serviceAccount = {
    type: 'service_account',
    project_id: 'robotsurvivalgame',
    private_key_id: process.env.GOOGLE_PRIVATE_KEY_ID,
    private_key: process.env.GOOGLE_PRIVATE_KEY,
    client_email: process.env.GOOGLE_CLIENT_EMAIL,
    client_id: process.env.GOOGLE_CLIENT_ID,
    auth_uri: 'https://accounts.google.com/o/oauth2/auth',
    token_uri: 'https://oauth2.googleapis.com/token',
    auth_provider_x509_cert_url: 'https://www.googleapis.com/oauth2/v1/certs',
    client_x509_cert_url:
      'https://www.googleapis.com/robot/v1/metadata/x509/firebase-adminsdk-7lukk%40robotsurvivalgame.iam.gserviceaccount.com',
  };
}

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

const db = admin.firestore();

module.exports = db;
