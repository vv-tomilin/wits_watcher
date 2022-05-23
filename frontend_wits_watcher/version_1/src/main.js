import { collection, addDoc, query, where, getDocs, deleteDoc, doc, updateDoc } from "https://www.gstatic.com/firebasejs/9.7.0/firebase-firestore.js";

import { db } from './modules/firebase.mjs';

import getAllWels from './modules/getAllWells.mjs';
import createNewWell from './modules/createNewWell.mjs';
import deleteWell from './modules/deleteWell.mjs';
import updateWell from './modules/updateWell.mjs';

import wellsRendering from './modules/wellsRendering.mjs';
import modalFormCrateNewWell from './modules/modalFormCrateNewWell.mjs'

wellsRendering();
modalFormCrateNewWell();

//deleteWell('iqQRfxBImeAEA7qwyySp');

//createNewWell('test_new_1');

//updateWell('bt8rOy0lY25acfoHA6oO', 'test_3_update');