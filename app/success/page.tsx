"use client"

import { useEffect, useRef } from "react"
import { useRouter } from "next/navigation"
import { Check, Printer, Download, RotateCcw } from "lucide-react"

import { Button } from "@/components/ui/button"
import { useCart } from "../context/cart-context"
import { ReceiptPrinter } from "../components/receipt-printer"
import { exportToPDF, printWithStyles } from "../services/pdf-export"

export default function SuccessPage() {
  const router = useRouter()
  const { cart, cartTotal, clearCart } = useCart()
  const receiptRef = useRef<HTMLDivElement>(null)

  const tax = cartTotal * 0.1
  const grandTotal = cartTotal + tax
  const receiptNumber = Math.floor(100000 + Math.random() * 900000)
  const date = new Date()

  useEffect(() => {
    // If there's no cart data, redirect to POS
    if (cart.length === 0) {
      router.push("/")
    }
  }, [cart, router])

  const handleBackToPOS = () => {
    clearCart()
    router.push("/")
  }

  const handlePrint = () => {
    if (receiptRef.current) {
      printWithStyles(receiptRef.current)
    } else {
      window.print()
    }
  }

  const handlePDF = async () => {
    if (receiptRef.current) {
      await exportToPDF(receiptRef.current, `receipt-${receiptNumber}.pdf`, {
        margin: 5,
        jsPDF: {
          orientation: "portrait",
          unit: "mm",
          format: "a6", // Small receipt format
        },
      })
    }
  }

  if (cart.length === 0) {
    return null // Will redirect in useEffect
  }

  return (
    <div className="container mx-auto max-w-2xl py-8 px-4">
      {/* Success Header */}
      <div className="mb-8 print:mb-4 text-center">
        <div className="mb-4 flex items-center justify-center">
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-green-100">
            <Check className="h-8 w-8 text-green-600" />
          </div>
        </div>
        <h1 className="mb-2 text-3xl font-bold">Payment Successful</h1>
        <p className="text-muted-foreground">Your order has been confirmed</p>
      </div>

      {/* Receipt */}
      <div className="mb-8 print:mb-0 flex justify-center">
        <ReceiptPrinter
          ref={receiptRef}
          receiptNumber={receiptNumber}
          items={cart}
          subtotal={cartTotal}
          tax={tax}
          total={grandTotal}
          date={date}
          storeName="My Store"
          storeAddress="123 Main Street"
          storePhone="(555) 123-4567"
        />
      </div>

      {/* Action Buttons */}
      <div className="print:hidden flex flex-col gap-3 sm:flex-row sm:justify-center">
        <Button
          onClick={handlePrint}
          variant="outline"
          className="flex items-center gap-2"
        >
          <Printer className="h-4 w-4" />
          Print Receipt
        </Button>
        <Button
          onClick={handlePDF}
          variant="outline"
          className="flex items-center gap-2"
        >
          <Download className="h-4 w-4" />
          Download PDF
        </Button>
        <Button
          onClick={handleBackToPOS}
          className="flex items-center gap-2"
        >
          <RotateCcw className="h-4 w-4" />
          Back to POS
        </Button>
      </div>

      {/* Additional Info */}
      <div className="print:hidden mt-8 rounded-lg border border-blue-100 bg-blue-50 p-4 text-sm">
        <p className="text-blue-900">
          <strong>Order Confirmation:</strong> Your receipt number is{" "}
          <strong>#{receiptNumber}</strong>. Please keep it for your records.
        </p>
      </div>
    </div>
  )
}
