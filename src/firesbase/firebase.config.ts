import admin from 'firebase-admin';
import * as serviceAccount from './firebase-admin-sdk.json';

const setupFirebase = () => {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount as admin.ServiceAccount),
    storageBucket: 'gs://library-managment-5cd62.appspot.com'
  });
  
}

const getFirestore = () => {
  const db = admin.firestore();
  return db;
}

const getStorageBucket = () => {
  const bucket = admin.storage().bucket();
  return bucket;
}

export default {setupFirebase, getFirestore, getStorageBucket };