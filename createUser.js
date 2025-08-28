const admin = require('firebase-admin');
const serviceAccount = require('./serviceAccountKey.json');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

const email = 'iboulsane10@gmail.com';
const newPassword = 'new-password-123';

admin
  .auth()
  .getUserByEmail(email)
  .then((userRecord) => {
    // User exists, update the password
    const uid = userRecord.uid;
    return admin.auth().updateUser(uid, {
      password: newPassword,
    });
  })
  .then((userRecord) => {
    console.log('Successfully updated user:', userRecord.toJSON());
  })
  .catch((error) => {
    if (error.code === 'auth/user-not-found') {
      // User doesn't exist, create a new one
      admin.auth().createUser({
        email: email,
        password: newPassword,
      })
      .then((userRecord) => {
        console.log('Successfully created new user:', userRecord.toJSON());
      })
      .catch((createError) => {
        console.error('Error creating new user:', createError);
      });
    } else {
      console.error('Error updating user:', error);
    }
  });
