import { collection, query, getDocs } from "https://www.gstatic.com/firebasejs/9.7.0/firebase-firestore.js";

import { db } from './firebase.mjs';

export default async function getAllWells() {
  try {
    const citiesRef = collection(db, "wells/");

    const q = query(citiesRef);

    const querySnapshot = await getDocs(q);

    return querySnapshot;

    // querySnapshot.forEach((doc) => {
    //   console.log(doc.id, " => ", doc.data());
    // });

  } catch (err) {
    return err;
  }
}