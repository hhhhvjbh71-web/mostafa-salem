// ============================================================
// session-guard.js — Mostafa Salem English Academy
// Lightweight session validation helper for protected pages
// (lessons.html, dashboard.html, etc.)
// Loaded AFTER firebase-config.js so window.db is available.
// ============================================================

(function() {
  'use strict';

  // ── helpers ──────────────────────────────────────────────

  function getCurrentUser() {
    try {
      return JSON.parse(localStorage.getItem('alamin_current') || 'null');
    } catch (e) {
      return null;
    }
  }

  function redirectToLogin(reason) {
    try {
      console.warn('[SessionGuard] Redirecting to login:', reason);
      // Clear stale session data
      localStorage.removeItem('alamin_current');
      const next = encodeURIComponent(
        location.pathname.split('/').pop() + location.search
      );
      window.location.replace('login.html?next=' + next);
    } catch (e) {}
  }

  // ── core guard ───────────────────────────────────────────

  const SessionGuard = {

    /**
     * Checks that a valid session exists in localStorage.
     * Call this on DOMContentLoaded for protected pages.
     * @returns {object|null} user object, or null (and redirects)
     */
    requireLogin: function() {
      const user = getCurrentUser();
      if (!user || !user.id) {
        redirectToLogin('no session');
        return null;
      }
      return user;
    },

    /**
     * Optional: verify session is still active against Firestore.
     * Returns true if valid, false if the session has been revoked.
     * Non-blocking — page still works while this resolves.
     * @returns {Promise<boolean>}
     */
    verifySessionActive: async function() {
      const user = getCurrentUser();
      if (!user || !user.phone) return true; // no phone = local-only session, allow

      try {
        if (!window.db) return true; // Firebase not ready yet — allow

        const docId = String(user.phone);
        const snap = await window.db
          .collection('students')
          .doc(docId)
          .get({ source: 'server' });

        if (!snap.exists) return true; // new student not yet synced — allow

        const data = snap.data();

        // If admin revoked this session, data.sessionRevoked will be true
        if (data.sessionRevoked === true) {
          console.warn('[SessionGuard] Session revoked by admin');
          redirectToLogin('session revoked');
          return false;
        }

        // Optionally refresh local user data with latest from Firestore
        if (data.name || data.grade) {
          const refreshed = Object.assign({}, user, {
            name:         data.name         || user.name,
            grade:        data.grade        || user.grade,
            parentPhone:  data.parentPhone  || user.parentPhone,
            enrolledCourses: data.enrolledCourses || user.enrolledCourses || [],
          });
          localStorage.setItem('alamin_current', JSON.stringify(refreshed));
        }

        return true;

      } catch (err) {
        // Network / Firestore error — don't block the user
        console.warn('[SessionGuard] verifySessionActive error (non-fatal):', err.message);
        return true;
      }
    },

    /**
     * Returns current user from localStorage (no network call).
     * @returns {object|null}
     */
    getUser: getCurrentUser,

    /**
     * Logout helper — clears localStorage and redirects.
     */
    logout: function() {
      localStorage.removeItem('alamin_current');
      localStorage.removeItem('alamin_remember');
      window.location.href = 'login.html';
    },
  };

  // Expose globally
  window.SessionGuard = SessionGuard;

  // ── auto-guard: redirect immediately if no session ───────
  // (Backup for pages that don't run the inline guest-gate script)
  (function autoGuard() {
    const user = getCurrentUser();
    if (!user) {
      // Only redirect if we're on a clearly protected page
      const protectedPages = ['lessons.html'];
      const currentPage = location.pathname.split('/').pop().toLowerCase();
      if (protectedPages.some(p => currentPage.includes(p.replace('.html', '')))) {
        redirectToLogin('auto-guard: no session on protected page');
      }
    }
  })();

})();
