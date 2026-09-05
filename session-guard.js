// ============================================================
// session-guard.js — Mostafa Salem Platform
// يحمي الصفحات المحمية ويتحقق من الجلسة
// ============================================================

(function() {
  'use strict';

  const SESSION_KEY  = 'alamin_current';
  const REMEMBER_KEY = 'alamin_session_remember';

  /* ── تحميل الجلسة (يدعم النظام الجديد والقديم) ── */
  function loadSession() {
    try {
      const raw = localStorage.getItem(REMEMBER_KEY);
      if (raw) {
        const s = JSON.parse(raw);
        if (s && s.user) {
          if (s.expiresAt && Date.now() > s.expiresAt) {
            clearSession(); return null;
          }
          return s.user;
        }
      }
      const legacy = localStorage.getItem(SESSION_KEY);
      return legacy ? JSON.parse(legacy) : null;
    } catch(e) { return null; }
  }

  function clearSession() {
    try {
      localStorage.removeItem(SESSION_KEY);
      localStorage.removeItem(REMEMBER_KEY);
      localStorage.removeItem('alamin_remember');
      sessionStorage.removeItem(SESSION_KEY);
    } catch(e) {}
  }

  function getCurrentUser() {
    return loadSession();
  }

  function redirectToLogin(reason) {
    try {
      console.warn('[SessionGuard] Redirecting to login:', reason);
      clearSession();
      const next = encodeURIComponent(
        location.pathname.split('/').pop() + location.search
      );
      window.location.replace('login.html?next=' + next);
    } catch(e) {}
  }

  // ── Core Guard ──────────────────────────────────────────
  const SessionGuard = {

    requireLogin: function() {
      const user = loadSession();
      if (!user || !user.id) {
        redirectToLogin('no session');
        return null;
      }
      return user;
    },

    requireAdmin: function() {
      const user = loadSession();
      if (!user || !user.id) {
        redirectToLogin('no session for admin page');
        return null;
      }
      // الداشبورد تتحقق من sessionStorage أيضاً (admin gate)
      if (user.role !== 'admin') {
        const adminOk = sessionStorage.getItem('mostafa_salem_admin_ok');
        if (!adminOk) {
          // طالب عادي يحاول الوصول للداشبورد → رجّعه للرئيسية
          window.location.replace('index.html');
          return null;
        }
      }
      return user;
    },

    verifySessionActive: async function() {
      const user = loadSession();
      if (!user || !user.phone) return true;

      try {
        if (!window.db) return true;
        const snap = await window.db
          .collection('students')
          .doc(String(user.phone))
          .get({ source: 'server' });

        if (!snap.exists) return true;
        const data = snap.data();

        if (data.sessionRevoked === true) {
          console.warn('[SessionGuard] Session revoked by admin');
          redirectToLogin('session revoked');
          return false;
        }

        // تحديث البيانات المحلية من Firestore
        if (data.name || data.grade) {
          const refreshed = Object.assign({}, user, {
            name:            data.name         || user.name,
            grade:           data.grade        || user.grade,
            parentPhone:     data.parentPhone  || user.parentPhone,
            enrolledCourses: data.enrolledCourses || user.enrolledCourses || [],
          });
          localStorage.setItem(SESSION_KEY, JSON.stringify(refreshed));
          // تحديث الـ remember session أيضاً
          try {
            const raw = localStorage.getItem(REMEMBER_KEY);
            if (raw) {
              const s = JSON.parse(raw);
              s.user = refreshed;
              localStorage.setItem(REMEMBER_KEY, JSON.stringify(s));
            }
          } catch(_) {}
        }

        return true;
      } catch(err) {
        console.warn('[SessionGuard] verifySessionActive error (non-fatal):', err.message);
        return true;
      }
    },

    getUser: getCurrentUser,

    logout: function() {
      clearSession();
      window.location.href = 'login.html';
    },
  };

  window.SessionGuard = SessionGuard;

  // ── auto-guard: حماية الصفحات المحمية فقط ──────────────
  (function autoGuard() {
    const user = loadSession();
    const currentPage = location.pathname.split('/').pop().toLowerCase();

    // صفحات تحتاج تسجيل دخول (طالب أو أدمن)
    const studentPages = ['lessons.html'];
    // صفحات تحتاج صلاحية أدمن
    const adminPages   = ['dashboard.html'];

    if (adminPages.some(p => currentPage.includes(p.replace('.html','')))) {
      if (!user) {
        redirectToLogin('auto-guard: no session on admin page');
        return;
      }
      // الأدمن يمر، الطالب العادي يُعاد توجيهه للرئيسية
      if (user.role !== 'admin') {
        const adminOk = sessionStorage.getItem('mostafa_salem_admin_ok');
        if (!adminOk) {
          window.location.replace('index.html');
          return;
        }
      }
    }

    if (studentPages.some(p => currentPage.includes(p.replace('.html','')))) {
      if (!user) {
        redirectToLogin('auto-guard: no session on protected page');
        return;
      }
    }
  })();

})();
