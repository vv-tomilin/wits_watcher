import { doc, updateDoc } from "https://www.gstatic.com/firebasejs/9.7.0/firebase-firestore.js";

import { db } from './firebase.mjs';

export default async function updateWell(id, data) {
  const updateWell = doc(db, "wells", id);

  await updateDoc(updateWell, data);
}