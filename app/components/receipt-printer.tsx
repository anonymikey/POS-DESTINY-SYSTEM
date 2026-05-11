"use client"

import { forwardRef } from "react"
import { format } from "date-fns"

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

export const ReceiptPrinter = forwardRef<HTMLDivElement, ReceiptPrinterProps>(
  (
    {
      receiptNumber,
      items,
      subtotal,
      tax,
      total,
      customerName,
      paymentMethod = "Cash",
      date = new Date(),
      storeName = "My Store",
      storeAddress = "123 Main St",
      storePhone = "(123) 456-7890",
    },
    ref
  ) => {
    return (
      <div
        ref={ref}
        className="w-full max-w-sm bg-white p-4 text-sm font-mono print:p-0 print:max-w-full"
      >
        {/* Header */}
        <div className="mb-4 text-center">
          <h1 className="text-lg font-bold">{storeName}</h1>
          <p className="text-xs">{storeAddress}</p>
          <p className="text-xs">{storePhone}</p>
        </div>

        {/* Receipt Info */}
        <div className="mb-4 border-t border-b border-dashed py-2 text-xs">
          <div className="flex justify-between">
            <span>Receipt #:</span>
            <span>{receiptNumber}</span>
          </div>
          <div className="flex justify-between">
            <span>Date:</span>
            <span>{format(date, "MM/dd/yyyy HH:mm")}</span>
          </div>
          {customerName && (
            <div className="flex justify-between">
              <span>Customer:</span>
              <span>{customerName}</span>
            </div>
          )}
        </div>

        {/* Items Header */}
        <div className="mb-2 border-b border-dashed pb-2 text-xs font-semibold">
          <div className="flex justify-between">
            <span>Item</span>
            <span>Qty</span>
            <span>Price</span>
            <span>Total</span>
          </div>
        </div>

        {/* Items */}
        <div className="mb-4 space-y-1 border-b border-dashed pb-2 text-xs">
          {items.map((item) => (
            <div key={item.id}>
              <div className="flex justify-between">
                <span className="max-w-[120px] truncate">{item.name}</span>
                <span>{item.quantity}</span>
                <span>${item.price.toFixed(2)}</span>
                <span>${(item.price * item.quantity).toFixed(2)}</span>
              </div>
            </div>
          ))}
        </div>

        {/* Summary */}
        <div className="mb-4 space-y-1 text-xs">
          <div className="flex justify-between">
            <span>Subtotal:</span>
            <span>${subtotal.toFixed(2)}</span>
          </div>
          <div className="flex justify-between">
            <span>Tax (10%):</span>
            <span>${tax.toFixed(2)}</span>
          </div>
          <div className="border-t border-dashed pt-2 font-bold">
            <div className="flex justify-between">
              <span>TOTAL:</span>
              <span>${total.toFixed(2)}</span>
            </div>
          </div>
        </div>

        {/* Payment Info */}
        <div className="mb-4 border-t border-b border-dashed py-2 text-xs">
          <div className="flex justify-between">
            <span>Payment Method:</span>
            <span>{paymentMethod}</span>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center text-xs text-gray-600">
          <p className="mb-2">Thank you for your purchase!</p>
          <p className="text-[10px]">Please come again</p>
        </div>
      </div>
    )
  }
)

ReceiptPrinter.displayName = "ReceiptPrinter"
