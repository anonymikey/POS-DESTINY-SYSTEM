"use client"

import { useState, useRef, useEffect } from "react"
import { useRouter } from "next/navigation"
import { ArrowLeft, CreditCard, Wallet, AlertCircle, CheckCircle } from "lucide-react"

import { Button } from "@/components/ui/button"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { useCart } from "../context/cart-context"
import { db } from "../services/database"
import { supabaseService } from "../services/supabase-service"

export default function CheckoutPage() {
  const router = useRouter()
  const { cart, cartTotal, clearCart, customer, discountAmount } = useCart()
  const [paymentMethod, setPaymentMethod] = useState("card")
  const [cardNumber, setCardNumber] = useState("")
  const [isProcessing, setIsProcessing] = useState(false)
  const [paymentStatus, setPaymentStatus] = useState<"idle" | "processing" | "success" | "error">("idle")
  const [errorMessage, setErrorMessage] = useState("")
  const cardInputRef = useRef<HTMLInputElement>(null)

  const tax = cartTotal * 0.1
  const grandTotal = cartTotal - discountAmount + tax

  useEffect(() => {
    // Focus on card input for barcode scanner input
    if (paymentMethod === "card" && cardInputRef.current) {
      cardInputRef.current.focus()
    }
  }, [paymentMethod])

  const validateCard = (card: string): boolean => {
    // Basic card validation - remove spaces and check length
    const cleanCard = card.replace(/\s/g, "")
    // Valid card should be 13-19 digits
    return /^\d{13,19}$/.test(cleanCard)
  }

  const handleCardScan = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    // Format card number with spaces
    const formatted = value.replace(/\s/g, "").replace(/(\d{4})/g, "$1 ").trim()
    setCardNumber(formatted)
    
    // If a card is completely scanned (13-19 digits), prepare for payment
    if (validateCard(formatted)) {
      // Card is valid - could trigger auto-payment
      console.log("[v0] Valid card scanned from Destiny Supermarket:", formatted.slice(-4))
    }
  }

  const handlePayment = async () => {
    setIsProcessing(true)
    setPaymentStatus("processing")
    setErrorMessage("")

    try {
      // Validate payment method
      if (paymentMethod === "card") {
        if (!validateCard(cardNumber)) {
          setErrorMessage("Invalid card number. Please scan a valid card from Destiny Supermarket.")
          setPaymentStatus("error")
          setIsProcessing(false)
          return
        }
        console.log("[v0] Processing card payment for Destiny Supermarket purchase")
      }

      const receiptNumber = Math.floor(100000 + Math.random() * 900000).toString()

      // Prepare transaction data for Supabase
      const transactionData = {
        receipt_number: receiptNumber,
        customer_name: customer?.name,
        total_amount: grandTotal,
        payment_method: paymentMethod as 'cash' | 'card',
        card_last_4: paymentMethod === "card" ? cardNumber.slice(-4) : undefined,
        items: cart.map((item) => ({
          product_id: item.id,
          product_name: item.name,
          quantity: item.quantity,
          price: item.price,
          subtotal: item.price * item.quantity,
        })),
        subtotal: cartTotal,
        tax: tax,
        discount: discountAmount,
      }

      // Save to Supabase (if configured) - non-blocking
      supabaseService.saveTransaction(transactionData).catch(err => 
        console.error('[v0] Error saving to Supabase:', err)
      )

      // Also save to local storage for offline support
      const transaction = {
        id: Date.now().toString(),
        customerId: customer?.id,
        items: cart.map((item) => ({
          id: item.id,
          name: item.name,
          price: item.price,
          quantity: item.quantity,
          total: item.price * item.quantity,
        })),
        subtotal: cartTotal,
        tax: tax,
        discount: discountAmount,
        total: grandTotal,
        paymentMethod: paymentMethod,
        cardLast4: paymentMethod === "card" ? cardNumber.slice(-4) : undefined,
        destinySupermarket: true,
        timestamp: new Date(),
        receiptNumber: receiptNumber,
      }

      // Save transaction to local storage
      await db.saveTransaction(transaction)

      // Update customer loyalty points and spending
      if (customer) {
        const updatedCustomer = {
          ...customer,
          loyaltyPoints: customer.loyaltyPoints + Math.floor(grandTotal),
          totalSpent: customer.totalSpent + grandTotal,
          lastVisit: new Date(),
        }
        await db.saveCustomer(updatedCustomer)
      }

      // Update inventory
      for (const item of cart) {
        await db.updateStock(item.id, item.quantity)
      }

      setPaymentStatus("success")
      clearCart()
      
      // Redirect to success page after brief delay
      setTimeout(() => {
        router.push("/success")
      }, 1500)
    } catch (error) {
      console.error("[v0] Payment error:", error)
      setErrorMessage("Payment processing failed. Please try again.")
      setPaymentStatus("error")
      setIsProcessing(false)
    }
  }

  if (cart.length === 0) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold">Your cart is empty</h1>
          <p className="mt-2 text-muted-foreground">Add some items to your cart before checkout</p>
          <Button className="mt-4" onClick={() => router.push("/")}>
            Return to POS
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto max-w-4xl py-8">
      <Button variant="ghost" className="mb-6" onClick={() => router.push("/")}>
        <ArrowLeft className="mr-2 h-4 w-4" />
        Back to POS
      </Button>

      <h1 className="mb-6 text-3xl font-bold">Checkout</h1>

      <div className="grid gap-8 md:grid-cols-2">
        <div>
          <h2 className="mb-4 text-xl font-semibold">Order Summary</h2>
          <div className="rounded-lg border p-4 bg-white">
            {cart.map((item) => (
              <div key={item.id} className="mb-3 flex justify-between">
                <div>
                  <p className="font-medium">{item.name}</p>
                  <p className="text-sm text-muted-foreground">
                    ${item.price.toFixed(2)} × {item.quantity}
                  </p>
                </div>
                <p className="font-medium">${(item.price * item.quantity).toFixed(2)}</p>
              </div>
            ))}

            <Separator className="my-4" />

            <div className="space-y-2">
              <div className="flex justify-between">
                <p>Subtotal</p>
                <p>${cartTotal.toFixed(2)}</p>
              </div>
              <div className="flex justify-between">
                <p>Tax (10%)</p>
                <p>${tax.toFixed(2)}</p>
              </div>
              <div className="flex justify-between">
                <p>Discount</p>
                <p>-${discountAmount.toFixed(2)}</p>
              </div>
              <div className="flex justify-between font-bold">
                <p>Total</p>
                <p>${grandTotal.toFixed(2)}</p>
              </div>
            </div>
          </div>
        </div>

        <div>
          <h2 className="mb-4 text-xl font-semibold">Payment Method</h2>
          <div className="rounded-lg border p-4 bg-white">
            {paymentStatus === "success" && (
              <Alert className="mb-4 border-green-200 bg-green-50">
                <CheckCircle className="h-4 w-4 text-green-600" />
                <AlertDescription className="text-green-800">
                  Payment processed successfully!
                </AlertDescription>
              </Alert>
            )}
            
            {paymentStatus === "error" && (
              <Alert className="mb-4 border-red-200 bg-red-50">
                <AlertCircle className="h-4 w-4 text-red-600" />
                <AlertDescription className="text-red-800">
                  {errorMessage}
                </AlertDescription>
              </Alert>
            )}

            <RadioGroup value={paymentMethod} onValueChange={setPaymentMethod} disabled={isProcessing}>
              <div className="flex items-center space-x-2 rounded-md border p-3">
                <RadioGroupItem value="card" id="card" disabled={isProcessing} />
                <Label htmlFor="card" className="flex items-center cursor-pointer">
                  <CreditCard className="mr-2 h-4 w-4" />
                  Credit/Debit Card
                </Label>
              </div>

              <div className="mt-3 flex items-center space-x-2 rounded-md border p-3">
                <RadioGroupItem value="cash" id="cash" disabled={isProcessing} />
                <Label htmlFor="cash" className="flex items-center cursor-pointer">
                  <Wallet className="mr-2 h-4 w-4" />
                  Cash
                </Label>
              </div>
            </RadioGroup>

            {paymentMethod === "card" && (
              <div className="mt-4 space-y-3">
                <Label htmlFor="cardInput" className="text-sm font-medium">
                  Card Number (Scan or Enter)
                </Label>
                <input
                  ref={cardInputRef}
                  id="cardInput"
                  type="text"
                  placeholder="Enter or scan card number"
                  value={cardNumber}
                  onChange={handleCardScan}
                  disabled={isProcessing}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  autoComplete="off"
                />
                <p className="text-xs text-gray-500">
                  {validateCard(cardNumber) ? "✓ Valid card number" : "Enter a 13-19 digit card number"}
                </p>
              </div>
            )}

            <Button 
              className="mt-6 w-full" 
              size="lg" 
              onClick={handlePayment}
              disabled={isProcessing || (paymentMethod === "card" && !validateCard(cardNumber))}
            >
              {isProcessing ? "Processing..." : "Complete Payment"}
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
