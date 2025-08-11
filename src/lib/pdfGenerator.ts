import jsPDF from 'jspdf';
import { TaxComparison, TaxInputs, formatCurrency } from './taxCalculator';

export interface PdfReportData {
  inputs: TaxInputs;
  comparison: TaxComparison;
  generatedDate: string;
}

export function generateTaxReportPdf(data: PdfReportData): void {
  try {
    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.width;
    const margin = 20;
    let yPosition = 30;

    // Title
    doc.setFontSize(20);
    doc.setFont('helvetica', 'bold');
    doc.text('Tax Liability Comparison Report', pageWidth / 2, yPosition, { align: 'center' });
    
    yPosition += 15;
    doc.setFontSize(12);
    doc.setFont('helvetica', 'normal');
    doc.text(`Financial Year 2024-25 | Generated on: ${data.generatedDate}`, pageWidth / 2, yPosition, { align: 'center' });
    
    yPosition += 25;

    // Income Summary Section
    doc.setFontSize(14);
    doc.setFont('helvetica', 'bold');
    doc.text('Income Summary', margin, yPosition);
    yPosition += 10;

    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    doc.text(`Gross Salary: ${formatCurrency(data.inputs.grossSalary)}`, margin, yPosition);
    yPosition += 8;
    doc.text(`Other Income: ${formatCurrency(data.inputs.otherIncome)}`, margin, yPosition);
    yPosition += 8;
    doc.setFont('helvetica', 'bold');
    doc.text(`Total Income: ${formatCurrency(data.comparison.oldRegime.totalIncome)}`, margin, yPosition);
    yPosition += 20;

    // Deductions Summary (Old Regime)
    doc.setFontSize(14);
    doc.setFont('helvetica', 'bold');
    doc.text('Deductions Applied (Old Regime Only)', margin, yPosition);
    yPosition += 10;

    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    doc.text(`Standard Deduction: ${formatCurrency(50000)}`, margin, yPosition);
    yPosition += 8;
    doc.text(`Section 80C: ${formatCurrency(data.inputs.section80C)}`, margin, yPosition);
    yPosition += 8;
    doc.text(`Section 80D: ${formatCurrency(data.inputs.section80D)}`, margin, yPosition);
    yPosition += 8;
    doc.text(`Section 80CCD(1B): ${formatCurrency(data.inputs.section80CCD1B)}`, margin, yPosition);
    yPosition += 8;
    doc.text(`Section 80E: ${formatCurrency(data.inputs.section80E)}`, margin, yPosition);
    yPosition += 8;
    doc.text(`Section 80G: ${formatCurrency(data.inputs.section80G)}`, margin, yPosition);
    yPosition += 8;
    doc.text(`HRA Exemption: ${formatCurrency(data.inputs.hraExemption)}`, margin, yPosition);
    yPosition += 8;
    doc.text(`LTA: ${formatCurrency(data.inputs.lta)}`, margin, yPosition);
    yPosition += 8;
    doc.text(`Home Loan Interest: ${formatCurrency(data.inputs.homeLoanInterest)}`, margin, yPosition);
    yPosition += 15;

    // Tax Comparison Table
    doc.setFontSize(14);
    doc.setFont('helvetica', 'bold');
    doc.text('Tax Liability Comparison', margin, yPosition);
    yPosition += 15;

    // Table headers
    doc.setFontSize(10);
    doc.setFont('helvetica', 'bold');
    const col1 = margin;
    const col2 = margin + 80;
    const col3 = margin + 140;

    doc.text('Particulars', col1, yPosition);
    doc.text('Old Regime', col2, yPosition);
    doc.text('New Regime', col3, yPosition);
    yPosition += 5;

    // Draw line under headers
    doc.line(margin, yPosition, pageWidth - margin, yPosition);
    yPosition += 10;

    // Table data
    doc.setFont('helvetica', 'normal');
    const tableData = [
      ['Total Income', formatCurrency(data.comparison.oldRegime.totalIncome), formatCurrency(data.comparison.newRegime.totalIncome)],
      ['Total Deductions', formatCurrency(data.comparison.oldRegime.totalDeductions), formatCurrency(data.comparison.newRegime.totalDeductions)],
      ['Taxable Income', formatCurrency(data.comparison.oldRegime.taxableIncome), formatCurrency(data.comparison.newRegime.taxableIncome)],
      ['Tax Before Rebate', formatCurrency(data.comparison.oldRegime.taxBeforeRebate), formatCurrency(data.comparison.newRegime.taxBeforeRebate)],
      ['Rebate u/s 87A', formatCurrency(data.comparison.oldRegime.rebateAmount), formatCurrency(data.comparison.newRegime.rebateAmount)],
      ['Tax After Rebate', formatCurrency(data.comparison.oldRegime.taxAfterRebate), formatCurrency(data.comparison.newRegime.taxAfterRebate)],
      ['Surcharge', formatCurrency(data.comparison.oldRegime.surcharge), formatCurrency(data.comparison.newRegime.surcharge)],
      ['Health & Education Cess', formatCurrency(data.comparison.oldRegime.cess), formatCurrency(data.comparison.newRegime.cess)]
    ];

    tableData.forEach(row => {
      doc.text(row[0], col1, yPosition);
      doc.text(row[1], col2, yPosition);
      doc.text(row[2], col3, yPosition);
      yPosition += 8;
    });

    // Total tax row with bold formatting
    yPosition += 5;
    doc.line(margin, yPosition, pageWidth - margin, yPosition);
    yPosition += 10;
    doc.setFont('helvetica', 'bold');
    doc.text('Total Tax Liability', col1, yPosition);
    doc.text(formatCurrency(data.comparison.oldRegime.totalTax), col2, yPosition);
    doc.text(formatCurrency(data.comparison.newRegime.totalTax), col3, yPosition);
    yPosition += 20;

    // Recommendation Section
    doc.setFontSize(14);
    doc.setFont('helvetica', 'bold');
    doc.text('Tax Savings Recommendation', margin, yPosition);
    yPosition += 15;

    doc.setFontSize(12);
    doc.setFont('helvetica', 'normal');
    const recommendedRegimeName = data.comparison.recommendedRegime === 'old' ? 'Old Tax Regime' : 'New Tax Regime';
    const savingsText = `Recommended: ${recommendedRegimeName}`;
    const savingsAmount = `Potential Savings: ${formatCurrency(data.comparison.savings)}`;
    
    doc.text(savingsText, margin, yPosition);
    yPosition += 10;
    doc.text(savingsAmount, margin, yPosition);
    yPosition += 15;

    // Additional notes
    doc.setFontSize(10);
    doc.setFont('helvetica', 'italic');
    doc.text('Note: This calculation is based on the tax slabs and rules for FY 2024-25.', margin, yPosition);
    yPosition += 8;
    doc.text('Please consult a tax advisor for personalized tax planning advice.', margin, yPosition);

    // Footer
    const footerY = doc.internal.pageSize.height - 20;
    doc.setFontSize(8);
    doc.setFont('helvetica', 'normal');
    doc.text('Generated by Tax Calculator App', pageWidth / 2, footerY, { align: 'center' });

    // Save the PDF
    doc.save(`Tax_Comparison_Report_${new Date().getFullYear()}.pdf`);
  } catch (error) {
    console.error('Error generating PDF:', error);
    throw new Error('Failed to generate PDF report. Please try again.');
  }
}
