import { initializeApp } from "https://www.gstatic.com/firebasejs/10.5.2/firebase-app.js";
import { getFirestore, collection, getDocs } from "https://www.gstatic.com/firebasejs/10.5.2/firebase-firestore.js";

// Configurația Firebase
const firebaseConfig = {
  apiKey: "AIzaSyBgqPMU0ijd6wfzaykW1GfaouV51DVpPjo",
  authDomain: "portal-eudr.firebaseapp.com",
  projectId: "portal-eudr",
  storageBucket: "portal-eudr.firebasestorage.app",
  messagingSenderId: "624936450418",
  appId: "1:624936450418:web:886c465d74b22cebf085eb"
};

// Inițializare Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// Inițializare hartă
const list = document.getElementById("apvList");
const map = L.map("map").setView([45.9432, 24.9668], 6);
L.tileLayer("https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}", {
  attribution: "&copy; Esri & contributors"
}).addTo(map);

// Filtrare după câmpuri
function isMatch(apv, filters) {
  return (
    (!filters.specie || apv.specie.toLowerCase().includes(filters.specie.toLowerCase())) &&
    (!filters.certificat || apv.certificat.toLowerCase().includes(filters.certificat.toLowerCase())) &&
    (!filters.numar || apv.numar.toLowerCase().includes(filters.numar.toLowerCase())) &&
    (!filters.gps || apv.gps.toLowerCase().includes(filters.gps.toLowerCase()))
  );
}

// Afișare APV-uri în listă
function loadAPVs() {
  list.innerHTML = "";
  getDocs(collection(db, "apv")).then(snapshot => {
    snapshot.forEach(doc => {
      const apv = doc.data();
      apv.id = doc.id;
      if (!isMatch(apv, getFilters())) return;

      const card = document.createElement("div");
      card.className = "card mb-3 p-3 apv-card";
      card.innerHTML = `
        <strong>Nr: ${apv.numar}</strong> | <strong>Specie:</strong> ${apv.specie} | <strong>Certificat:</strong> ${apv.certificat}
        <div class="apv-gps">${apv.gps || 'Fără coordonate'}</div>
      `;

      // Afișare marker pe hartă la click
      card.addEventListener("click", () => {
        if (apv.gps) {
          const [lat, lng] = apv.gps.split(',').map(coord => parseFloat(coord.trim()));
          map.setView([lat, lng], 15);
          L.marker([lat, lng]).addTo(map);
        }
      });

      list.appendChild(card);
    });
  });
}

// Colectare filtre din câmpuri
function getFilters() {
  return {
    specie: document.getElementById("filterSpecie").value,
    certificat: document.getElementById("filterCertificat").value,
    numar: document.getElementById("filterNumar").value,
    gps: document.getElementById("filterGPS").value
  };
}

// Actualizare automată la modificare filtre
document.querySelectorAll(".filter-input").forEach(input => {
  input.addEventListener("input", loadAPVs);
});

loadAPVs();
