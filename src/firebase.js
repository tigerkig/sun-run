import firebase from "firebase/app";
import 'firebase/database';

const firebaseConfig = {
  apiKey: "AIzaSyBEa3EiWnF4SzTxDItU44r5Yfk_0sWV_s0",
  authDomain: "juno-p4-sun-run.firebaseapp.com",
  databaseURL: "https://juno-p4-sun-run-default-rtdb.firebaseio.com",
  projectId: "juno-p4-sun-run",
  storageBucket: "juno-p4-sun-run.appspot.com",
  messagingSenderId: "329771778406",
  appId: "1:329771778406:web:996f8ce99f911a41cf08a7"
};

firebase.initializeApp(firebaseConfig);

export default firebase;