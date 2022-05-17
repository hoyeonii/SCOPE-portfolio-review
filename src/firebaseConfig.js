// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

// import { getAnalytics } from "firebase/analytics";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBKO9IRKGsepI3gxj3Iau90U0WSLf9LSVo",
  authDomain: "profile-review.firebaseapp.com",
  databaseURL: "https://profile-review-default-rtdb.firebaseio.com",
  projectId: "profile-review",
  storageBucket: "profile-review.appspot.com",
  messagingSenderId: "1054267484882",
  appId: "1:1054267484882:web:a5a977ce8ce8f41b7ddb0b",
  measurementId: "G-BJMVSVNQ9Z",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const storage = getStorage(app);
export const db = getFirestore(app);
export const auth = getAuth(app);
const provider = new GoogleAuthProvider();
export const signInWithGoogle = () => {
  return signInWithPopup(auth, provider);
  // .then((res) => {
  //   console.log(res);
  //   const name = res.user.displayName;
  //   const email = res.user.email;
  //   const profilePic = res.user.photoURL;
  // })
  // .catch((err) => console.log(err));
};
// const analytics = getAnalytics(app);
