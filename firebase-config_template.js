// ============================================================
// FIREBASE CONFIG — TEMPLATE (not active yet)
// ============================================================
// The whole project (index.html, dashboard.html, login.html,
// lessons.html) already talks to Firebase through `window.db`
// for EVERYTHING: courses, students, quizzes, question bank,
// quiz attempts, videos, course codes, payment requests, and
// student activity logs. That wiring is already written and
// does not need to be redone.
//
// All that's missing is this file + your real project keys.
//
// HOW TO ACTIVATE:
// 1) Go to https://console.firebase.google.com → your project
//    → Project settings → General → "Your apps" → Web app
//    → copy the firebaseConfig object.
// 2) Paste your real values below (replace the placeholders).
// 3) Save this file as "firebase-config.js" in the SAME folder
//    as index.html / dashboard.html / login.html / lessons.html.
// 4) In each of those 4 files, find the commented block that says
//    "DATABASE CONNECTION — DISCONNECTED" and uncomment the
//    <script> lines inside it (the 4 Firebase SDK tags + this file).
// 5) In Firebase Console, enable:
//      - Authentication (if you want phone/email login via Firebase)
//      - Firestore Database (Production mode) and set security rules
//        so only signed-in admins can write, but students can read
//        course data.
//
// Once that's done, every add/edit/delete made from dashboard.html
// will sync live to index.html and lessons.html automatically —
// no other code changes needed.
// ============================================================

const firebaseConfig = {
  apiKey: "PASTE_YOUR_API_KEY_HERE",
  authDomain: "PASTE_YOUR_PROJECT.firebaseapp.com",
  projectId: "PASTE_YOUR_PROJECT_ID",
  storageBucket: "PASTE_YOUR_PROJECT.appspot.com",
  messagingSenderId: "PASTE_YOUR_SENDER_ID",
  appId: "PASTE_YOUR_APP_ID"
};

firebase.initializeApp(firebaseConfig);

window.db = firebase.firestore();
window.auth = firebase.auth ? firebase.auth() : null;
window.firebase = firebase;

// Optional: better offline behavior for Firestore reads
try {
  window.db.enablePersistence({ synchronizeTabs: true }).catch(() => {});
} catch (e) {}
