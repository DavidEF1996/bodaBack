require("./loadEnv");

const admin = require("firebase-admin");
const path = require("path");

function loadServiceAccount() {
  if (process.env.FIREBASE_SERVICE_ACCOUNT) {
    return JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT);
  }

  if (process.env.FIREBASE_SERVICE_ACCOUNT_BASE64) {
    const decoded = Buffer.from(
      process.env.FIREBASE_SERVICE_ACCOUNT_BASE64,
      "base64"
    ).toString("utf8");
    return JSON.parse(decoded);
  }

  if (process.env.GOOGLE_APPLICATION_CREDENTIALS) {
    const credentialsPath = path.resolve(process.env.GOOGLE_APPLICATION_CREDENTIALS);
    return require(credentialsPath);
  }

  const localCredentialsPath = path.join(__dirname, "boda-key.json");
  return require(localCredentialsPath);
}

const serviceAccount = loadServiceAccount();

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

const db = admin.firestore();


module.exports = { db };
