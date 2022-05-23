import { deleteDoc, doc } from "https://www.gstatic.com/firebasejs/9.7.0/firebase-firestore.js";

import { db } from './firebase.mjs';

export default async function deleteWell(id) {
  await deleteDoc(doc(db, "wells", id));
}