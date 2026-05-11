/**
 * PDF Export Utility for Receipts and Invoices
 * Uses html2pdf library for PDF generation
 * 
 * Installation: pnpm add html2pdf.js
 */

interface PDFOptions {
  filename?: string
  margin?: number
  image?: {
    type: string
    quality: number
  }
  html2canvas?: {
    scale: number
  }
  jsPDF?: {
    orientation: "portrait" | "landscape"
    unit: string
    format: string
  }
}

/**
 * Export receipt or invoice to PDF
 * 
 * Example:
 * const element = document.getElementById('receipt');
 * exportToPDF(element, 'receipt-12345.pdf');
 */
export const exportToPDF = async (
  element: HTMLElement | null,
  filename: string = "receipt.pdf",
  options?: PDFOptions
) => {
  if (!element) {
    console.error("Element not found for PDF export")
    return
  }

  try {
    // Dynamic import to reduce bundle size
    const html2pdf = (await import("html2pdf.js")).default

    const defaultOptions: PDFOptions = {
      margin: 10,
      filename,
      image: {
        type: "image/png",
        quality: 0.98,
      },
      html2canvas: {
        scale: 2,
      },
      jsPDF: {
        orientation: "portrait",
        unit: "mm",
        format: "a4",
      },
    }

    const mergedOptions = { ...defaultOptions, ...options }

    // Clone the element to avoid affecting the original
    const clone = element.cloneNode(true) as HTMLElement

    // Remove no-print elements
    clone.querySelectorAll(".print\\:hidden, [class*='no-print']").forEach((el) => {
      el.remove()
    })

    html2pdf().set(mergedOptions).from(clone).save()
  } catch (error) {
    console.error("Error exporting to PDF:", error)
    // Fallback to browser print
    window.print()
  }
}

/**
 * Generate a CSV export of transactions
 */
export const exportToCSV = (
  data: Array<Record<string, any>>,
  filename: string = "export.csv"
) => {
  if (data.length === 0) {
    console.warn("No data to export")
    return
  }

  // Get headers from first item
  const headers = Object.keys(data[0])

  // Create CSV content
  const csvContent = [
    headers.join(","),
    ...data.map((row) =>
      headers
        .map((header) => {
          const value = row[header]
          // Handle values with commas or quotes
          if (typeof value === "string" && (value.includes(",") || value.includes('"'))) {
            return `"${value.replace(/"/g, '""')}"`
          }
          return value
        })
        .join(",")
    ),
  ].join("\n")

  // Create blob and download
  const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" })
  downloadBlob(blob, filename)
}

/**
 * Utility function to trigger file download
 */
const downloadBlob = (blob: Blob, filename: string) => {
  const link = document.createElement("a")
  const url = URL.createObjectURL(blob)

  link.setAttribute("href", url)
  link.setAttribute("download", filename)
  link.style.visibility = "hidden"

  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)

  // Clean up
  URL.revokeObjectURL(url)
}

/**
 * Print with custom styles and formatting
 */
export const printWithStyles = (element: HTMLElement | null) => {
  if (!element) {
    console.error("Element not found for printing")
    return
  }

  const printWindow = window.open("", "", "height=600,width=800")
  if (!printWindow) {
    console.error("Failed to open print window")
    return
  }

  // Get all styles from the document
  const styles = document.querySelectorAll("style, link[rel='stylesheet']")

  printWindow.document.write("<html><head>")

  // Copy styles
  styles.forEach((style) => {
    if (style.tagName === "STYLE") {
      printWindow.document.write(style.outerHTML)
    }
  })

  // Add print-specific styles
  printWindow.document.write(`
    <style>
      * {
        margin: 0;
        padding: 0;
      }
      body {
        font-family: monospace;
        font-size: 12px;
        line-height: 1.5;
      }
      @media print {
        body {
          margin: 0;
          padding: 10mm;
        }
      }
    </style>
  `)

  printWindow.document.write("</head><body>")
  printWindow.document.write(element.innerHTML)
  printWindow.document.write("</body></html>")
  printWindow.document.close()

  // Wait for content to load then print
  printWindow.onload = () => {
    printWindow.print()
  }
}

/**
 * Format currency for receipt display
 */
export const formatCurrency = (amount: number, currency: string = "USD"): string => {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency,
  }).format(amount)
}

/**
 * Format date for receipt display
 */
export const formatReceiptDate = (date: Date): string => {
  return date.toLocaleString("en-US", {
    month: "2-digit",
    day: "2-digit",
    year: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  })
}
