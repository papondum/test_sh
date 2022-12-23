import { getDatabase } from "firebase/database";
import { initializeApp } from "firebase/app";
import { getStorage } from "firebase/storage";
// TODO: Replace the following with your app's Firebase project configuration
// See: https://firebase.google.com/docs/web/learn-more#config-object
const firebaseConfig = {
    apiKey: "AIzaSyDwFz5EYmxSY6JjZdN4K9OMespdWsyqBkY",
    authDomain: "checkin-8a7cd.firebaseapp.com",
    databaseURL: "https://checkin-8a7cd-default-rtdb.asia-southeast1.firebasedatabase.app",
    projectId: "checkin-8a7cd",
    storageBucket: "checkin-8a7cd.appspot.com",
    messagingSenderId: "210236755374",
    appId: "1:210236755374:web:83be1d94c5238062320c3f",
    measurementId: "G-0LG473PLKJ"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);


// Initialize Realtime Database and get a reference to the service
export const db = getDatabase(app);
export const storage = getStorage(app)