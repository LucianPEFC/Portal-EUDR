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

  const specieFiltru = document.getElementById("filtruSpecie").value;
  const pefcFiltru = document.getElementById("filtruPEFC").value;

  const querySnapshot = await getDocs(collection(db, "apvuri"));
  let count = 0;
  let output = "<ul>";

  querySnapshot.forEach((doc) => {
    const d = doc.data();

    const corespundeSpecie = !specieFiltru || d.specie === specieFiltru;
    const corespundePEFC = pefcFiltru === "" || String(d.certificatPEFC) === pefcFiltru;

    if (corespundeSpecie && corespundePEFC) {
      count++;
      output += `<li><strong>${d.numarAPV}</strong> – ${d.specie}, ${d.volum} mc, UA ${d.UA} – PEFC: ${d.certificatPEFC ? 'DA' : 'NU'}</li>`;
    }
  });

  output += "</ul>";
  list.innerHTML = count > 0 ? output : "<p>Nicio înregistrare găsită cu filtrele selectate.</p>";
}

window.logout = function () {
  signOut(auth).then(() => {
    window.location.href = "index.html";
  });
};
