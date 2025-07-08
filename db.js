import { initializeApp } from "https://www.gstatic.com/firebasejs/10.5.2/firebase-app.js";
import { getAuth, onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/10.5.2/firebase-auth.js";
import { getFirestore, collection, getDocs } from "https://www.gstatic.com/firebasejs/10.5.2/firebase-firestore.js";

// Configurația Firebase (la fel ca în auth.js)
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

// Verifică dacă utilizatorul e autentificat
onAuthStateChanged(auth, async (user) => {
  if (user) {
    const apvContainer = document.getElementById("apvList");
    apvContainer.innerHTML = "<h4>APV-urile tale:</h4><ul>";

    const querySnapshot = await getDocs(collection(db, "apvuri"));
    querySnapshot.forEach((doc) => {
      const data = doc.data();
      apvContainer.innerHTML += `
        <li><strong>${data.numarAPV}</strong> – ${data.specie}, ${data.volum} mc, ${data.UA}</li>
      `;
    });

    apvContainer.innerHTML += "</ul>";
  } else {
    window.location.href = "index.html";
  }
});

// Funcție de logout
window.logout = function () {
  signOut(auth).then(() => {
    window.location.href = "index.html";
  });
};
