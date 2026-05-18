"use client"

import { useEffect, useRef, useState } from "react"
import { useRouter } from "next/navigation"
import { Check, Printer, Download, RotateCcw, Share2 } from "lucide-react"

import { Button } from "@/components/ui/button"
import { useCart } from "../context/cart-context"
import { ReceiptPrinter } from "../components/receipt-printer"
import { exportToPDF, printWithStyles } from "../services/pdf-export"
import { supabaseService } from "../services/supabase-service"

export default function SuccessPage() {
  const router = useRouter()
  const { cart, cartTotal, clearCart } = useCart()
  const receiptRef = useRef<HTMLDivElement>(null)
  const [receiptId, setReceiptId] = useState<string | null>(null)
  const [isPrinting, setIsPrinting] = useState(false)
  const [receiptSaved, setReceiptSaved] = useState(false)

  const tax = cartTotal * 0.1
  const grandTotal = cartTotal + tax
  const receiptNumber = Math.floor(100000 + Math.random() * 900000)
  const date = new Date()

  useEffect(() => {
    // If there's no cart data, redirect to POS
    if (cart.length === 0) {
      router.push("/")
      return
    }

    // Save receipt to Supabase if configured
    if (supabaseService.isConfigured()) {
      saveReceiptToSupabase()
    } else {
      setReceiptSaved(true)
    }
  }, [cart, router])

  const saveReceiptToSupabase = async () => {
    try {
      const receipt = await supabaseService.saveReceipt({
        transaction_id: receiptNumber.toString(),
        receipt_number: receiptNumber.toString(),
        total_amount: grandTotal,
        items_count: cart.length,
      })

      if (receipt) {
        setReceiptId(receipt.id)
        console.log('[v0] Receipt saved to Supabase:', receipt.id)
      }
      setReceiptSaved(true)
    } catch (err) {
      console.error('[v0] Error saving receipt:', err)
      setReceiptSaved(true)
    }
  }

  const handleBackToPOS = () => {
    clearCart()
    router.push("/")
  }

  const handlePrint = async () => {
    setIsPrinting(true)
    try {
      if (receiptRef.current) {
        printWithStyles(receiptRef.current)
      } else {
        window.print()
      }

      // Update receipt status in Supabase if saved
      if (receiptId && supabaseService.isConfigured()) {
        await supabaseService.updateReceiptStatus(receiptId, 'printed')
        console.log('[v0] Receipt marked as printed')
      }
    } finally {
      setIsPrinting(false)
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
          storeName="Destiny Supermarket"
          storeAddress="Your Store Address"
          storePhone="(000) 000-0000"
        />
      </div>

      {/* Action Buttons */}
      <div className="print:hidden flex flex-col gap-3 sm:flex-row sm:justify-center">
        <Button
          onClick={handlePrint}
          variant="outline"
          className="flex items-center gap-2"
          disabled={isPrinting}
        >
          <Printer className="h-4 w-4" />
          {isPrinting ? 'Printing...' : 'Print Receipt'}
        </Button>
        <Button
          onClick={handlePDF}
          variant="outline"
          className="flex items-center gap-2"
        >
          <Download className="h-4 w-4" />
          Download PDF
        </Button>
        {receiptSaved && supabaseService.isConfigured() && (
          <Button
            variant="outline"
            className="flex items-center gap-2"
            disabled
          >
            <Share2 className="h-4 w-4" />
            Synced to Cloud
          </Button>
        )}
        <Button
          onClick={handleBackToPOS}
          className="flex items-center gap-2"
        >
          <RotateCcw className="h-4 w-4" />
          Back to POS
        </Button>
      </div>

      {/* Additional Info */}
      <div className="print:hidden mt-8 space-y-3">
        <div className="rounded-lg border border-blue-100 bg-blue-50 p-4 text-sm">
          <p className="text-blue-900">
            <strong>Order Confirmation:</strong> Your receipt number is{" "}
            <strong>#{receiptNumber}</strong>. Please keep it for your records.
          </p>
        </div>

        {receiptSaved && supabaseService.isConfigured() && (
          <div className="rounded-lg border border-green-100 bg-green-50 p-4 text-sm">
            <p className="text-green-900">
              <strong>Cloud Sync:</strong> Your receipt has been automatically saved and is synced to the cloud for tracking and audit purposes.
            </p>
          </div>
        )}
      </div>
    </div>
  )
}
