import { initializeApp } from "firebase/app";
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyAlCyHgTglR1xh9GwhIhxoNh0POwXdINzE",
  authDomain: "natalia-ignac-danijela.firebaseapp.com",
  databaseURL: "ttps://natalia-ignac-danijela-default-rtdb.europe-west1.firebasedatabase.app",
  projectId: "natalia-ignac-danijela",
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

signInWithEmailAndPassword(auth, "ana@example.com", "ana1234")
  .then((userCredential) => userCredential.user.getIdToken())
  .then((idToken) => console.log("ID Token:", idToken))
  .catch(console.error);
