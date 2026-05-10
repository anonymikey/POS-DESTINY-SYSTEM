import type React from "react"
import { Coffee, IceCream, LayoutGrid, Utensils } from "lucide-react"

export interface CategoryItem {
  id: string
  name: string
  icon: React.ElementType
}

export const categories: CategoryItem[] = [
  {
    id: "all",
    name: "All Products",
    icon: LayoutGrid,
  },
  {
    id: "food",
    name: "Food",
    icon: Utensils,
  },
  {
    id: "drinks",
    name: "Drinks",
    icon: Coffee,
  },
  {
    id: "desserts",
    name: "Desserts",
    icon: IceCream,
  },
]
