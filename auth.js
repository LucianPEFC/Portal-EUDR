// Importă SDK Firebase
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.5.2/firebase-app.js";
import { getAuth, signInWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/10.5.2/firebase-auth.js";

// Configurația Firebase
const firebaseConfig = {
  apiKey: "AIzaSyDmtYbTwDxiM6_vO5B5CC9jwRljVjGB8o0",
  authDomain: "eudr---pefc.firebaseapp.com",
  projectId: "eudr---pefc",
  storageBucket: "eudr---pefc.firebasestorage.app",
  messagingSenderId: "628790666750",
  appId: "1:628790666750:web:55d4fe7f13a652f1000caf",
  measurementId: "G-ZTQ5MWER2E"
};

// Inițializează aplicația
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

// Funcția de login
window.login = function () {
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;
  const status = document.getElementById("status");

  signInWithEmailAndPassword(auth, email, password)
    .then((userCredential) => {
      const user = userCredential.user;
      status.textContent = `Autentificat ca: ${user.email}`;
      window.location.href = "dashboard.html"; // du-te către dashboard
    })
    .catch((error) => {
      status.textContent = "Autentificare eșuată: " + error.message;
    });
};