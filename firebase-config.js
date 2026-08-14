// ============================================================
// FIREBASE CONFIG — Mostafa Salem English Academy (moustafa-salem-elbatta)
// Compat SDK build (matches firebase-app-compat.js / firestore-compat.js
// / auth-compat.js / functions-compat.js already used across the project
// — NOT the modular v9+ "firebase/app" import syntax).
// ============================================================

const firebaseConfig = {
  apiKey: "AIzaSyD-n6H_HV04Lv0sFXZmqUgxGqfgEBzyq18",
  authDomain: "moustafa-salem-elbatta.firebaseapp.com",
  projectId: "moustafa-salem-elbatta",
  storageBucket: "moustafa-salem-elbatta.firebasestorage.app",
  messagingSenderId: "1064963048969",
  appId: "1:1064963048969:web:967a520038a1e42fe75ad8",
  measurementId: "G-HDC120H5M9"
};

firebase.initializeApp(firebaseConfig);

window.db = firebase.firestore();
window.auth = firebase.auth ? firebase.auth() : null;
window.firebase = firebase;

// Better offline behavior for Firestore reads (safe to ignore if it fails,
// e.g. multiple tabs open without multi-tab support).
try {
  window.db.enablePersistence({ synchronizeTabs: true }).catch(() => {});
} catch (e) {}
