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

// Better offline behavior for Firestore reads.
// FIX: إضافة معالجة صريحة لخطأ failed-precondition (لما بيكون فيه أكتر من tab مفتوح)
// وخطأ unimplemented (لما المتصفح مش بيدعم IndexedDB).
// في الحالتين: الـ onSnapshot بيفضل شغال من الـ network مباشرة بدون offline cache —
// وده أحسن من إنه يفشل صامت ويقرأ بيانات قديمة أو فاضية.
try {
  window.db.enablePersistence({ synchronizeTabs: true }).catch((err) => {
    if (err.code === 'failed-precondition') {
      // أكتر من tab مفتوح في نفس الوقت — الكاش بيشتغل في tab واحد بس
      console.warn('[Firebase] Persistence disabled: multiple tabs open. Live data will come from network directly.');
    } else if (err.code === 'unimplemented') {
      // المتصفح مش بيدعم offline persistence
      console.warn('[Firebase] Persistence not supported in this browser. Running in online-only mode.');
    } else {
      console.warn('[Firebase] Persistence error:', err.code, err.message);
    }
    // في كل الحالات: الـ Firestore بيفضل يشتغل عادي من الـ network
  });
} catch (e) {
  console.warn('[Firebase] enablePersistence threw:', e);
}
