import { addDoc, collection, doc, getDocs, orderBy, query, serverTimestamp, setDoc, where } from 'firebase/firestore';
import { db } from '../config/firebase';

export const addOwnedDocument = async <T extends object>(collectionName: string, data: T) => {
  if (!db) throw new Error('Firestore is not configured.');
  return addDoc(collection(db, collectionName), { ...data, createdAt: serverTimestamp(), updatedAt: serverTimestamp() });
};

export const upsertDocument = async <T extends object>(collectionName: string, id: string, data: T) => {
  if (!db) throw new Error('Firestore is not configured.');
  return setDoc(doc(db, collectionName, id), { ...data, updatedAt: serverTimestamp() }, { merge: true });
};

export const getOwnedDocuments = async <T>(collectionName: string, ownerId: string, sortField = 'createdAt') => {
  if (!db) throw new Error('Firestore is not configured.');
  const snapshot = await getDocs(query(collection(db, collectionName), where('ownerId', '==', ownerId), orderBy(sortField, 'desc')));
  return snapshot.docs.map((item) => ({ id: item.id, ...item.data() }) as T);
};
