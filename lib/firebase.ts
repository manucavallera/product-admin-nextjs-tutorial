// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import {
  getAuth,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  updateProfile,
  sendPasswordResetEmail,
} from "firebase/auth";
import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  getFirestore,
  query,
  serverTimestamp,
  setDoc,
  updateDoc,
} from "firebase/firestore";
import {
  getStorage,
  uploadString,
  getDownloadURL,
  ref,
} from "firebase/storage";

type User = {
  email: string;
  password: string;
};

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBvmSDzCJYHLAk1RN9bjFOOLpTBiaDoUvs",
  authDomain: "product-admin-nextjs-905ae.firebaseapp.com",
  projectId: "product-admin-nextjs-905ae",
  storageBucket: "product-admin-nextjs-905ae.appspot.com",
  messagingSenderId: "977941880855",
  appId: "1:977941880855:web:44d2f2ed2c2e7cf84dfc52",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

export default app;

export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);

/*****Auth Functions *****/

/*****Create User with email and password  *****/
export const createUser = async (user: User) => {
  return await createUserWithEmailAndPassword(auth, user.email, user.password);
};

/*****Sign in Functions *****/
export const signIn = async (user: User) => {
  return await signInWithEmailAndPassword(auth, user.email, user.password);
};

/*****Update User DisplayName and PhotoUrl *****/

export const updateUser = (user: {
  displayName?: string | null | undefined;
  photoURL?: string | null | undefined;
}) => {
  if (auth.currentUser) {
    return updateProfile(auth.currentUser, user);
  }
};

/*****Send Reset Email *****/
export const sendResetEmail = async (email: string) => {
  return sendPasswordResetEmail(auth, email);
};

/*****Sign Out *****/
export const signOutAccount = () => {
  localStorage.removeItem("user");
  return auth.signOut();
};

//**********Database functions************

export const getCollection = async (
  collectionName: string,
  queryArray?: any[]
) => {
  const ref = collection(db, collectionName);

  const q = queryArray ? query(ref, ...queryArray) : query(ref);

  return (await getDocs(q)).docs.map((doc) => ({ id: doc.id, ...doc.data() }));
};

//***Get a document from a collection */
export const getDocument = async (path: string) => {
  return (await getDoc(doc(db, path))).data();
};

//***Add a document in a collection */
export const addDocument = (path: string, data: any) => {
  data.createdAt = serverTimestamp();
  return addDoc(collection(db, path), data);
};

//***Set a document in a collection */
export const setDocument = (path: string, data: any) => {
  data.createdAt = serverTimestamp();
  return setDoc(doc(db, path), data);
};

//****Update a document in a collection  */
export const updateDocument = (path: string, data: any) => {
  return updateDoc(doc(db, path), data);
};

//****Delete a document from a collection  */
export const deleteDocument = (path: string) => {
  return deleteDoc(doc(db, path));
};

//***Storage Functions ****/

/***Upload a file with base64 format and get the url */
export const uploadBase64 = async (path: string, base64: string) => {
  return uploadString(ref(storage, path), base64, "data_url").then(() =>
    getDownloadURL(ref(storage, path))
  );
};
