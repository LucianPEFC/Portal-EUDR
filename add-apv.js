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

// Inițializare hartă
const map = L.map("map").setView([45.9432, 24.9668], 7);
L.tileLayer("https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}", {
  attribution: "&copy; Esri & contributors"
}).addTo(map);

// Marker inițial
const marker = L.marker([45.9432, 24.9668], { draggable: true }).addTo(map);

// Când markerul este mutat manual
marker.on("dragend", function () {
  const { lat, lng } = marker.getLatLng();
  document.getElementById("gps").value = `${lat.toFixed(6)}, ${lng.toFixed(6)}`;
});

// Când se dă click pe hartă
map.on("click", function (e) {
  marker.setLatLng(e.latlng);
  document.getElementById("gps").value = `${e.latlng.lat.toFixed(6)}, ${e.latlng.lng.toFixed(6)}`;
});

// Salvare în Firestore
document.getElementById("apvForm").addEventListener("submit", async function (e) {
  e.preventDefault();

  const gpsPattern = /^-?\d{1,2}\.\d{3,},\s?-?\d{1,3}\.\d{3,}$/;
  const gps = document.getElementById("gps").value;

  if (gps && !gpsPattern.test(gps)) {
    alert("Format GPS invalid. Exemplu corect: 46.123456, 24.654321");
    return;
  }

  await addDoc(collection(db, "apv"), {
    numar: document.getElementById("numar").value,
    specie: document.getElementById("specie").value,
    certificat: document.getElementById("certificat").value,
    gps
  });

  alert("APV salvat cu succes!");
  window.location.href = "dashboard.html";
});
