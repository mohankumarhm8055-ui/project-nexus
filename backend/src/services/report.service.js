'use strict';

const PDFDocument = require('pdfkit');
const ExcelJS = require('exceljs');
const path = require('path');
const fs = require('fs');
const Report = require('../models/Report');
const Student = require('../models/Student');
const Marks = require('../models/Marks');
const Attendance = require('../models/Attendance');
const { calcGrade } = require('../helpers/gradeCalc');
const logger = require('../config/logger');

const REPORTS_DIR = path.join(__dirname, '../../src/uploads/reports');
if (!fs.existsSync(REPORTS_DIR)) fs.mkdirSync(REPORTS_DIR, { recursive: true });

class ReportService {
  // ── Student Report Card PDF ───────────────────────────────────────────────
  async generateStudentReportCard(studentId, { semester, academicYear }) {
    const student = await Student.findById(studentId).populate('department', 'name code').lean();
    if (!student) throw new Error('Student not found');

    const marks = await Marks.find({ student: studentId, semester, academicYear, isPublished: true })
      .populate('subject', 'name code credits').lean();

    const attendance = await Attendance.aggregate([
      { $match: { student: student._id } },
      { $group: { _id: '$subject', total: { $sum: 1 }, present: { $sum: { $cond: [{ $eq: ['$status', 'present'] }, 1, 0] } } } },
    ]);

    const filename = `report_card_${student.usn}_sem${semester}_${Date.now()}.pdf`;
    const filepath = path.join(REPORTS_DIR, filename);

    await this._buildReportCardPDF(filepath, { student, marks, attendance, semester, academicYear });

    return filepath;
  }

  // ── Department Analytics Excel ────────────────────────────────────────────
  async generateDepartmentExcel(departmentId, { semester, academicYear }) {
    const students = await Student.find({ department: departmentId, semester }).populate('department', 'name').lean();
    const filename = `dept_analytics_sem${semester}_${Date.now()}.xlsx`;
    const filepath = path.join(REPORTS_DIR, filename);

    const workbook = new ExcelJS.Workbook();
    workbook.creator = 'Nexus Intellect';
    workbook.created = new Date();

    // Sheet 1: Student list
    const sheet = workbook.addWorksheet('Students', {
      pageSetup: { paperSize: 9, orientation: 'landscape' },
    });

    sheet.columns = [
      { header: 'USN', key: 'usn', width: 15 },
      { header: 'Name', key: 'name', width: 25 },
      { header: 'Semester', key: 'semester', width: 10 },
      { header: 'Section', key: 'section', width: 10 },
      { header: 'CGPA', key: 'cgpa', width: 10 },
    ];

    // Style header row
    sheet.getRow(1).font = { bold: true, color: { argb: 'FFFFFFFF' } };
    sheet.getRow(1).fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FF4F46E5' } };
    sheet.getRow(1).alignment = { horizontal: 'center' };

    students.forEach((s) => sheet.addRow({ usn: s.usn, name: s.name, semester: s.semester, section: s.section, cgpa: s.cgpa }));

    await workbook.xlsx.writeFile(filepath);
    return filepath;
  }

  // ── Internal PDF builder ──────────────────────────────────────────────────
  async _buildReportCardPDF(filepath, { student, marks, attendance, semester, academicYear }) {
    return new Promise((resolve, reject) => {
      const doc = new PDFDocument({ margin: 50, size: 'A4' });
      const stream = fs.createWriteStream(filepath);
      doc.pipe(stream);

      // Header
      doc.fontSize(22).font('Helvetica-Bold').fillColor('#4F46E5').text('NEXUS INTELLECT', { align: 'center' });
      doc.fontSize(12).fillColor('#64748B').text('Academic Operating System', { align: 'center' });
      doc.moveDown(0.5);

      doc.fontSize(16).fillColor('#1E293B').font('Helvetica-Bold').text('STUDENT REPORT CARD', { align: 'center' });
      doc.moveTo(50, doc.y).lineTo(545, doc.y).stroke('#4F46E5');
      doc.moveDown(1);

      // Student info
      doc.fontSize(11).font('Helvetica').fillColor('#1E293B');
      doc.text(`Name: ${student.name}`, 50);
      doc.text(`USN: ${student.usn}`, 50);
      doc.text(`Department: ${student.department?.name || 'N/A'}`, 50);
      doc.text(`Semester: ${semester} | Academic Year: ${academicYear}`, 50);
      doc.moveDown(1);

      // Marks table header
      doc.font('Helvetica-Bold').fontSize(10).fillColor('#FFFFFF');
      doc.rect(50, doc.y, 495, 20).fill('#4F46E5');
      doc.text('Subject', 55, doc.y - 15, { width: 200 });
      doc.text('Internal', 255, doc.y - 15, { width: 60, align: 'center' });
      doc.text('Attendance%', 315, doc.y - 15, { width: 80, align: 'center' });
      doc.text('Grade', 395, doc.y - 15, { width: 50, align: 'center' });
      doc.moveDown(0.5);

      // Marks rows
      doc.font('Helvetica').fontSize(10).fillColor('#1E293B');
      marks.forEach((m, i) => {
        const pct = m.maxMarks > 0 ? ((m.marks / m.maxMarks) * 100).toFixed(1) : '0.0';
        const grade = calcGrade(parseFloat(pct));
        const rowY = doc.y;
        if (i % 2 === 0) doc.rect(50, rowY - 3, 495, 18).fill('#F8FAFC').fillColor('#1E293B');
        doc.text(m.subject?.name || 'N/A', 55, rowY, { width: 200 });
        doc.text(`${m.marks}/${m.maxMarks}`, 255, rowY, { width: 60, align: 'center' });
        doc.text(`${pct}%`, 315, rowY, { width: 80, align: 'center' });
        doc.text(grade, 395, rowY, { width: 50, align: 'center' });
        doc.moveDown(0.5);
      });

      doc.moveDown(1);
      doc.font('Helvetica-Bold').fontSize(9).fillColor('#64748B')
        .text(`Generated by Nexus Intellect | ${new Date().toLocaleString('en-IN')}`, { align: 'center' });

      doc.end();
      stream.on('finish', resolve);
      stream.on('error', reject);
    });
  }
}

module.exports = new ReportService();
