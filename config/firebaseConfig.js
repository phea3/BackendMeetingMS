var admin = require("firebase-admin");

var serviceAccount = require("./firebaseServiceAccountKey.json");

const firebaseConfig = {
    apiKey: "AIzaSyAskCdP8hDL7F9xl8dlrz6EgrGCyWvTcbA",
    authDomain: "project-management-a0b4a.firebaseapp.com",
    projectId: "project-management-a0b4a",
    storageBucket: "project-management-a0b4a.appspot.com",
    messagingSenderId: "438877652778",
    appId: "1:438877652778:web:91c576875475a4f0dd0053",
    credential: admin.credential.cert(serviceAccount)
};


const app = admin.initializeApp(firebaseConfig);
const auth = admin.auth()
module.exports = {
    auth
} 
