'use strict';

/**
 * Grade table — based on percentage
 */
const GRADE_TABLE = [
  { min: 90, grade: 'O',  gradePoint: 10 },
  { min: 80, grade: 'A+', gradePoint: 9 },
  { min: 70, grade: 'A',  gradePoint: 8 },
  { min: 60, grade: 'B+', gradePoint: 7 },
  { min: 55, grade: 'B',  gradePoint: 6 },
  { min: 50, grade: 'C',  gradePoint: 5 },
  { min: 45, grade: 'D',  gradePoint: 4 },
  { min: 40, grade: 'P',  gradePoint: 4 },
  { min: 0,  grade: 'F',  gradePoint: 0 },
];

const calcGrade = (percentage) => {
  const entry = GRADE_TABLE.find((g) => percentage >= g.min);
  return entry ? entry.grade : 'F';
};

const calcGradePoint = (percentage) => {
  const entry = GRADE_TABLE.find((g) => percentage >= g.min);
  return entry ? entry.gradePoint : 0;
};

/**
 * Calculate totals for internal assessment entries.
 * entries: [{ type, marks, maxMarks }]
 */
const calcTotalInternal = (entries) => {
  const relevantTypes = ['internal1', 'internal2', 'internal3', 'lab', 'assignment', 'quiz'];
  const relevant = entries.filter((e) => relevantTypes.includes(e.type));
  const total = relevant.reduce((s, e) => s + (e.marks || 0), 0);
  const maxTotal = relevant.reduce((s, e) => s + (e.maxMarks || 0), 0);
  return { total, maxTotal };
};

/**
 * Calculate SGPA from subject grades.
 */
const calcSGPA = (subjects) => {
  let totalCredits = 0;
  let weightedPoints = 0;
  for (const sub of subjects) {
    const credits = sub.subject?.credits || 3;
    const gp = calcGradePoint(sub.percentage);
    weightedPoints += credits * gp;
    totalCredits += credits;
  }
  return totalCredits > 0 ? +(weightedPoints / totalCredits).toFixed(2) : 0;
};

module.exports = { calcGrade, calcGradePoint, calcTotalInternal, calcSGPA };
