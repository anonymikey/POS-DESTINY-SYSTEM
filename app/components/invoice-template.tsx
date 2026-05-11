"use client"

import { forwardRef } from "react"
import { format } from "date-fns"

interface InvoiceItem {
  id: number | string
  name: string
  description?: string
  quantity: number
  unitPrice: number
  total?: number
}

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

/**
 * Professional Invoice Template
 * Suitable for business invoices and formal receipts
 */
export const InvoiceTemplate = forwardRef<HTMLDivElement, InvoiceTemplateProps>(
  (
    {
      invoiceNumber,
      invoiceDate,
      dueDate,
      items,
      subtotal,
      taxRate = 10,
      taxAmount,
      total,
      notes,
      customerName = "Customer",
      customerEmail,
      customerPhone,
      customerAddress,
      storeName = "My Business",
      storeAddress = "123 Business Ave",
      storePhone = "(555) 123-4567",
      storeEmail = "info@mybusiness.com",
      status = "Sent",
    },
    ref
  ) => {
    const calculatedTax = taxAmount || subtotal * (taxRate / 100)

    return (
      <div ref={ref} className="bg-white p-8 print:p-0">
        {/* Header */}
        <div className="mb-8 flex items-start justify-between border-b-2 border-gray-300 pb-6">
          <div>
            <h1 className="text-4xl font-bold text-blue-600">{storeName}</h1>
            <p className="text-gray-600">{storeAddress}</p>
            <p className="text-gray-600">{storePhone}</p>
            <p className="text-gray-600">{storeEmail}</p>
          </div>
          <div className="text-right">
            <div className="mb-2 text-3xl font-bold text-gray-800">INVOICE</div>
            {status && (
              <div
                className={`inline-block rounded-full px-4 py-1 text-sm font-semibold ${
                  status === "Paid"
                    ? "bg-green-100 text-green-800"
                    : status === "Overdue"
                      ? "bg-red-100 text-red-800"
                      : "bg-blue-100 text-blue-800"
                }`}
              >
                {status}
              </div>
            )}
          </div>
        </div>

        {/* Invoice Details */}
        <div className="mb-8 grid grid-cols-2 gap-8">
          <div>
            <h3 className="mb-2 font-semibold text-gray-700">Bill To:</h3>
            <div className="space-y-1 text-sm">
              <p className="font-semibold">{customerName}</p>
              {customerAddress && <p>{customerAddress}</p>}
              {customerPhone && <p>{customerPhone}</p>}
              {customerEmail && <p>{customerEmail}</p>}
            </div>
          </div>
          <div className="text-right">
            <div className="space-y-2 text-sm">
              <div className="grid grid-cols-2 gap-2">
                <span className="text-gray-600">Invoice #:</span>
                <span className="font-semibold">{invoiceNumber}</span>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <span className="text-gray-600">Invoice Date:</span>
                <span className="font-semibold">
                  {format(invoiceDate, "MMM dd, yyyy")}
                </span>
              </div>
              {dueDate && (
                <div className="grid grid-cols-2 gap-2">
                  <span className="text-gray-600">Due Date:</span>
                  <span className="font-semibold">{format(dueDate, "MMM dd, yyyy")}</span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Items Table */}
        <div className="mb-8">
          <table className="w-full">
            <thead>
              <tr className="border-b-2 border-gray-300 bg-gray-50">
                <th className="py-3 text-left font-semibold text-gray-700">Description</th>
                <th className="py-3 text-center font-semibold text-gray-700">Qty</th>
                <th className="py-3 text-right font-semibold text-gray-700">Unit Price</th>
                <th className="py-3 text-right font-semibold text-gray-700">Total</th>
              </tr>
            </thead>
            <tbody>
              {items.map((item, index) => (
                <tr key={item.id} className="border-b border-gray-200">
                  <td className="py-4">
                    <p className="font-medium text-gray-900">{item.name}</p>
                    {item.description && (
                      <p className="text-sm text-gray-600">{item.description}</p>
                    )}
                  </td>
                  <td className="py-4 text-center text-gray-700">{item.quantity}</td>
                  <td className="py-4 text-right text-gray-700">
                    ${item.unitPrice.toFixed(2)}
                  </td>
                  <td className="py-4 text-right font-semibold text-gray-900">
                    ${(item.total || item.unitPrice * item.quantity).toFixed(2)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Summary */}
        <div className="mb-8 flex justify-end">
          <div className="w-full max-w-xs space-y-2">
            <div className="flex justify-between border-t-2 border-gray-300 py-3">
              <span className="text-gray-700">Subtotal:</span>
              <span className="font-semibold text-gray-900">${subtotal.toFixed(2)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-700">Tax ({taxRate}%):</span>
              <span className="font-semibold text-gray-900">${calculatedTax.toFixed(2)}</span>
            </div>
            <div className="flex justify-between border-t-2 border-gray-300 py-3">
              <span className="text-lg font-bold text-gray-900">Total Due:</span>
              <span className="text-2xl font-bold text-blue-600">${total.toFixed(2)}</span>
            </div>
          </div>
        </div>

        {/* Notes */}
        {notes && (
          <div className="mb-8">
            <h3 className="mb-2 font-semibold text-gray-700">Notes:</h3>
            <p className="whitespace-pre-wrap text-sm text-gray-600">{notes}</p>
          </div>
        )}

        {/* Footer */}
        <div className="border-t border-gray-300 pt-6 text-center text-sm text-gray-600">
          <p>Thank you for your business!</p>
          <p className="mt-2">
            If you have any questions about this invoice, please contact us at{" "}
            {storeEmail} or {storePhone}
          </p>
        </div>
      </div>
    )
  }
)

InvoiceTemplate.displayName = "InvoiceTemplate"
