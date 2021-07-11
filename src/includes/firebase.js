import firebase from "firebase/app";
import "firebase/auth";
import "firebase/firestore";

var firebaseConfig = {
    apiKey: "AIzaSyANFHStZCbbm-FwBvfRO5rzVOHvAgMDHkg",
    authDomain: "music-hub-d0bcb.firebaseapp.com",
    projectId: "music-hub-d0bcb",
    storageBucket: "music-hub-d0bcb.appspot.com",
    appId: "1:334210218843:web:03b55d1c10cd3d480ef87e",
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);

const auth = firebase.auth();
const db = firebase.firestore();

const usersCollection = db.collection("users");

export {
    auth,
    db,
    usersCollection,
};
