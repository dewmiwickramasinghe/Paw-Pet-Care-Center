import React from 'react';
import { jsPDF } from 'jspdf';
import 'jspdf-autotable';

const GeneratePDF = ({ calculateSummary, companyName = "Premium Pet Nutrition" }) => {
  const generatePDF = () => {
    // Create new document
    const doc = new jsPDF('p', 'mm', 'a4');
    
    // Document constants
    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();
    const margin = 15;
    
    // Modern color scheme
    const primaryColor = [41, 128, 185]; // Blue
    const secondaryColor = [44, 62, 80]; // Dark blue/gray
    const accentColor = [142, 68, 173]; // Purple
    const textColor = [52, 73, 94]; // Dark slate
    const lightGray = [236, 240, 241]; // Light background
    
    // Simple header
    doc.setFillColor(...primaryColor);
    doc.rect(0, 0, pageWidth, 20, 'F');
    
    // Company name
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(16);
    doc.setTextColor(255, 255, 255);
    doc.text(companyName, margin, 13);
    
    // Report title
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(12);
    doc.text("INVENTORY REPORT", pageWidth - margin, 13, { align: 'right' });
    
    // Get data
    const summary = calculateSummary();
    const today = new Date().toLocaleDateString();
    const docRef = `INV-${Math.random().toString(36).substring(2, 6).toUpperCase()}`;
    
    // Add date and reference
    doc.setFontSize(10);
    doc.setTextColor(...textColor);
    doc.setFont('helvetica', 'normal');
    doc.text(`Generated: ${today}`, margin, 30);
    doc.text(`Ref: ${docRef}`, pageWidth - margin, 30, { align: 'right' });
    
    // Variables
    let yPosition = 40;
    let pageNumber = 1;
    let totalCost = 0;
    let totalProfit = 0;
    
    // Simple footer function
    const addFooter = () => {
      doc.setDrawColor(...primaryColor);
      doc.setLineWidth(0.5);
      doc.line(margin, pageHeight - 10, pageWidth - margin, pageHeight - 10);
      
      doc.setFontSize(8);
      doc.setTextColor(...textColor);
      doc.text(`Page ${pageNumber}`, margin, pageHeight - 5);
      doc.text(companyName, pageWidth / 2, pageHeight - 5, { align: 'center' });
      doc.text(`${docRef}`, pageWidth - margin, pageHeight - 5, { align: 'right' });
    };
    
    // Process each category
    Object.keys(summary).forEach((category) => {
      // Add page break if needed
      if (yPosition > pageHeight - 60) {
        addFooter();
        doc.addPage();
        pageNumber++;
        yPosition = 30;
      }
      
      // Category header
      doc.setFillColor(...secondaryColor);
      doc.rect(margin, yPosition, pageWidth - (2 * margin), 10, 'F');
      
      // Category name
      doc.setFontSize(11);
      doc.setFont('helvetica', 'bold');
      doc.setTextColor(255, 255, 255);
      doc.text(category.toUpperCase(), margin + 5, yPosition + 7);
      
      // Update totals
      totalCost += summary[category].categoryTotal;
      totalProfit += summary[category].categoryProfit;
      
      // Create table data
      const tableData = summary[category].items.map((item) => [
        item.name,
        item.qty,
        item.price.toFixed(2),
        item.total.toFixed(2),
        item.profit.toFixed(2),
      ]);
      
      // Add table
      doc.autoTable({
        startY: yPosition + 12,
        head: [['Product', 'QTY', 'Price (Rs)', 'Total (Rs)', 'Profit (Rs)']],
        body: tableData,
        headStyles: {
          fillColor: primaryColor,
          textColor: [255, 255, 255],
          fontSize: 9,
          fontStyle: 'bold',
        },
        bodyStyles: {
          fontSize: 9,
        },
        alternateRowStyles: {
          fillColor: lightGray
        },
        columnStyles: {
          0: { cellWidth: 'auto' },
          1: { cellWidth: 15, halign: 'center' },
          2: { cellWidth: 25, halign: 'right' },
          3: { cellWidth: 25, halign: 'right' },
          4: { cellWidth: 25, halign: 'right' }
        },
        margin: { left: margin, right: margin },
      });
      
      // Update y position
      yPosition = doc.lastAutoTable.finalY + 5;
      
      // Add category summary
      doc.setFontSize(9);
      doc.setFont('helvetica', 'bold');
      doc.setTextColor(...accentColor);
      doc.text(`Category Total: Rs ${summary[category].categoryTotal.toFixed(2)}  |  Profit: Rs ${summary[category].categoryProfit.toFixed(2)}`, 
        pageWidth - margin, yPosition, { align: 'right' });
      
      yPosition += 15;
    });
    
    // Add summary page
    addFooter();
    doc.addPage();
    pageNumber++;
    
    // Simple summary header
    doc.setFillColor(...accentColor);
    doc.rect(0, 0, pageWidth, 20, 'F');
    
    doc.setFontSize(14);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(255, 255, 255);
    doc.text('INVENTORY SUMMARY', pageWidth / 2, 13, { align: 'center' });
    
    // Summary box
    yPosition = 30;
    doc.setFillColor(...lightGray);
    doc.roundedRect(margin, yPosition, pageWidth - (2 * margin), 50, 3, 3, 'F');
    
    // Summary data
    yPosition += 10;
    
    const summaryItems = [
      { label: 'Total Inventory Value', value: `Rs ${totalCost.toFixed(2)}` },
      { label: 'Projected Total Profit', value: `Rs ${totalProfit.toFixed(2)}` },
      { label: 'Profit Margin', value: `${(totalProfit / totalCost * 100).toFixed(2)}%` },
      { label: 'Product Categories', value: `${Object.keys(summary).length}` },
    ];
    
    summaryItems.forEach((item, index) => {
      doc.setFontSize(10);
      doc.setFont('helvetica', 'normal');
      doc.setTextColor(...textColor);
      doc.text(item.label + ':', margin + 10, yPosition + (index * 10));
      
      doc.setFont('helvetica', 'bold');
      doc.setTextColor(...secondaryColor);
      doc.text(item.value, margin + 70, yPosition + (index * 10));
    });
    
    // Add final footer
    addFooter();
    
    // Save the PDF
    doc.save('Inventory_Report.pdf');
  };
  
  return (
    <button className="btn btn-primary" onClick={generatePDF}>
      <i className="fa fa-file-pdf me-2"></i>
      Generate Inventory Report
    </button>
  );
};

export default GeneratePDF;