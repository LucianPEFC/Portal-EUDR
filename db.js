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

async function afiseazaAPVuri() {
  const list = document.getElementById("apvList");
  list.innerHTML = "<p>Se încarcă APV-urile...</p>";

  const numarFiltru = document.getElementById("filtruNumarAPV").value.toLowerCase();
  const specieFiltru = document.getElementById("filtruSpecie").value;
  const pefcFiltru = document.getElementById("filtruPEFC").value;

  const querySnapshot = await getDocs(collection(db, "apvuri"));
  let count = 0;
  let output = "<ul class='list-group'>";

  querySnapshot.forEach((doc) => {
    const d = doc.data();

    const corespundeNumar = !numarFiltru || d.numarAPV.toLowerCase().includes(numarFiltru);
    const corespundeSpecie = !specieFiltru || d.specie === specieFiltru;
    const corespundePEFC = pefcFiltru === "" || String(d.certificatPEFC) === pefcFiltru;

    if (corespundeNumar && corespundeSpecie && corespundePEFC) {
      count++;
      output += `<li class='list-group-item'>
        <strong>${d.numarAPV}</strong> – ${d.specie}, ${d.volum} mc, UA ${d.UA}, GPS: ${d.gps || '-'} – PEFC: ${d.certificatPEFC ? 'DA' : 'NU'}
      </li>`;
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
