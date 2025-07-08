import { initializeApp } from "https://www.gstatic.com/firebasejs/10.5.2/firebase-app.js";
import { getAuth, onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/10.5.2/firebase-auth.js";
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
const auth = getAuth(app);
const db = getFirestore(app);

let map;

onAuthStateChanged(auth, async (user) => {
  if (!user) {
    window.location.href = "index.html";
    return;
  }

  document.getElementById("aplicaFiltre").addEventListener("click", () => {
    afiseazaAPVuri();
  });

  afiseazaAPVuri();
});

async function afiseazaAPVuri() {
  const list = document.getElementById("apvList");
  list.innerHTML = "<p>Se încarcă APV-urile...</p>";

  const numarFiltru = document.getElementById("filtruNumarAPV").value.toLowerCase();
  const specieFiltru = document.getElementById("filtruSpecie").value;
  const pefcFiltru = document.getElementById("filtruPEFC").value;
  const gpsFiltru = document.getElementById("filtruGPS").value.trim();

  const querySnapshot = await getDocs(collection(db, "apvuri"));
  let output = "<ul class='list-group'>";
  let count = 0;

  // Inițializare hartă (doar o dată)
  if (!map) {
    map = L.map('map').setView([45.9432, 24.9668], 6); // România
    L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', {
      attribution: '© Esri, Maxar, Earthstar Geographics'
    }).addTo(map);
  }

  // Eliminare markere vechi
  map.eachLayer((layer) => {
    if (layer instanceof L.Marker) {
      map.removeLayer(layer);
    }
  });

  querySnapshot.forEach((doc) => {
    const d = doc.data();
    const gpsMatch = !gpsFiltru || (d.gps && d.gps.includes(gpsFiltru));
    const nrMatch = !numarFiltru || d.numarAPV.toLowerCase().includes(numarFiltru);
    const specieMatch = !specieFiltru || d.specie === specieFiltru;
    const pefcMatch = pefcFiltru === "" || String(d.certificatPEFC) === pefcFiltru;

    if (gpsMatch && nrMatch && specieMatch && pefcMatch) {
      count++;

      const gpsText = d.gps ? `, GPS: ${d.gps}` : '';
      const liId = `apv-${doc.id}`;

      output += `
        <li class='list-group-item list-group-item-action' id="${liId}" style="cursor: pointer;">
          <strong>${d.numarAPV}</strong> – ${d.specie}, ${d.volum} mc, UA ${d.UA}${gpsText} – PEFC: ${d.certificatPEFC ? 'DA' : 'NU'}
        </li>
      `;

      // Adăugăm marker pe hartă dacă avem coordonate
      if (d.gps) {
        const [lat, lng] = d.gps.split(",").map(x => parseFloat(x.trim()));
        if (!isNaN(lat) && !isNaN(lng)) {
          const marker = L.marker([lat, lng]).addTo(map).bindPopup(`<strong>${d.numarAPV}</strong><br>${d.specie}, ${d.volum} mc`);
          marker._id = doc.id;
        }
      }
    }
  });

  output += "</ul>";
  list.innerHTML = count > 0 ? output : "<p>Nicio înregistrare găsită.</p>";

  // Click pe un APV din listă → centrează harta
  querySnapshot.forEach((doc) => {
    const d = doc.data();
    if (d.gps) {
      const li = document.getElementById(`apv-${doc.id}`);
      if (li) {
        li.addEventListener("click", () => {
          const [lat, lng] = d.gps.split(",").map(x => parseFloat(x.trim()));
          if (!isNaN(lat) && !isNaN(lng)) {
            map.setView([lat, lng], 14);
            L.popup()
              .setLatLng([lat, lng])
              .setContent(`<strong>${d.numarAPV}</strong><br>${d.specie}, ${d.volum} mc`)
              .openOn(map);
          }
        });
      }
    }
  });
}

window.logout = function () {
  signOut(auth).then(() => {
    window.location.href = "index.html";
  });
};
