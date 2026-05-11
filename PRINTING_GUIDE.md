# Receipt and Invoice Printing Guide

Your POS system includes professional printing and PDF export capabilities for receipts and invoices.

## Features

### Receipt Printing
- Professional receipt templates with store information
- Receipt numbers and timestamps
- Itemized list with quantities and prices
- Tax calculations and totals
- Customer information
- Payment method tracking
- Print-optimized formatting

### Invoice Generation
- Business-style invoices
- Professional header and footer
- Invoice status (Draft, Sent, Paid, Overdue)
- Bill-to information
- Itemized table with descriptions
- Tax rate calculations
- Notes section
- Print and PDF export ready

### Barcode Generation
- Product barcodes (EAN13, CODE128, UPC)
- SKU labels
- Inventory barcode generation
- Print-ready barcode display

### PDF Export
- Download receipts as PDF
- Download invoices as PDF
- Automatic filename generation
- Professional formatting

## How to Use

### Print a Receipt

1. Complete a POS transaction
2. On the success page, click "Print Receipt"
3. Your browser's print dialog will open
4. Select your printer and confirm
5. Receipt will print with proper formatting

```typescript
// From app/success/page.tsx
const handlePrint = () => {
  if (receiptRef.current) {
    printWithStyles(receiptRef.current)
  } else {
    window.print()
  }
}
```

### Export Receipt as PDF

1. On the success page, click "Download PDF"
2. Receipt will automatically download as PDF
3. Filename includes receipt number: `receipt-123456.pdf`

```typescript
// From app/success/page.tsx
const handlePDF = async () => {
  if (receiptRef.current) {
    await exportToPDF(receiptRef.current, `receipt-${receiptNumber}.pdf`)
  }
}
```

### Generate Product Barcode

```typescript
import { BarcodeDisplay } from "@/components/barcode-display"

// In your component
<BarcodeDisplay 
  value="123456789012"
  format="EAN13"
  height={100}
/>
```

### Create an Invoice

```typescript
import { InvoiceTemplate } from "@/components/invoice-template"

// In your component
<InvoiceTemplate
  invoiceNumber="INV-001"
  invoiceDate={new Date()}
  items={items}
  subtotal={subtotal}
  total={total}
  customerName="John Doe"
  status="Sent"
/>
```

## Installation Requirements

To use all features, you need these optional packages:

```bash
# For PDF export functionality
pnpm add html2pdf.js

# For barcode generation
pnpm add jsbarcode

# For date formatting (already installed)
# pnpm add date-fns
```

Without these packages, the app still works with fallback options:
- PDF export will use browser print
- Barcodes will display text representation

## Components

### ReceiptPrinter
Professional receipt component with:
- Store information header
- Receipt number and date
- Itemized products
- Subtotal, tax, total
- Payment method
- Print-optimized styling

**Props:**
```typescript
interface ReceiptPrinterProps {
  receiptNumber: string | number
  items: Array<{
    id: number | string
    name: string
    quantity: number
    price: number
  }>
  subtotal: number
  tax: number
  total: number
  customerName?: string
  paymentMethod?: string
  date?: Date
  storeName?: string
  storeAddress?: string
  storePhone?: string
}
```

### InvoiceTemplate
Business invoice component with:
- Professional styling
- Bill-to information
- Invoice status badges
- Itemized table with descriptions
- Tax calculations
- Notes and footer

**Props:**
```typescript
interface InvoiceTemplateProps {
  invoiceNumber: string | number
  invoiceDate: Date
  dueDate?: Date
  items: InvoiceItem[]
  subtotal: number
  taxRate?: number
  taxAmount?: number
  total: number
  notes?: string
  customerName?: string
  customerEmail?: string
  customerPhone?: string
  customerAddress?: string
  storeName?: string
  storeAddress?: string
  storePhone?: string
  storeEmail?: string
  status?: "Draft" | "Sent" | "Paid" | "Overdue"
}
```

### BarcodeDisplay
Barcode generator with multiple formats:
- CODE128 (default)
- CODE39
- EAN13
- UPC

**Props:**
```typescript
interface BarcodeDisplayProps {
  value: string
  format?: "CODE128" | "CODE39" | "EAN13" | "UPC"
  width?: number
  height?: number
  displayValue?: boolean
}
```

### ProductBarcode
Product-specific barcode with SKU and name

**Props:**
```typescript
{
  sku: string
  productName: string
}
```

## Utility Functions

### exportToPDF
Export HTML element to PDF file

```typescript
import { exportToPDF } from "@/services/pdf-export"

const element = document.getElementById('receipt')
await exportToPDF(element, 'receipt.pdf')
```

### exportToCSV
Export data array to CSV file

```typescript
import { exportToCSV } from "@/services/pdf-export"

const data = [
  { id: 1, name: 'Item 1', price: 10 },
  { id: 2, name: 'Item 2', price: 20 }
]
exportToCSV(data, 'transactions.csv')
```

### printWithStyles
Print with custom styles and formatting

```typescript
import { printWithStyles } from "@/services/pdf-export"

const element = document.getElementById('receipt')
printWithStyles(element)
```

### formatCurrency
Format number as currency

```typescript
import { formatCurrency } from "@/services/pdf-export"

const formatted = formatCurrency(100.50) // "$100.50"
```

### formatReceiptDate
Format date for receipt display

```typescript
import { formatReceiptDate } from "@/services/pdf-export"

const formatted = formatReceiptDate(new Date()) // "01/15/24 2:30 PM"
```

## Print Styling

The components use CSS classes for print optimization:

- `print:hidden` - Hide on print (buttons, headers)
- `print:border-none` - Remove borders on print
- `print:p-0` - Remove padding on print
- `print:max-w-full` - Full width on print

These are automatically applied. For custom print styles, add to your CSS:

```css
@media print {
  body {
    margin: 0;
    padding: 10mm;
  }
  
  .no-print {
    display: none;
  }
}
```

## Printer Setup

### Thermal Printer (Recommended for POS)

1. Install thermal printer drivers
2. Set paper size to 58mm or 80mm width
3. Test with sample receipt
4. Adjust margins if needed

### Receipt Format
- Width: 58mm-80mm (thermal) or A6 (regular)
- Print quality: 203 DPI or higher
- Font: Monospace for alignment
- Margin: 5-10mm

### Settings
```typescript
{
  margin: 5,
  jsPDF: {
    orientation: "portrait",
    unit: "mm",
    format: "a6" // Receipt size
  }
}
```

## Troubleshooting

### Print Dialog Doesn't Appear
- Ensure the component is properly rendered
- Check browser pop-up settings
- Try different browser

### PDF Download Fails
- Install `html2pdf.js`: `pnpm add html2pdf.js`
- Check browser console for errors
- Verify the element exists
- Try fallback print method

### Barcode Not Generating
- Install `jsbarcode`: `pnpm add jsbarcode`
- Check barcode value format
- Ensure value matches selected format
- Check browser console for errors

### Printing Cuts Off
- Check printer margins
- Adjust component width
- Test with different zoom level
- Check printer settings

## Next Steps

1. **Test Printing**
   - Complete a POS transaction
   - Use "Print Receipt" on success page
   - Verify output looks correct

2. **Configure Store Info**
   - Go to Admin → Settings
   - Update store name, address, phone
   - Receipts will use this information

3. **Optional: Install PDF Packages**
   ```bash
   pnpm add html2pdf.js jsbarcode
   ```

4. **Setup Thermal Printer**
   - Install printer drivers
   - Configure paper size
   - Test with sample receipt

## Advanced Usage

### Custom Receipt Template

Create your own receipt component:

```typescript
import { forwardRef } from "react"

export const CustomReceipt = forwardRef((props, ref) => {
  return (
    <div ref={ref} className="w-80 bg-white p-4 font-mono text-sm">
      {/* Your custom receipt design */}
    </div>
  )
})
```

### Batch PDF Export

Export multiple receipts:

```typescript
import { exportToPDF } from "@/services/pdf-export"

for (const order of orders) {
  const element = document.getElementById(`receipt-${order.id}`)
  await exportToPDF(element, `receipt-${order.id}.pdf`)
}
```

### Custom Barcode Format

```typescript
<BarcodeDisplay 
  value="ABC123456789"
  format="CODE39"
  width={3}
  height={150}
/>
```

## Files

- `app/components/receipt-printer.tsx` - Receipt component
- `app/components/invoice-template.tsx` - Invoice component
- `app/components/barcode-display.tsx` - Barcode components
- `app/services/pdf-export.ts` - Export utilities
- `app/success/page.tsx` - Success page with printing

## Browser Compatibility

- Chrome/Edge: Full support
- Firefox: Full support
- Safari: Full support
- Mobile Safari: Print to PDF only
- All: Fallback to window.print()

## Performance Notes

- PDF export uses dynamic import (reduces bundle size)
- Barcodes render on demand
- Print styles are lightweight
- No external printing libraries needed for basic printing

## License

All printing utilities are included in your project and ready to use.
