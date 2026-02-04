import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

interface ReceiptData {
  receiptNumber: string;
  paymentDate: string;
  customerName: string;
  customerPhone: string;
  customerAddress?: string;
  amount: number;
  method: string;
  reference?: string;
  notes?: string;
  tenantName: string;
  tenantPhone?: string;
  tenantAddress?: string;
  invoiceNumber?: string;
  billingPeriod?: string;
}

export function generatePaymentReceipt(data: ReceiptData): void {
  const doc = new jsPDF();
  const pageWidth = doc.internal.pageSize.getWidth();
  
  // Header
  doc.setFontSize(22);
  doc.setFont("helvetica", "bold");
  doc.text(data.tenantName, pageWidth / 2, 25, { align: "center" });
  
  doc.setFontSize(10);
  doc.setFont("helvetica", "normal");
  doc.setTextColor(100);
  if (data.tenantAddress) {
    doc.text(data.tenantAddress, pageWidth / 2, 32, { align: "center" });
  }
  if (data.tenantPhone) {
    doc.text(`Phone: ${data.tenantPhone}`, pageWidth / 2, 38, { align: "center" });
  }
  
  // Receipt Title
  doc.setTextColor(0);
  doc.setFontSize(16);
  doc.setFont("helvetica", "bold");
  doc.text("PAYMENT RECEIPT", pageWidth / 2, 52, { align: "center" });
  
  // Receipt details box
  doc.setDrawColor(200);
  doc.setFillColor(248, 250, 252);
  doc.roundedRect(15, 58, pageWidth - 30, 25, 2, 2, "FD");
  
  doc.setFontSize(10);
  doc.setFont("helvetica", "normal");
  doc.text(`Receipt No: ${data.receiptNumber}`, 20, 68);
  doc.text(`Date: ${data.paymentDate}`, pageWidth - 20, 68, { align: "right" });
  doc.text(`Payment Method: ${formatMethod(data.method)}`, 20, 76);
  if (data.reference) {
    doc.text(`Reference: ${data.reference}`, pageWidth - 20, 76, { align: "right" });
  }
  
  // Customer Details
  doc.setFontSize(11);
  doc.setFont("helvetica", "bold");
  doc.text("Customer Details", 15, 95);
  
  doc.setFont("helvetica", "normal");
  doc.setFontSize(10);
  doc.text(`Name: ${data.customerName}`, 15, 103);
  doc.text(`Phone: ${data.customerPhone}`, 15, 110);
  if (data.customerAddress) {
    doc.text(`Address: ${data.customerAddress}`, 15, 117);
  }
  
  // Payment Details Table
  const tableStartY = data.customerAddress ? 130 : 123;
  
  const tableData = [];
  
  if (data.invoiceNumber) {
    tableData.push(["Invoice Number", data.invoiceNumber]);
  }
  if (data.billingPeriod) {
    tableData.push(["Billing Period", data.billingPeriod]);
  }
  tableData.push(["Payment Amount", `৳${data.amount.toLocaleString()}`]);
  tableData.push(["Payment Method", formatMethod(data.method)]);
  if (data.reference) {
    tableData.push(["Transaction Reference", data.reference]);
  }
  
  autoTable(doc, {
    startY: tableStartY,
    head: [["Description", "Details"]],
    body: tableData,
    theme: "striped",
    headStyles: {
      fillColor: [59, 130, 246],
      fontSize: 10,
      fontStyle: "bold",
    },
    bodyStyles: {
      fontSize: 10,
    },
    columnStyles: {
      0: { fontStyle: "bold", cellWidth: 60 },
      1: { cellWidth: "auto" },
    },
    margin: { left: 15, right: 15 },
  });
  
  // Amount Summary Box
  const finalY = (doc as any).lastAutoTable.finalY + 10;
  
  doc.setFillColor(34, 197, 94);
  doc.roundedRect(pageWidth - 100, finalY, 85, 30, 3, 3, "F");
  
  doc.setTextColor(255);
  doc.setFontSize(10);
  doc.text("AMOUNT PAID", pageWidth - 57.5, finalY + 10, { align: "center" });
  doc.setFontSize(18);
  doc.setFont("helvetica", "bold");
  doc.text(`৳${data.amount.toLocaleString()}`, pageWidth - 57.5, finalY + 23, { align: "center" });
  
  // Notes
  doc.setTextColor(0);
  if (data.notes) {
    doc.setFontSize(10);
    doc.setFont("helvetica", "normal");
    doc.text("Notes:", 15, finalY + 10);
    doc.setTextColor(100);
    doc.text(data.notes, 15, finalY + 17, { maxWidth: 80 });
  }
  
  // Footer
  const footerY = doc.internal.pageSize.getHeight() - 30;
  
  doc.setTextColor(100);
  doc.setFontSize(9);
  doc.setFont("helvetica", "normal");
  doc.text("This is a computer-generated receipt.", pageWidth / 2, footerY, { align: "center" });
  doc.text("Thank you for your payment!", pageWidth / 2, footerY + 6, { align: "center" });
  
  // Signature line
  doc.setDrawColor(150);
  doc.line(pageWidth - 80, footerY - 15, pageWidth - 20, footerY - 15);
  doc.setFontSize(8);
  doc.text("Authorized Signature", pageWidth - 50, footerY - 8, { align: "center" });
  
  // Download
  doc.save(`Receipt-${data.receiptNumber}.pdf`);
}

function formatMethod(method: string): string {
  const methods: Record<string, string> = {
    cash: "Cash",
    online: "Online Payment",
    bank_transfer: "Bank Transfer",
  };
  return methods[method] || method;
}
