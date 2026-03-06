import { collection, addDoc, updateDoc, deleteDoc, doc, onSnapshot } from "firebase/firestore";
import { db } from "../firebase";

const COLLECTION = "goals";

export const subscribeToGoals = (callback) => {
  return onSnapshot(collection(db, COLLECTION), snap => {
    callback(snap.docs.map(d => ({ id: d.id, ...d.data() })));
  });
};

export const addGoal = (data) =>
  addDoc(collection(db, COLLECTION), data);

export const updateGoal = (id, data) =>
  updateDoc(doc(db, COLLECTION, id), data);

export const deleteGoal = (id) =>
  deleteDoc(doc(db, COLLECTION, id));
