const admin = require("firebase-admin");
const path = require("path");

// Ruta al service account
const serviceAccountPath = path.join(__dirname, "boda-key.json");
const serviceAccount = require(serviceAccountPath);

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

const db = admin.firestore();


module.exports = { db };