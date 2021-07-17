import firebase from "firebase/app";
import "firebase/auth";
import "firebase/firestore";
import "firebase/storage";

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
const storage = firebase.storage();

const usersCollection = db.collection("users");
const songsCollection = db.collection("songs");
const commentsCollection = db.collection("comments");

export {
    auth,
    db,
    usersCollection,
    songsCollection,
    commentsCollection,
    storage
};
