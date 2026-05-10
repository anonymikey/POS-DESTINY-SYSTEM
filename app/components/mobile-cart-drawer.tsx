"use client"

import { useRouter } from "next/navigation"
import Image from "next/image"
import { Minus, Plus, Trash2, X, User, Tag } from "lucide-react"
import { useState } from "react"

import { Button } from "@/components/ui/button"
import { useCart } from "../context/cart-context"
import CustomerModal from "./customer-modal"
import DiscountModal from "./discount-modal"
import { Drawer, DrawerContent, DrawerHeader, DrawerTitle } from "@/components/ui/drawer"

interface MobileCartDrawerProps {
  isOpen: boolean
  onClose: () => void
}

export default function MobileCartDrawer({ isOpen, onClose }: MobileCartDrawerProps) {
  const router = useRouter()
  const { cart, removeFromCart, updateQuantity, clearCart, cartTotal, itemCount, customer, appliedDiscount, discountAmount } = useCart()
  const [showCustomerModal, setShowCustomerModal] = useState(false)
  const [showDiscountModal, setShowDiscountModal] = useState(false)

  const finalTotal = cartTotal - discountAmount
  const tax = finalTotal * 0.08

  const handleCheckout = () => {
    if (cart.length === 0) return
    onClose()
    router.push("/checkout")
  }

  return (
    <>
      <Drawer open={isOpen} onOpenChange={onClose}>
        <DrawerContent className="max-h-[85vh] flex flex-col">
          <DrawerHeader className="flex items-center justify-between border-b pb-4">
            <DrawerTitle>Shopping Cart ({itemCount})</DrawerTitle>
            <button onClick={onClose} className="p-1">
              <X className="h-5 w-5" />
            </button>
          </DrawerHeader>

          <div className="flex-1 overflow-auto p-4 space-y-4">
            {customer && (
              <div className="bg-primary/10 border border-primary rounded-lg p-3 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <User className="h-4 w-4" />
                  <span className="text-sm font-medium">{customer.name}</span>
                </div>
                <Button variant="ghost" size="sm" onClick={() => setShowCustomerModal(true)}>
                  Change
                </Button>
              </div>
            )}

            {cart.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-12 text-center">
                <p className="text-muted-foreground">Your cart is empty</p>
              </div>
            ) : (
              <>
                {cart.map((item) => (
                  <div key={item.id} className="flex gap-3 pb-4 border-b">
                    <div className="relative h-20 w-20 flex-shrink-0 overflow-hidden rounded-md">
                      <Image
                        src={item.image || "/placeholder.svg"}
                        alt={item.name}
                        fill
                        className="object-cover"
                        sizes="80px"
                        quality={70}
                      />
                    </div>
                    <div className="flex-1 flex flex-col justify-between">
                      <div>
                        <h3 className="font-medium text-sm line-clamp-1">{item.name}</h3>
                        <p className="text-sm text-muted-foreground">${item.price.toFixed(2)}</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          className="h-7 w-7 p-0"
                          onClick={() => updateQuantity(item.id, item.quantity - 1)}
                        >
                          <Minus className="h-3 w-3" />
                        </Button>
                        <span className="text-sm font-medium w-6 text-center">{item.quantity}</span>
                        <Button
                          variant="outline"
                          size="sm"
                          className="h-7 w-7 p-0"
                          onClick={() => updateQuantity(item.id, item.quantity + 1)}
                        >
                          <Plus className="h-3 w-3" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-7 w-7 p-0 ml-auto"
                          onClick={() => removeFromCart(item.id)}
                        >
                          <Trash2 className="h-3 w-3" />
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </>
            )}
          </div>

          {cart.length > 0 && (
            <div className="border-t p-4 space-y-4">
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Subtotal</span>
                  <span>${cartTotal.toFixed(2)}</span>
                </div>
                {appliedDiscount && (
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">
                      <Tag className="h-3 w-3 inline mr-1" />
                      Discount
                    </span>
                    <span className="text-green-600">-${discountAmount.toFixed(2)}</span>
                  </div>
                )}
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Tax (8%)</span>
                  <span>${tax.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-lg font-bold border-t pt-2">
                  <span>Total</span>
                  <span>${(finalTotal + tax).toFixed(2)}</span>
                </div>
              </div>

              <div className="flex gap-2">
                <Button variant="outline" onClick={() => setShowDiscountModal(true)} className="flex-1">
                  <Tag className="h-4 w-4 mr-2" />
                  Discount
                </Button>
                <Button variant="outline" onClick={() => setShowCustomerModal(true)} className="flex-1">
                  <User className="h-4 w-4 mr-2" />
                  Customer
                </Button>
              </div>

              <div className="flex gap-2">
                <Button variant="outline" onClick={clearCart} className="flex-1">
                  Clear
                </Button>
                <Button onClick={handleCheckout} className="flex-1">
                  Checkout
                </Button>
              </div>
            </div>
          )}
        </DrawerContent>
      </Drawer>

      <CustomerModal isOpen={showCustomerModal} onClose={() => setShowCustomerModal(false)} />
      <DiscountModal isOpen={showDiscountModal} onClose={() => setShowDiscountModal(false)} />
    </>
  )
}
