import jsPDF from 'jspdf';
import type { MsmeReport } from '../types';

export const exportTextPdf = (title: string, sections: { heading: string; lines: string[] }[]) => {
  const doc = new jsPDF({ unit: 'pt', format: 'a4' });
  const margin = 44;
  let y = 54;

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(18);
  doc.text(title, margin, y);
  y += 30;

  sections.forEach((section) => {
    if (y > 740) {
      doc.addPage();
      y = 54;
    }
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(12);
    doc.text(section.heading, margin, y);
    y += 18;
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(10);
    section.lines.forEach((line) => {
      const wrapped = doc.splitTextToSize(line, 500) as string[];
      wrapped.forEach((part) => {
        if (y > 780) {
          doc.addPage();
          y = 54;
        }
        doc.text(part, margin, y);
        y += 14;
      });
      y += 4;
    });
    y += 12;
  });

  doc.save(`${title.toLowerCase().replace(/[^a-z0-9]+/g, '-')}.pdf`);
};

export const exportMsmeReportPdf = (report: MsmeReport) => {
  exportTextPdf(report.title, [
    { heading: 'Executive Summary', lines: [report.executiveSummary] },
    { heading: 'DPR Report', lines: report.dprReport },
    { heading: 'Financial Projections', lines: report.financialProjections },
    { heading: 'Profit Analysis', lines: report.profitAnalysis },
    { heading: 'Break-even Analysis', lines: report.breakEvenAnalysis },
    { heading: 'PMEGP/MSME Format', lines: report.msmeFormat },
    { heading: 'Bank-ready Checklist', lines: report.bankReadiness },
  ]);
};
