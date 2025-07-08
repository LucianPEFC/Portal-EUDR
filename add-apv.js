import { initializeApp } from "https://www.gstatic.com/firebasejs/10.5.2/firebase-app.js";
import { getAuth, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.5.2/firebase-auth.js";
import { getFirestore, collection, addDoc } from "https://www.gstatic.com/firebasejs/10.5.2/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyBgqPMU0ijd6wfzaykW1GfaouV51DVpPjo",
  authDomain: "portal-eudr.firebaseapp.com",
  projectId: "portal-eudr",
  storageBucket: "portal-eudr.firebasestorage.app",
  messagingSenderId: "624936450418",
  appId: "1:624936450418:web:886c465d74b22cebf085eb"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

onAuthStateChanged(auth, (user) => {
  if (!user) {
    window.location.href = "index.html";
  }
});

document.getElementById("apvForm").addEventListener("submit", async (e) => {
  e.preventDefault();
  const status = document.getElementById("status");

  const data = {
    numarAPV: document.getElementById("numarAPV").value,
    specie: document.getElementById("specie").value,
    volum: parseFloat(document.getElementById("volum").value),
    UA: document.getElementById("UA").value,
    gps: document.getElementById("gps").value,
    certificatPEFC: document.getElementById("certificatPEFC").checked
  };

  try {
    await addDoc(collection(db, "apvuri"), data);
    status.textContent = "✅ APV salvat cu succes!";
    document.getElementById("apvForm").reset();
  } catch (error) {
    status.textContent = "Eroare: " + error.message;
  }
});
