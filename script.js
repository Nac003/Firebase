// =================================================================
// Vaša Firebase Konfiguracija
// =================================================================

import { initializeApp } from "firebase/app";
import { 
    getDatabase, 
    ref, 
    update, 
    get, 
    push, 
    serverTimestamp 
} from "firebase/database";
import { 
    getAuth, 
    signInWithEmailAndPassword, 
    onAuthStateChanged 
} from "firebase/auth"; 


const firebaseConfig = {
    apiKey: "AIzaSyAlCyHgTglR1xh9GwhIhxoNh0POwXdINzE", // Vaš ključ
    authDomain: "natalia-ignac-danijela.firebaseapp.com",
    databaseURL: "https://natalia-ignac-danijela-default-rtdb.europe-west1.firebasedatabase.app",
    projectId: "natalia-ignac-danijela",
    storageBucket: "natalia-ignac-danijela.firebasestorage.app",
    messagingSenderId: "562828177333",
    appId: "1:562828177333:web:89ab5165fc7bfcd63e33fc",
    measurementId: "G-72Z5HZ8M4M"
};

// Inicijalizacija servisa
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const database = getDatabase(app);


// =================================================================
// Globalne varijable za status korisnika
// =================================================================
let currentUserId = null;
let currentUserEmail = null;


// =================================================================
// KORAK 2: FUNKCIJA ZA LOGIRANJE TRANSAKCIJA
// =================================================================

function logTransaction(akcija, resurs, idResursa, stariPodaci, noviPodaci) {
    if (!currentUserId) {
        console.error('Ne može se logirati transakcija: Nema prijavljenog korisnika');
        return;
    }

    const logPodaci = {
        userId: currentUserId,
        userEmail: currentUserEmail,
        akcija: akcija,
        resurs: resurs,
        idResursa: idResursa,
        stariPodaci: stariPodaci || null,
        noviPodaci: noviPodaci || null,
        timestamp: serverTimestamp(), 
    };

    const logRef = ref(database, 'transaction_log');
    
    push(logRef, logPodaci)
        .then(() => {
            console.log(`✅ Logirano: ${akcija} na ${resurs}/${idResursa}`);
        })
        .catch((error) => {
            console.error('❌ Greška pri logiranju transakcije:', error);
            alert("Greška pri logiranju! Provjerite pravila baze.");
        });
}


// =================================================================
// KORAK 3: PRIMJER INTEGRACIJE (Ažuriranje Štednje)
// =================================================================

async function azurirajIznosStednje(stednjaId, noviIznos) {
    if (!currentUserId) {
        alert("Prijavite se prije ažuriranja!");
        return;
    }
    
    const stednjaRef = ref(database, `stednja/${stednjaId}`);
    
    try {
        // DOHVATI STARE PODATKE
        const snapshot = await get(stednjaRef);
        const stariPodaci = snapshot.val();

        if (!stariPodaci) {
            alert(`Štednja s ID ${stednjaId} nije pronađena.`);
            return;
        }

        // PRIKAZ STARIH/NOVIH PODATAKA
        console.log("Stari iznos:", stariPodaci.iznos);
        console.log("Novi iznos:", noviIznos);
        
        // Priprema NOVOG podatka
        const noviPodaci = { ...stariPodaci, iznos: noviIznos };

        // IZVRŠI PROMJENU (AŽURIRANJE)
        await update(stednjaRef, { iznos: noviIznos });
        
        // LOGIRAJ TRANSAKCIJU
        logTransaction(
            'UPDATE_STEDNJA',
            'stednja',
            stednjaId,
            stariPodaci,
            noviPodaci
        );

        alert(`Štednja ${stednjaId} uspješno ažurirana na ${noviIznos} i logirana!`);

    } catch (error) {
        console.error('Greška pri ažuriranju štednje:', error);
        alert(`Došlo je do greške: ${error.message}`);
    }
}


// =================================================================
// Povezivanje s UI elementima
// =================================================================

// 1. Promjena stanja prijave (UI i globalne varijable)
onAuthStateChanged(auth, (user) => {
    const authStatus = document.getElementById('auth-status');
    const logBtn = document.getElementById('log-btn');
    
    if (user) {
        currentUserId = user.uid;
        currentUserEmail = user.email;
        authStatus.innerHTML = `<p class="success">Prijavljeni kao: <strong>${user.email}</strong></p>`;
        logBtn.disabled = false;
        console.log("Korisnik prijavljen:", user.uid);
    } else {
        currentUserId = null;
        currentUserEmail = null;
        authStatus.innerHTML = `<p class="error">Trenutno stanje: <strong>Odjavljen</strong></p>`;
        logBtn.disabled = true;
    }
});


// 2. Login akcija (Demo Ana - ID: cz7EgoXss7bcVI638siiKNu4rG93)
document.getElementById('login-btn').addEventListener('click', () => {
    // Koristimo podatke Ane iz baze: ana@example.com / ana1234
    signInWithEmailAndPassword(auth, 'ana@example.com', 'ana1234')
        .catch(error => {
            console.error("Login Error:", error.message);
            alert(`Greška pri prijavi: ${error.message}. Provjerite korisnika u Auth-u!`);
        });
});


// 3. Ažuriranje i Logiranje (poziva funkciju iz Koraka 3)
document.getElementById('log-btn').addEventListener('click', () => {
    // Uzmimo štednju 'stednja1' čiji je iznos bio 500
    // Postavimo novi iznos na 650
    azurirajIznosStednje('stednja1', 650);
});

// -------------------------------
// 🧾 PRIKAZ USER ACTIVITY
// -------------------------------
const activityDiv = document.getElementById("activity");
const activityRef = ref(db, "user_activity");

onValue(activityRef, (snapshot) => {
  const data = snapshot.val();
  activityDiv.innerHTML = "";
  if (data) {
    Object.keys(data).forEach((key) => {
      const a = data[key];
      activityDiv.innerHTML += `
        <div style="border:1px solid #ddd; padding:8px; margin:5px;">
          <strong>${a.aktivnost}</strong> - ${a.opis}<br>
          <small>${a.datum}</small>
        </div>
      `;
    });
  } else {
    activityDiv.innerHTML = "<p>Nema aktivnosti još.</p>";
  }
});
