import firebase from "firebase";
import 'firebase/firestore';
import "firebase/auth";

const firebaseConfig = {
    apiKey: "AIzaSyBZKqY1D4roGDpdrDGkT9fW4i8DdkdlhMU",
    authDomain: "cloud-server-2009c.firebaseapp.com",
    projectId: "cloud-server-2009c",
    storageBucket: "cloud-server-2009c.appspot.com",
    messagingSenderId: "119008993449",
    appId: "1:119008993449:web:bbd62fa0058c644ce009b8",
    measurementId: "G-ELSTTZTXRY"
  };
  
const firebaseApp = firebase.initializeApp(firebaseConfig);

export default firebaseApp