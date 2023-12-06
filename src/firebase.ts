// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import {
  getFirestore, collection, getDocs
} from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDMYR4zH7Qe9aXOTWjQ-oeNqj43rz08qm0",
  authDomain: "flix-94f84.firebaseapp.com",
  projectId: "flix-94f84",
  storageBucket: "flix-94f84.appspot.com",
  messagingSenderId: "741241987834",
  appId: "1:741241987834:web:c8cec8e4ece490d2dd1f43"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

export const db = getFirestore()

export const col =  collection(db, "users")

// Initialize Firebase Authentication and get a reference to the service
export const auth = getAuth(app);

getDocs(col) 
  .then((snapshot) => {
    let users: any[] = []
    console.log(snapshot.docs);
    
    snapshot.docs.forEach((doc) => {
      users.push({ ...doc.data(), id: doc.id })
    })
    console.log(users);
    
  })
  .catch((err) => {
    
  })