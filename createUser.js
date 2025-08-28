
const admin = require('firebase-admin');
const serviceAccount = require('./serviceAccountKey.json');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

const auth = admin.auth();

const email = 'temp-admin@gmail.com';
const password = 'new-password-123';

auth.createUser({
  email,
  password
})
.then((userRecord) => {
  console.log('Successfully created new user:', userRecord.uid);
})
.catch((error) => {
  console.log('Error creating new user:', error);
});
