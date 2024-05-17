import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
//   apiKey: "AIzaSyCSvZKh2xc9c72Q_SuQJYTXNBX2RFBhYIg",
//   authDomain: "my-dropbox-a2718.firebaseapp.com",
//   projectId: "my-dropbox-a2718",
//   storageBucket: "my-dropbox-a2718.appspot.com",
//   messagingSenderId: "43896063616",
//   appId: "1:43896063616:web:d0f329f25e666c6e2dc865"

    apiKey: "AIzaSyAKRQ5PqyOJf4D5CXq0oQDitWkXBkIXL9o",
    authDomain: "mydropbox-73bc9.firebaseapp.com",
    projectId: "mydropbox-73bc9",
    storageBucket: "mydropbox-73bc9.appspot.com",
    messagingSenderId: "442988245933",
    appId: "1:442988245933:web:eadb0795a2eb4c44c2a724"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const storage = getStorage(app);
export {app, auth, db, storage}; 