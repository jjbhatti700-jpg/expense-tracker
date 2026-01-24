import jsPDF from 'jspdf'
import autoTable from 'jspdf-autotable'
import { Transaction } from '../types'
import { CATEGORIES } from './constants'
import { formatDate } from './helpers'

// ====================================
// EXPORT TO CSV
// ====================================

export const exportToCSV = (
  transactions: Transaction[],
  filename: string = 'transactions'
): void => {
  // CSV Headers
  const headers = ['Date', 'Type', 'Category', 'Description', 'Amount']
  
  // Convert transactions to CSV rows
  const rows = transactions.map(t => [
    formatDate(t.date),
    t.type.charAt(0).toUpperCase() + t.type.slice(1),
    CATEGORIES[t.category]?.label || t.category,
    `"${t.description.replace(/"/g, '""')}"`, // Escape quotes
    t.type === 'income' ? t.amount.toFixed(2) : `-${t.amount.toFixed(2)}`,
  ])
  
  // Combine headers and rows
  const csvContent = [
    headers.join(','),
    ...rows.map(row => row.join(','))
  ].join('\n')
  
  // Create blob and download
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
  const link = document.createElement('a')
  const url = URL.createObjectURL(blob)
  
  link.setAttribute('href', url)
  link.setAttribute('download', `${filename}_${getDateString()}.csv`)
  link.style.visibility = 'hidden'
  
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
}

// ====================================
// EXPORT TO PDF
// ====================================

export const exportToPDF = (
  transactions: Transaction[],
  summary: { totalIncome: number; totalExpenses: number; balance: number },
  currencySymbol: string = '$',
  filename: string = 'transactions'
): void => {
  // Create new PDF document
  const doc = new jsPDF()
  
  // Title
  doc.setFontSize(20)
  doc.setFont('helvetica', 'bold')
  doc.text('ExpenseFlow Report', 14, 20)
  
  // Date
  doc.setFontSize(10)
  doc.setFont('helvetica', 'normal')
  doc.setTextColor(100)
  doc.text(`Generated on ${new Date().toLocaleDateString()}`, 14, 28)
  
  // Summary Section
  doc.setFontSize(14)
  doc.setFont('helvetica', 'bold')
  doc.setTextColor(0)
  doc.text('Summary', 14, 42)
  
  // Summary Box
  doc.setFillColor(245, 245, 245)
  doc.roundedRect(14, 46, 180, 30, 3, 3, 'F')
  
  doc.setFontSize(10)
  doc.setFont('helvetica', 'normal')
  
  // Income
  doc.setTextColor(34, 197, 94) // Green
  doc.text('Total Income:', 20, 56)
  doc.setFont('helvetica', 'bold')
  doc.text(`${currencySymbol}${summary.totalIncome.toFixed(2)}`, 55, 56)
  
  // Expenses
  doc.setTextColor(239, 68, 68) // Red
  doc.setFont('helvetica', 'normal')
  doc.text('Total Expenses:', 85, 56)
  doc.setFont('helvetica', 'bold')
  doc.text(`${currencySymbol}${summary.totalExpenses.toFixed(2)}`, 125, 56)
  
  // Balance
  const balanceColor = summary.balance >= 0 ? [34, 197, 94] : [239, 68, 68]
  doc.setTextColor(balanceColor[0], balanceColor[1], balanceColor[2])
  doc.setFont('helvetica', 'normal')
  doc.text('Balance:', 155, 56)
  doc.setFont('helvetica', 'bold')
  doc.text(`${currencySymbol}${summary.balance.toFixed(2)}`, 175, 56)
  
  // Transactions count
  doc.setTextColor(100)
  doc.setFont('helvetica', 'normal')
  doc.text(`Total Transactions: ${transactions.length}`, 20, 68)
  
  // Transactions Table
  doc.setTextColor(0)
  doc.setFontSize(14)
  doc.setFont('helvetica', 'bold')
  doc.text('Transactions', 14, 90)
  
  // Table data
  const tableData = transactions.map(t => [
    formatDate(t.date),
    t.type.charAt(0).toUpperCase() + t.type.slice(1),
    CATEGORIES[t.category]?.label || t.category,
    t.description.length > 30 ? t.description.substring(0, 30) + '...' : t.description,
    `${t.type === 'income' ? '+' : '-'}${currencySymbol}${t.amount.toFixed(2)}`,
  ])
  
  // Generate table
  autoTable(doc, {
    startY: 95,
    head: [['Date', 'Type', 'Category', 'Description', 'Amount']],
    body: tableData,
    theme: 'striped',
    headStyles: {
      fillColor: [99, 102, 241], // Purple accent
      textColor: 255,
      fontStyle: 'bold',
    },
    alternateRowStyles: {
      fillColor: [248, 250, 252],
    },
    columnStyles: {
      0: { cellWidth: 28 },
      1: { cellWidth: 22 },
      2: { cellWidth: 35 },
      3: { cellWidth: 60 },
      4: { cellWidth: 30, halign: 'right' },
    },
    styles: {
      fontSize: 9,
      cellPadding: 4,
    },
    didParseCell: function(data) {
      // Color amount column based on type
      if (data.column.index === 4 && data.section === 'body') {
        const amount = data.cell.raw as string
        if (amount.startsWith('+')) {
          data.cell.styles.textColor = [34, 197, 94] // Green
        } else {
          data.cell.styles.textColor = [239, 68, 68] // Red
        }
      }
    },
  })
  
  // Footer
  const pageCount = doc.getNumberOfPages()
  for (let i = 1; i <= pageCount; i++) {
    doc.setPage(i)
    doc.setFontSize(8)
    doc.setTextColor(150)
    doc.text(
      `Page ${i} of ${pageCount} | ExpenseFlow`,
      doc.internal.pageSize.width / 2,
      doc.internal.pageSize.height - 10,
      { align: 'center' }
    )
  }
  
  // Save PDF
  doc.save(`${filename}_${getDateString()}.pdf`)
}

// ====================================
// HELPER
// ====================================

const getDateString = (): string => {
  const now = new Date()
  return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`
}