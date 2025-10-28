import { initializeApp } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-app.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-auth.js";
import { getDatabase, ref, push, set, get, child } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-database.js";

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

// Inicijalizacija Firebasea
export const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getDatabase(app);

// Provjera je li korisnik admin
export async function isAdmin(userUid) {
  if (!userUid) return false;
  const snapshot = await get(ref(db, `korisnici/${userUid}/role`));
  return snapshot.exists() && snapshot.val() === 'admin';
}

// Funkcije za dodavanje
export async function dodajStednju(kategorija, iznos, rok, ucestalost) {
  const user = auth.currentUser;
  if (!user) return alert("Nisi prijavljen!");

  const newRef = push(ref(db, 'stednja'));
  await set(newRef, {
    datum_kreiranja: new Date().toISOString(),
    id_korisnika: user.uid,
    iznos: Number(iznos),
    kategorija,
    rok,
    ucestalost
  });

  alert("Štednja dodana!");
}

export async function uplatiUstednju(idStednje, iznos) {
  const newRef = push(ref(db, 'uplata_stednje'));
  await set(newRef, {
    datum_kreiranja: new Date().toISOString(),
    id_stednje: idStednje,
    iznos: Number(iznos)
  });
  alert("Uplata uspješna!");
}

export async function dodajTransakciju(kategorija, iznos, tip) {
  const user = auth.currentUser;
  if (!user) return alert("Nisi prijavljen!");

  const newRef = push(ref(db, 'budget_korisnika'));
  await set(newRef, {
    datum_transakcije: new Date().toISOString().split('T')[0],
    id_korisnika: user.uid,
    iznos: Number(iznos),
    kategorija,
    tip_transakcije: tip
  });

  alert("Transakcija dodana!");
}
