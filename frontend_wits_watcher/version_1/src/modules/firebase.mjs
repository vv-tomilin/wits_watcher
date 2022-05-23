import { initializeApp } from "https://www.gstatic.com/firebasejs/9.7.0/firebase-app.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/9.7.0/firebase-firestore.js";

import secret_variables from '../../secret_variables.js';

const firebaseConfig = {
  apiKey: secret_variables.FIREBASE_API_KEY,
  authDomain: "wits-watcher.firebaseapp.com",
  projectId: "wits-watcher",
  storageBucket: "wits-watcher.appspot.com",
  messagingSenderId: "655147961226",
  appId: "1:655147961226:web:4ed94d6d313d4b28051673",
};

const app = initializeApp(firebaseConfig);

export const db = getFirestore(app);