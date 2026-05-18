'use client'

import { useState, useEffect } from 'react'
import { Search, Settings, ShoppingCart, LogOut } from 'lucide-react'
import { Input } from '@/components/ui/input'
import ProductGrid from './components/product-grid'
import CartSidebar from './components/cart-sidebar'
import CategorySidebar from './components/category-sidebar'
import MobileCartDrawer from './components/mobile-cart-drawer'
import MobileCategorySelector from './components/mobile-category-selector'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { useCart } from './context/cart-context'
import { categories } from './data/categories'
import { OnboardingModal } from './components/onboarding-modal'
import Image from 'next/image'

export default function POSPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("all")
  const [showMobileCart, setShowMobileCart] = useState(false)
  const [isAuthed, setIsAuthed] = useState(false)
  const router = useRouter()
  const { itemCount } = useCart()

  useEffect(() => {
    // Check if user is coming from landing page with employee access
    const isEmployee = localStorage.getItem("pos_employee_access") === "true"
    if (!isEmployee) {
      // Redirect to landing page if not authenticated as employee
      router.push("/landing")
      return
    }
    setIsAuthed(true)
  }, [router])

  const handleLogout = () => {
    localStorage.removeItem("pos_employee_access")
    router.push("/landing")
  }

  if (!isAuthed) {
    return null // Don't render until auth check is complete
  }

  return (
    <div className="flex flex-col md:flex-row h-screen bg-background">
      <CategorySidebar selectedCategory={selectedCategory} onSelectCategory={setSelectedCategory} />

      <main className="flex-1 flex flex-col h-screen overflow-hidden">
        <div className="sticky top-0 z-10 bg-background p-4 border-b">
          <div className="flex flex-col gap-3 sm:gap-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 relative">
                  <Image 
                    src="/destiny-logo.png" 
                    alt="Destiny Supermarket Logo" 
                    width={32}
                    height={32}
                    className="w-full h-full object-contain"
                  />
                </div>
                <div>
                  <h1 className="text-2xl font-bold">Destiny Supermarket</h1>
                  <p className="text-xs text-muted-foreground">Point of Sale System</p>
                </div>
              </div>
              <div className="flex gap-2 md:hidden">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setShowMobileCart(true)}
                  className="relative"
                >
                  <ShoppingCart className="h-4 w-4 mr-2" />
                  Cart ({itemCount})
                </Button>
                <Button variant="outline" size="sm" onClick={() => router.push("/admin")}>
                  <Settings className="h-4 w-4" />
                </Button>
                <Button variant="outline" size="sm" onClick={handleLogout}>
                  <LogOut className="h-4 w-4" />
                </Button>
              </div>
              <div className="flex gap-2 md:flex-row hidden">
                <Button variant="outline" size="sm" onClick={() => router.push("/admin")}>
                  <Settings className="h-4 w-4 mr-2" />
                  Admin
                </Button>
                <Button variant="outline" size="sm" onClick={handleLogout}>
                  <LogOut className="h-4 w-4 mr-2" />
                  Logout
                </Button>
              </div>
            </div>
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
              <MobileCategorySelector
                selectedCategory={selectedCategory}
                onSelectCategory={setSelectedCategory}
                categories={categories}
              />
              <div className="relative flex-1 sm:flex-none">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search products..."
                  className="pl-8 w-full sm:w-64"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            </div>
          </div>
        </div>

        <div className="flex-1 overflow-auto p-4">
          <ProductGrid category={selectedCategory} searchQuery={searchQuery} />
        </div>
      </main>

      <CartSidebar />
      <MobileCartDrawer isOpen={showMobileCart} onClose={() => setShowMobileCart(false)} />
      <OnboardingModal />
    </div>
  )
}
