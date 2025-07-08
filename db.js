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

const map = L.map("map").setView([45.9432, 24.9668], 6);
L.tileLayer("https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}", {
  attribution: "&copy; Esri & contributors"
}).addTo(map);

async function afiseazaAPVuri() {
  const list = document.getElementById("apvList");
  list.innerHTML = "<p>Se încarcă APV-urile...</p>";

  const numarFiltru = document.getElementById("filtruNumarAPV").value.toLowerCase();
  const specieFiltru = document.getElementById("filtruSpecie").value.toLowerCase();
  const pefcFiltru = document.getElementById("filtruPEFC").value.toLowerCase();
  const gpsFiltru = document.getElementById("filtruGPS").value.toLowerCase();

  const querySnapshot = await getDocs(collection(db, "apvuri"));
  let output = "<ul class='list-group'>";
  let count = 0;

  querySnapshot.forEach((doc) => {
    const d = doc.data();

    const corespunde =
      (!numarFiltru || d.numarAPV.toLowerCase().includes(numarFiltru)) &&
      (!specieFiltru || d.specie.toLowerCase().includes(specieFiltru)) &&
      (!pefcFiltru || String(d.certificatPEFC).toLowerCase().includes(pefcFiltru)) &&
      (!gpsFiltru || (d.gps && d.gps.toLowerCase().includes(gpsFiltru)));

    if (corespunde) {
      count++;
      output += `<li class='list-group-item'>
        <strong>${d.numarAPV}</strong> – ${d.specie}, ${d.volum} mc, UA ${d.UA}, GPS: ${d.gps || '-'} – PEFC: ${d.certificatPEFC ? 'DA' : 'NU'}
      </li>`;

      if (d.gps) {
        const [lat, lng] = d.gps.split(',').map(c => parseFloat(c.trim()));
        if (!isNaN(lat) && !isNaN(lng)) {
          L.marker([lat, lng]).addTo(map).bindPopup(`<strong>${d.numarAPV}</strong>`);
        }
      }
    }
  });

  output += "</ul>";
  list.innerHTML = count > 0 ? output : "<p>Nicio înregistrare găsită.</p>";
}

window.logout = function () {
  signOut(auth).then(() => {
    window.location.href = "index.html";
  });
};
