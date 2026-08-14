// ============================================================
// i18n.js — Mustafa Salem English Academy language switcher (AR <-> EN)
// Include this AFTER your page's own inline <script> definitions
// that don't depend on it, and make sure every translatable element
// carries: data-i18n="key"  (for textContent)
//       or data-i18n-placeholder="key" (for input placeholder)
//       or data-i18n-html="key" (for innerHTML, used sparingly — only
//          for simple strings with inline <a>/<span> already present)
// Call setLanguage('ar' | 'en') to switch. Defaults to 'ar'.
// ============================================================

const MOSTAFA_SALEM_DICT = {
  // ---- shared / nav / footer ----
  brand_sub:            { ar: 'أ. مصطفى سالم',                         en: 'Mr. Mostafa Salem' },
  nav_home:              { ar: 'الرئيسية',                             en: 'Home' },
  nav_courses:           { ar: 'الكورسات',                             en: 'Courses' },
  nav_login:             { ar: 'تسجيل الدخول',                         en: 'Login' },
  nav_signup:            { ar: 'إنشاء حساب',                           en: 'Sign Up' },
  nav_dashboard:         { ar: 'لوحة التحكم',                          en: 'Dashboard' },
  nav_why_us:            { ar: 'ليه إحنا',                              en: 'Why Us' },
  nav_teacher:           { ar: 'المدرس',                                en: 'Teacher' },
  nav_reviews:           { ar: 'آراء الطلاب',                           en: 'Reviews' },
  nav_faq:               { ar: 'الأسئلة الشائعة',                       en: 'FAQ' },
  nav_my_courses:        { ar: '🎓 كورساتي',                            en: '🎓 My Courses' },
  nav_logout:            { ar: '🚪 تسجيل خروج',                          en: '🚪 Logout' },
  nav_install_app:       { ar: '⬇ تثبيت التطبيق',                       en: '⬇ Install App' },
  nav_home_icon:         { ar: '🏠 الرئيسية',                           en: '🏠 Home' },
  nav_courses_icon:      { ar: '📚 الكورسات',                           en: '📚 Courses' },
  nav_why_us_icon:       { ar: '⭐ ليه إحنا',                            en: '⭐ Why Us' },
  nav_teacher_icon:      { ar: '👨‍🏫 المدرس',                            en: '👨‍🏫 Teacher' },
  nav_reviews_icon:      { ar: '💬 آراء الطلاب',                        en: '💬 Reviews' },
  nav_faq_icon:          { ar: '❓ الأسئلة الشائعة',                     en: '❓ FAQ' },

  // ---- hero / stats ----
  hero_badge:            { ar: '🦆 أكاديمية مصطفى سالم للغة الإنجليزية',    en: '🦆 Mostafa Salem English Academy' },
  hero_title_line1:      { ar: 'أتقن اللغة الإنجليزية',                  en: 'Master English' },
  hero_title_line2:      { ar: 'بكل ثقة',                                en: 'With Confidence' },
  hero_subtitle:         { ar: 'أكاديمية مصطفى سالم للغة الإنجليزية',       en: 'Mostafa Salem English Academy' },
  hero_start_learning:   { ar: '🚀 ابدأ التعلم',                         en: '🚀 Start Learning' },
  hero_browse_courses:   { ar: '📖 تصفح الكورسات',                       en: '📖 Browse Courses' },
  stat_active_students:  { ar: 'طالب نشط',                              en: 'Active Students' },
  stat_courses:          { ar: 'كورس',                                  en: 'Courses' },
  stat_video_lessons:    { ar: 'درس فيديو',                             en: 'Video Lessons' },
  stat_success_rate:     { ar: 'نسبة النجاح %',                          en: 'Success Rate %' },
  stat_years_experience: { ar: 'سنوات خبرة',                            en: 'Years Experience' },
  back_home:             { ar: '← العودة للرئيسية',                    en: '← Back to Home' },
  footer_tagline:        { ar: '© 2026 أكاديمية مصطفى سالم — أبداً لا تستسلم', en: '© 2026 Mostafa Salem English Academy — Never Give Up' },

  // ---- login/register page ----
  auth_title_login:      { ar: 'أهلاً بعودتك',                         en: 'Welcome Back' },
  auth_sub_login:         { ar: 'سجّل دخولك عشان تكمل رحلتك',           en: 'Sign in to continue your journey' },
  auth_title_register:    { ar: 'أنشئ حسابك',                          en: 'Create Your Account' },
  auth_sub_register:      { ar: 'انضم لأكاديمية مصطفى سالم دلوقتي',        en: 'Join Mostafa Salem English Academy today' },
  tab_login:              { ar: '🔑 تسجيل الدخول',                     en: '🔑 Login' },
  tab_register:           { ar: '✨ إنشاء حساب',                        en: '✨ Sign Up' },
  label_phone:            { ar: 'رقم الهاتف',                          en: 'Phone Number' },
  label_password:         { ar: 'كلمة المرور',                         en: 'Password' },
  label_confirm_password: { ar: 'تأكيد كلمة المرور',                   en: 'Confirm Password' },
  label_fullname:         { ar: 'الاسم بالكامل',                       en: 'Full Name' },
  label_parent_phone:     { ar: 'رقم هاتف ولي الأمر',                  en: "Parent's Phone Number" },
  label_grade:            { ar: 'الصف الدراسي',                        en: 'Grade / Level' },
  placeholder_phone:      { ar: '01xxxxxxxxx',                         en: '01xxxxxxxxx' },
  placeholder_password:   { ar: 'اكتب كلمة المرور',                    en: 'Enter your password' },
  placeholder_password_min:{ ar: '6 أحرف على الأقل',                   en: 'At least 6 characters' },
  placeholder_password_again:{ ar: 'أعد كتابة كلمة المرور',            en: 'Re-enter password' },
  placeholder_fullname:   { ar: 'اكتب اسمك بالكامل',                   en: 'Your full name' },
  select_grade_default:   { ar: 'اختر صفك الدراسي',                    en: 'Select your grade' },
  remember_me:            { ar: 'تذكرني',                              en: 'Remember me' },
  forgot_password:        { ar: 'نسيت كلمة المرور؟',                   en: 'Forgot password?' },
  agree_terms:            { ar: 'أوافق على الشروط والأحكام',            en: 'I agree to the Terms & Conditions' },
  btn_login:              { ar: '🚀 تسجيل الدخول',                     en: '🚀 Login' },
  btn_login_loading:      { ar: 'جارٍ تسجيل الدخول...',                en: 'Signing in...' },
  btn_register:           { ar: '🎉 إنشاء الحساب',                     en: '🎉 Create Account' },
  btn_register_loading:   { ar: 'جارٍ إنشاء الحساب...',                en: 'Creating account...' },
  divider_or:             { ar: 'أو',                                  en: 'or' },
  switch_to_register:     { ar: 'مفيش حساب؟ ',                         en: "Don't have an account? " },
  switch_to_register_link:{ ar: 'اعمل حساب دلوقتي',                    en: 'Sign up now' },
  switch_to_login:        { ar: 'عندك حساب؟ ',                         en: 'Already have an account? ' },
  switch_to_login_link:   { ar: 'سجّل دخولك من هنا',                   en: 'Login here' },

  // ---- form validation / status messages ----
  err_invalid_phone:      { ar: 'من فضلك اكتب رقم هاتف مصري صحيح.',     en: 'Please enter a valid Egyptian phone number.' },
  err_invalid_parent_phone:{ ar: 'من فضلك اكتب رقم هاتف ولي الأمر بشكل صحيح.', en: "Please enter a valid parent's phone number." },
  err_password_length:    { ar: 'كلمة المرور لازم تكون 6 أحرف على الأقل.', en: 'Password must be at least 6 characters.' },
  err_password_mismatch:  { ar: 'كلمتا المرور غير متطابقتين.',           en: 'Passwords do not match.' },
  err_account_exists:     { ar: 'يوجد حساب بهذا الرقم بالفعل. من فضلك سجّل دخولك.', en: 'An account with this phone number already exists. Please login instead.' },
  err_missing_credentials:{ ar: 'من فضلك اكتب رقم الهاتف وكلمة المرور.', en: 'Please enter your phone number and password.' },
  err_no_account:         { ar: 'لا يوجد حساب بهذا الرقم. من فضلك أنشئ حساب أولاً.', en: 'No account found with this phone number. Please sign up first.' },
  err_wrong_password:     { ar: 'كلمة المرور غير صحيحة. حاول مرة أخرى.', en: 'Incorrect password. Please try again.' },
  msg_account_created:    { ar: 'تم إنشاء الحساب! جارٍ تحويلك للوحة الدروس...', en: 'Account created! Redirecting to your dashboard...' },
  msg_welcome_back:        { ar: 'أهلاً بعودتك، __NAME__! جارٍ التحويل...',  en: 'Welcome back, __NAME__! Redirecting...' },
  msg_already_signed_in:  { ar: 'أنت مسجل دخولك بالفعل باسم __NAME__.',  en: 'You are already signed in as __NAME__.' },
  forgot_password_alert:  { ar: 'من فضلك تواصل مع أ. مصطفى سالم على تليجرام لإعادة تعيين كلمة المرور.', en: 'Please contact Mr. Mostafa Salem on Telegram to reset your password.' },
};

function mostafaSalemGetLang(){
  return localStorage.getItem('mostafa_salem_lang') || 'ar';
}

function applyLanguage(lang){
  document.documentElement.setAttribute('lang', lang === 'ar' ? 'ar' : 'en');
  document.documentElement.setAttribute('dir', lang === 'ar' ? 'rtl' : 'ltr');

  document.querySelectorAll('[data-i18n]').forEach(el => {
    const key = el.getAttribute('data-i18n');
    const entry = MOSTAFA_SALEM_DICT[key];
    if (entry) el.textContent = entry[lang] || entry.ar;
  });
  document.querySelectorAll('[data-i18n-placeholder]').forEach(el => {
    const key = el.getAttribute('data-i18n-placeholder');
    const entry = MOSTAFA_SALEM_DICT[key];
    if (entry) el.setAttribute('placeholder', entry[lang] || entry.ar);
  });

  const btn = document.getElementById('langToggleLabel');
  if (btn) btn.textContent = lang === 'ar' ? 'EN' : 'ع';

  document.dispatchEvent(new CustomEvent('mostafa_salem:langchange', { detail: { lang } }));
}

function setLanguage(lang){
  localStorage.setItem('mostafa_salem_lang', lang);
  applyLanguage(lang);
}

function toggleLanguage(){
  setLanguage(mostafaSalemGetLang() === 'ar' ? 'en' : 'ar');
}

function t(key){
  const entry = MOSTAFA_SALEM_DICT[key];
  if (!entry) return key;
  return entry[mostafaSalemGetLang()] || entry.ar;
}

document.addEventListener('DOMContentLoaded', () => applyLanguage(mostafaSalemGetLang()));
