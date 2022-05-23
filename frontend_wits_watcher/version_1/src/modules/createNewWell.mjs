import { collection, addDoc } from "https://www.gstatic.com/firebasejs/9.7.0/firebase-firestore.js";

import { db } from './firebase.mjs';

export default async function createNewWell(obj) {
  try {

    const docRef = await addDoc(collection(db, "wells"), {
      bush_name: obj.bush_name,
      api_url: obj.api_url
    });

    console.log("Document written with ID: ", docRef.id);

  } catch (err) {
    console.log(err);
  }
}