
import firebase from "firebase";


const firebaseConfig = {
  apiKey: "AIzaSyBQvERrZT7bjA9iBL6jBTggoRAzi4eQJ64",
  authDomain: "instagram-clone-bc01e.firebaseapp.com",
  projectId: "instagram-clone-bc01e",
  storageBucket: "instagram-clone-bc01e.appspot.com",
  messagingSenderId: "259740806446",
  appId: "1:259740806446:web:405cfcb7cb3eec5e9f1ebf",
  measurementId: "G-EZL5P1BWRS"
};

const firebaseApp = firebase.initializeApp(firebaseConfig);
const db = firebaseApp.firestore();
const auth = firebase.auth();
const storage = firebase.storage()

export {auth, storage};

export default db;