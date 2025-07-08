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

  const list = document.getElementById("apvList");
  list.innerHTML = "<ul>";

  const querySnapshot = await getDocs(collection(db, "apvuri"));
  querySnapshot.forEach((doc) => {
    const d = doc.data();
    list.innerHTML += `<li><strong>${d.numarAPV}</strong> – ${d.specie}, ${d.volum} mc, UA ${d.UA}</li>`;
  });

  list.innerHTML += "</ul>";
});

window.logout = function () {
  signOut(auth).then(() => {
    window.location.href = "index.html";
  });
};
