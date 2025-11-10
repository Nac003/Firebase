import { initializeApp } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-app.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-auth.js";
import { getDatabase, ref, push, set, get } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-database.js";

const firebaseConfig = {
  apiKey: "AIzaSyAlCyHgTglR1xh9GwhIhxoNh0POwXdINzE",
  authDomain: "natalia-ignac-danijela.firebaseapp.com",
  databaseURL: "https://natalia-ignac-danijela-default-rtdb.europe-west1.firebasedatabase.app",
  projectId: "natalia-ignac-danijela",
  storageBucket: "natalia-ignac-danijela.appspot.com",
  messagingSenderId: "562828177333",
  appId: "1:562828177333:web:89ab5165fc7bfcd63e33fc",
  measurementId: "G-72Z5HZ8M4M"
};

export const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getDatabase(app);

// Provjera admina
export async function isAdmin(userUid) {
  if (!userUid) return false;
  const snapshot = await get(ref(db, `korisnici/${userUid}/role`));
  return snapshot.exists() && snapshot.val() === 'admin';
}
