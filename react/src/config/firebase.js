import { initializeApp } from "firebase/app";
import { getAuth, RecaptchaVerifier, signInWithPhoneNumber } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyC6zZfogjVVCLPW72u_kwAF9Pogb2K94zk",
  authDomain: "shopwithus-ba34d.firebaseapp.com",
  projectId: "shopwithus-ba34d",
  storageBucket: "shopwithus-ba34d.firebasestorage.app",
  messagingSenderId: "700327412661",
  appId: "1:700327412661:web:bead6f5008d981420d8ffc",
  measurementId: "G-CZN9B00PWK"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export { RecaptchaVerifier, signInWithPhoneNumber };
export default app;
