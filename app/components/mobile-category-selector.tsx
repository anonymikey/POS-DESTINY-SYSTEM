"use client"

import { useState } from "react"
import { Menu, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet"
import { cn } from "@/lib/utils"

interface CategorySelectorProps {
  selectedCategory: string
  onSelectCategory: (categoryId: string) => void
  categories: Array<{ id: string; name: string; icon: any }>
}

export default function MobileCategorySelector({ selectedCategory, onSelectCategory, categories }: CategorySelectorProps) {
  const [isOpen, setIsOpen] = useState(false)

  const handleSelectCategory = (categoryId: string) => {
    onSelectCategory(categoryId)
    setIsOpen(false)
  }

  return (
    <>
      <Button
        variant="outline"
        size="sm"
        className="md:hidden"
        onClick={() => setIsOpen(true)}
      >
        <Menu className="h-4 w-4 mr-2" />
        Categories
      </Button>

      <Sheet open={isOpen} onOpenChange={setIsOpen}>
        <SheetContent side="left" className="w-64">
          <SheetHeader>
            <SheetTitle>Categories</SheetTitle>
          </SheetHeader>
          <div className="mt-4 space-y-2">
            {categories.map((category) => {
              const Icon = category.icon
              return (
                <Button
                  key={category.id}
                  variant="ghost"
                  className={cn(
                    "w-full justify-start gap-2",
                    selectedCategory === category.id && "bg-primary text-primary-foreground hover:bg-primary"
                  )}
                  onClick={() => handleSelectCategory(category.id)}
                >
                  <Icon className="h-4 w-4" />
                  {category.name}
                </Button>
              )
            })}
          </div>
        </SheetContent>
      </Sheet>
    </>
  )
}
