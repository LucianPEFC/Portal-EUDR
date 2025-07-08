import { initializeApp } from "https://www.gstatic.com/firebasejs/10.5.2/firebase-app.js";
import { getAuth, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.5.2/firebase-auth.js";
import { getFirestore, collection, addDoc } from "https://www.gstatic.com/firebasejs/10.5.2/firebase-firestore.js";

// Configurația Firebase
const firebaseConfig = {
  apiKey: "AIzaSyDmtYbTwDxiM6_vO5B5CC9jwRljVjGB8o0",
  authDomain: "eudr---pefc.firebaseapp.com",
  projectId: "eudr---pefc",
  storageBucket: "eudr---pefc.firebasestorage.app",
  messagingSenderId: "628790666750",
  appId: "1:628790666750:web:55d4fe7f13a652f1000caf",
  measurementId: "G-ZTQ5MWER2E"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

// Autentificare
onAuthStateChanged(auth, (user) => {
  if (!user) {
    window.location.href = "index.html"; // dacă nu e logat, redirect
  }
});

// Formular – Adaugă APV
const form = document.getElementById("apvForm");
const status = document.getElementById("status");

form.addEventListener("submit", async (e) => {
  e.preventDefault();

  const apvData = {
    numarAPV: document.getElementById("numarAPV").value,
    specie: document.getElementById("specie").value,
    volum: parseFloat(document.getElementById("volum").value),
    UA: document.getElementById("UA").value,
    certificatPEFC: document.getElementById("certificatPEFC").checked
  };

  try {
    await addDoc(collection(db, "apvuri"), apvData);
    status.textContent = "APV adăugat cu succes!";
    form.reset();
  } catch (err) {
    status.textContent = "Eroare la salvare: " + err.message;
  }
});
