// ═══════════════════════════════════════════════════════════════════════
//  sw.js — Service Worker (PWA)
//  منصة مستر مصطفى سالم لتعليم اللغة الإنجليزية
// ═══════════════════════════════════════════════════════════════════════
//  ملاحظة مهمة عن التوافق مع cache-buster.js الموجود بالفعل في المشروع:
//  المشروع يعتمد على فحص دوري لـ version.json من جهة الـ client (cache-buster.js)
//  وعند وجود إصدار جديد يمسح كل الـ Cache Storage ويُلغي تسجيل كل الـ Service
//  Workers ثم يعمل Hard Reload. هذا الملف مصمَّم ليتوافق مع هذه الآلية وليس
//  ليحل محلها:
//    • إستراتيجية "Network First" لكل شيء تقريبًا — يفضّل الشبكة دائمًا،
//      ولا يعرض من الـ Cache إلا عند فشل الاتصال فعلاً (Offline).
//    • لا يتم تخزين أو خدمة version.json من الـ Cache أبدًا — حتى تستمر
//      آلية اكتشاف التحديثات الحالية في العمل بدون أي تعارض.
//    • لا يتم التعرض لطلبات Firebase / Firestore / Google APIs إطلاقًا.
//    • عند كل تحديث لرقم الإصدار (عبر update-version.sh/.ps1) يتغيّر
//      CACHE_VERSION هنا تلقائيًا، فيلاحظ المتصفح تغيّر الملف نفسه
//      ويبدأ دورة تحديث الـ Service Worker الطبيعية.
// ═══════════════════════════════════════════════════════════════════════

'use strict';

// يُحدَّث تلقائياً بواسطة update-version.sh / update-version.ps1
const CACHE_VERSION = '20260917-1015';
const CACHE_NAME = 'mostafa-salem-pwa-' + CACHE_VERSION;

// أصول أساسية يتم تجهيزها مسبقاً (App Shell) لدعم فتح أسرع وعمل بسيط Offline
const PRECACHE_URLS = [
    './',
    './index.html',
    './style.css',
    './manifest.json',
    './icon-192.png',
    './icon-512.png'
];

// نطاقات لا يجب على الـ Service Worker التعرض لطلباتها إطلاقاً
const NEVER_INTERCEPT_PATTERNS = [
    /version\.json/i,
    /firestore\.googleapis\.com/i,
    /firebaseio\.com/i,
    /googleapis\.com/i,
    /gstatic\.com/i,
    /google-analytics\.com/i,
    /googletagmanager\.com/i
];

function shouldBypass(request) {
    if (request.method !== 'GET') return true;
    var url = request.url;
    for (var i = 0; i < NEVER_INTERCEPT_PATTERNS.length; i++) {
        if (NEVER_INTERCEPT_PATTERNS[i].test(url)) return true;
    }
    return false;
}

// ── التثبيت: تجهيز الأصول الأساسية ─────────────────────────────────────
self.addEventListener('install', function (event) {
    event.waitUntil(
        caches.open(CACHE_NAME).then(function (cache) {
            return cache.addAll(PRECACHE_URLS).catch(function (err) {
                // لا نفشل التثبيت بالكامل لو أحد الأصول غير متاح مؤقتاً
                console.warn('[sw.js] بعض أصول الـ precache لم تُحمَّل:', err);
            });
        }).then(function () {
            return self.skipWaiting();
        })
    );
});

// ── التفعيل: تنظيف الإصدارات القديمة من الـ Cache فقط (لا نلمس localStorage) ──
self.addEventListener('activate', function (event) {
    event.waitUntil(
        caches.keys().then(function (names) {
            return Promise.all(
                names
                    .filter(function (name) { return name.indexOf('mostafa-salem-pwa-') === 0 && name !== CACHE_NAME; })
                    .map(function (name) { return caches.delete(name); })
            );
        }).then(function () {
            return self.clients.claim();
        })
    );
});

// ── الجلب: Network First مع الرجوع للـ Cache فقط عند انقطاع الاتصال ─────
self.addEventListener('fetch', function (event) {
    var request = event.request;

    if (shouldBypass(request)) {
        return; // اترك الطلب يمر مباشرة للشبكة بدون أي تدخل
    }

    event.respondWith(
        fetch(request).then(function (response) {
            // خزّن نسخة ناجحة فقط من نفس الأصل (same-origin)
            if (response && response.ok && new URL(request.url).origin === self.location.origin) {
                var responseClone = response.clone();
                caches.open(CACHE_NAME).then(function (cache) {
                    cache.put(request, responseClone);
                });
            }
            return response;
        }).catch(function () {
            // Offline fallback: اعرض آخر نسخة محفوظة إن وُجدت
            return caches.match(request).then(function (cached) {
                if (cached) return cached;
                if (request.mode === 'navigate') {
                    return caches.match('./index.html');
                }
                return new Response('', { status: 504, statusText: 'Offline' });
            });
        })
    );
});

// ── السماح للصفحة بطلب تحديث فوري عند الحاجة ────────────────────────────
self.addEventListener('message', function (event) {
    if (event.data === 'SKIP_WAITING') {
        self.skipWaiting();
    }
});
