import admin from 'firebase-admin';
import fs from 'fs';
import path from 'path';

// Resolve the path to the JSON file you dropped in the server folder
const serviceAccountPath = path.resolve('firebase-service-account.json');
const serviceAccount = JSON.parse(fs.readFileSync(serviceAccountPath, 'utf8'));

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

console.log('Firebase Admin Initialized successfully.');

export default admin;