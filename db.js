import { initializeApp } from "https://www.gstatic.com/firebasejs/10.5.2/firebase-app.js";
import { getFirestore, collection, getDocs } from "https://www.gstatic.com/firebasejs/10.5.2/firebase-firestore.js";

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
const apvList = document.getElementById("apvList");
const map = L.map('map').setView([45.9432, 24.9668], 6);
L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', {
  attribution: '© Esri & contributors'
}).addTo(map);
const markerLayer = L.layerGroup().addTo(map);

const filters = {
  specie: document.getElementById("filterSpecie"),
  certificat: document.getElementById("filterCertificat"),
  numar: document.getElementById("filterNumar"),
  gps: document.getElementById("filterGPS")
};

Object.values(filters).forEach(input => {
  input.addEventListener("input", loadData);
});

async function loadData() {
  apvList.innerHTML = "";
  markerLayer.clearLayers();
  const querySnapshot = await getDocs(collection(db, "apvuri"));
  querySnapshot.forEach((doc) => {
    const apv = doc.data();
    const specie = apv.specie?.toLowerCase() || "";
    const certificat = apv.pefc?.toLowerCase() || "";
    const numar = apv.numarAPV?.toLowerCase() || "";
    const gps = apv.gps?.toLowerCase() || "";
    const passesFilters =
      specie.includes(filters.specie.value.toLowerCase()) &&
      certificat.includes(filters.certificat.value.toLowerCase()) &&
      numar.includes(filters.numar.value.toLowerCase()) &&
      gps.includes(filters.gps.value.toLowerCase());

    if (passesFilters) {
      const col = document.createElement("div");
      col.className = "col";
      col.innerHTML = `
        <div class="card apv-card" onclick="centerMap('${gps}')">
          <div class="card-body">
            <h5 class="card-title">${apv.numarAPV}</h5>
            <p class="card-text">Specie: ${apv.specie} | Volum: ${apv.volum} mc</p>
            <p class="card-text">Unitate amenajistică: ${apv.ua}</p>
            <p class="card-text">Certificat PEFC: ${apv.pefc}</p>
            ${gps ? `<p class="apv-gps">📍 Coordonate: ${gps}</p>` : ""}
          </div>
        </div>`;
      apvList.appendChild(col);

      if (gps.includes(",")) {
        const [lat, lng] = gps.split(/,\s*/).map(Number);
        if (!isNaN(lat) && !isNaN(lng)) {
          const marker = L.marker([lat, lng]).addTo(markerLayer);
          marker.bindPopup(`${apv.numarAPV} – ${apv.specie}`);
        }
      }
    }
  });
}

window.centerMap = function (gps) {
  if (gps.includes(",")) {
    const [lat, lng] = gps.split(/,\s*/).map(Number);
    if (!isNaN(lat) && !isNaN(lng)) {
      map.setView([lat, lng], 14);
    }
  }
};

loadData();
