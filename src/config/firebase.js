import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyAq6ud5Fo-6STZ9JkjRTUSd0yqTmERqq8s",
  authDomain: "quickfix-93337.firebaseapp.com",
  projectId: "quickfix-93337",
  storageBucket: "quickfix-93337.firebasestorage.app",
  messagingSenderId: "19764961126",
  appId: "1:19764961126:web:090dac8b74793dac7f2a7",
};

const app = initializeApp(firebaseConfig);

export const db = getFirestore(app);