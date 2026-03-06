import { collection, addDoc, updateDoc, deleteDoc, doc, query, orderBy, onSnapshot } from "firebase/firestore";
import { db } from "../firebase";

const COLLECTION = "transactions";

export const subscribeToTransactions = (callback) => {
  const q = query(collection(db, COLLECTION), orderBy("date", "desc"));
  return onSnapshot(q, snap => {
    callback(snap.docs.map(d => ({ id: d.id, ...d.data() })));
  });
};

export const addTransaction = (data) =>
  addDoc(collection(db, COLLECTION), data);

export const updateTransaction = (id, data) =>
  updateDoc(doc(db, COLLECTION, id), data);

export const deleteTransaction = (id) =>
  deleteDoc(doc(db, COLLECTION, id));
