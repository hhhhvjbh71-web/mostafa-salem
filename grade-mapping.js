// ============================================================
// grade-mapping.js — Mostafa Salem English Academy
// Shared grade label + class helpers used by dashboard.html
// and any other file that loads this script.
// Must be loaded AFTER firebase-config.js (no Firebase dep here,
// but kept in the same load order for consistency).
// ============================================================

const GRADE_MAP = {
  prep1: { label: 'أولى إعدادي',   labelEn: '1st Prep',        cls: 'grade-prep1', color: '#6366f1' },
  prep2: { label: 'ثانية إعدادي',  labelEn: '2nd Prep',        cls: 'grade-prep2', color: '#8b5cf6' },
  prep3: { label: 'ثالثة إعدادي',  labelEn: '3rd Prep',        cls: 'grade-prep3', color: '#a855f7' },
  '1':   { label: 'أولى ثانوي',    labelEn: '1st Secondary',   cls: 'grade1',      color: '#0284c7' },
  '2':   { label: 'ثانية ثانوي',   labelEn: '2nd Secondary',   cls: 'grade2',      color: '#0ea5e9' },
  '3':   { label: 'ثالثة ثانوي',   labelEn: '3rd Secondary',   cls: 'grade3',      color: '#00C9A7' },
  all:   { label: 'جميع المراحل',  labelEn: 'All Grades',      cls: 'grade-all',   color: '#F5A623' },
};

/**
 * Returns the Arabic display label for a grade key.
 * @param {string} grade
 * @returns {string}
 */
window.gradeLabel = function(grade) {
  return (GRADE_MAP[grade] && GRADE_MAP[grade].label) || grade || '—';
};

/**
 * Returns the English display label for a grade key.
 * @param {string} grade
 * @returns {string}
 */
window.gradeLabelEn = function(grade) {
  return (GRADE_MAP[grade] && GRADE_MAP[grade].labelEn) || grade || '—';
};

/**
 * Returns the CSS badge class name for a grade key.
 * @param {string} grade
 * @returns {string}
 */
window.gradeClass = function(grade) {
  return (GRADE_MAP[grade] && GRADE_MAP[grade].cls) || 'grade-all';
};

/**
 * Returns the accent color hex for a grade key.
 * @param {string} grade
 * @returns {string}
 */
window.gradeColor = function(grade) {
  return (GRADE_MAP[grade] && GRADE_MAP[grade].color) || '#00C9A7';
};

/**
 * Returns true if the grade is a secondary (thanawi) grade.
 * @param {string} grade
 * @returns {boolean}
 */
window.isSecondaryGrade = function(grade) {
  return ['1', '2', '3'].includes(String(grade));
};

/**
 * Returns true if the grade is a preparatory (i3dadi) grade.
 * @param {string} grade
 * @returns {boolean}
 */
window.isPrepGrade = function(grade) {
  return ['prep1', 'prep2', 'prep3'].includes(String(grade));
};

/**
 * Full map — useful for iteration (building selects, etc.)
 */
window.GRADE_MAP = GRADE_MAP;
