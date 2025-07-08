import { initializeApp } from "https://www.gstatic.com/firebasejs/10.5.2/firebase-app.js";
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
const db = getFirestore(app);

document.getElementById("apvForm").addEventListener("submit", async function (e) {
  e.preventDefault();
  const data = {
    numarAPV: document.getElementById("numarAPV").value,
    specie: document.getElementById("specie").value,
    volum: document.getElementById("volum").value,
    ua: document.getElementById("ua").value,
    pefc: document.getElementById("pefc").value,
    gps: document.getElementById("gps").value
  };
  try {
    await addDoc(collection(db, "apvuri"), data);
    alert("APV salvat cu succes!");
    window.location.href = "dashboard.html";
  } catch (error) {
    alert("Eroare: " + error.message);
  }
});
