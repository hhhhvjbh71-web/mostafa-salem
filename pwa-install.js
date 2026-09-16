// ═══════════════════════════════════════════════════════════════════════
//  pwa-install.js — نافذة تثبيت التطبيق (PWA Install Prompt)
//  منصة مستر مصطفى سالم لتعليم اللغة الإنجليزية
// ═══════════════════════════════════════════════════════════════════════
//  • يعمل فوق النظام الحالي بدون أي تعديل على منطق تسجيل الدخول/الجلسات.
//  • لا يخزّن أي "تم الرفض نهائياً" — يظهر مرة أخرى في كل دخول جديد للمنصة
//    طالما أن التطبيق لم يتم تثبيته بعد (حسب طلب المستخدم).
//  • يكتشف: Android/Desktop (Chrome/Edge/Samsung/Opera) عبر beforeinstallprompt،
//    iOS Safari عبر تعليمات يدوية (لا يدعم iOS الحدث أصلاً)، ويتجاهل بهدوء
//    أي متصفح آخر لا يدعم أيًا من الطريقتين بدل إظهار زر لا يعمل.
// ═══════════════════════════════════════════════════════════════════════

(function () {
    'use strict';

    var deferredPrompt = null;
    var dismissedThisVisit = false;
    var SHOW_DELAY_MS = 2200;

    function isStandalone() {
        try {
            if (window.matchMedia && window.matchMedia('(display-mode: standalone)').matches) return true;
            if (window.navigator && window.navigator.standalone === true) return true;
        } catch (e) { }
        return false;
    }

    function isIOS() {
        var ua = window.navigator.userAgent || '';
        var isIphoneIpad = /iPad|iPhone|iPod/.test(ua);
        var isIpadOS13Plus = navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1;
        return isIphoneIpad || isIpadOS13Plus;
    }

    function isAndroid() {
        return /Android/i.test(window.navigator.userAgent || '');
    }

    // ── التقاط beforeinstallprompt مبكراً (قد يحدث قبل تحميل الصفحة بالكامل) ──
    window.addEventListener('beforeinstallprompt', function (e) {
        e.preventDefault();
        deferredPrompt = e;
        maybeShowAfterDelay();
    });

    window.addEventListener('appinstalled', function () {
        deferredPrompt = null;
        hideModal();
        try { console.log('[pwa-install] تم تثبيت التطبيق بنجاح'); } catch (e) { }
    });

    function buildModal(mode) {
        var existing = document.getElementById('pwa-install-modal');
        if (existing) existing.remove();

        var wrap = document.createElement('div');
        wrap.id = 'pwa-install-modal';
        wrap.setAttribute('role', 'dialog');
        wrap.setAttribute('aria-label', 'Install app');

        var isIosMode = mode === 'ios';

        wrap.innerHTML =
            '<div class="pwa-sheet-backdrop"></div>' +
            '<div class="pwa-sheet" role="document">' +
                '<button class="pwa-sheet-close" aria-label="Close" type="button">&times;</button>' +
                '<div class="pwa-sheet-icon"><img src="icon-192.png" alt="" width="64" height="64"></div>' +
                '<h3 class="pwa-sheet-title">' + (isIosMode ? '📱 Install Mr. Mostafa Salem' : '📱 Install Mr. Mostafa Salem') + '</h3>' +
                '<p class="pwa-sheet-desc">Get faster access from your home screen — open lessons, exams, and homework in one tap.</p>' +
                (isIosMode
                    ? '<div class="pwa-ios-steps">' +
                        '<div class="pwa-ios-step"><span class="pwa-ios-step-num">1</span><span>Tap the <strong>Share</strong> icon <span class="pwa-ios-share-glyph">&#x2963;</span> in Safari\'s toolbar</span></div>' +
                        '<div class="pwa-ios-step"><span class="pwa-ios-step-num">2</span><span>Choose <strong>&ldquo;Add to Home Screen&rdquo;</strong></span></div>' +
                      '</div>' +
                      '<button class="pwa-btn-primary" id="pwa-ios-got-it" type="button">Got it</button>'
                    : '<button class="pwa-btn-primary" id="pwa-install-btn" type="button">Install App Now</button>' +
                      '<button class="pwa-btn-secondary" id="pwa-install-later" type="button">Not Now</button>'
                ) +
            '</div>';

        document.body.appendChild(wrap);
        requestAnimationFrame(function () { wrap.classList.add('pwa-sheet-visible'); });

        wrap.querySelector('.pwa-sheet-close').addEventListener('click', dismiss);
        wrap.querySelector('.pwa-sheet-backdrop').addEventListener('click', dismiss);

        if (isIosMode) {
            document.getElementById('pwa-ios-got-it').addEventListener('click', dismiss);
        } else {
            document.getElementById('pwa-install-later').addEventListener('click', dismiss);
            document.getElementById('pwa-install-btn').addEventListener('click', function () {
                if (!deferredPrompt) { dismiss(); return; }
                deferredPrompt.prompt();
                deferredPrompt.userChoice.then(function () {
                    deferredPrompt = null;
                    hideModal();
                });
            });
        }

        function dismiss() {
            dismissedThisVisit = true;
            hideModal();
        }
    }

    function hideModal() {
        var el = document.getElementById('pwa-install-modal');
        if (!el) return;
        el.classList.remove('pwa-sheet-visible');
        setTimeout(function () { if (el && el.parentNode) el.parentNode.removeChild(el); }, 300);
    }

    function maybeShowAfterDelay() {
        if (dismissedThisVisit || isStandalone()) return;
        setTimeout(function () {
            if (dismissedThisVisit || isStandalone()) return;
            if (deferredPrompt) {
                buildModal('android');
            } else if (isIOS()) {
                buildModal('ios');
            }
            // متصفحات أخرى بلا دعم تثبيت واضح: لا نعرض شيئاً بدل زر لا يعمل
        }, SHOW_DELAY_MS);
    }

    // ── نقطة الدخول ─────────────────────────────────────────────────────
    if (isStandalone()) return; // مثبت بالفعل — لا إزعاج

    if (isIOS()) {
        // iOS لا يطلق beforeinstallprompt إطلاقاً، اعرض التعليمات مباشرة بعد التأخير
        if (document.readyState === 'complete') {
            maybeShowAfterDelay();
        } else {
            window.addEventListener('load', maybeShowAfterDelay);
        }
    }
    // لغير iOS: الانتظار لحدث beforeinstallprompt نفسه (لو المتصفح يدعمه) قبل أي عرض
})();
