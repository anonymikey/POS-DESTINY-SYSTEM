"use client"

import { useState, useEffect } from "react"
import { Plus, Edit, Trash2, MoreHorizontal, Tag, Grid } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"

interface Category {
  id: number
  name: string
  description: string
  color: string
  icon: string
  productCount: number
}

const defaultCategories: Category[] = [
  { id: 1, name: "Food", description: "Main food items and dishes", color: "bg-blue-100 text-blue-800", icon: "🍔", productCount: 5 },
  { id: 2, name: "Drinks", description: "Beverages and drinks", color: "bg-cyan-100 text-cyan-800", icon: "☕", productCount: 4 },
  { id: 3, name: "Desserts", description: "Desserts and sweets", color: "bg-pink-100 text-pink-800", icon: "🍰", productCount: 6 },
  { id: 4, name: "Snacks", description: "Light snacks and appetizers", color: "bg-orange-100 text-orange-800", icon: "🍟", productCount: 3 },
]

interface CategoryFormData {
  name: string
  description: string
  color: string
  icon: string
}

export default function CategoriesPage() {
  const [categories, setCategories] = useState<Category[]>(defaultCategories)
  const [showAddDialog, setShowAddDialog] = useState(false)
  const [editingCategory, setEditingCategory] = useState<Category | null>(null)
  const [formData, setFormData] = useState<CategoryFormData>({
    name: "",
    description: "",
    color: "bg-blue-100 text-blue-800",
    icon: "📦",
  })

  useEffect(() => {
    const savedCategories = localStorage.getItem("pos_categories")
    if (savedCategories) {
      setCategories(JSON.parse(savedCategories))
    }
  }, [])

  const colorOptions = [
    { value: "bg-blue-100 text-blue-800", label: "Blue" },
    { value: "bg-cyan-100 text-cyan-800", label: "Cyan" },
    { value: "bg-pink-100 text-pink-800", label: "Pink" },
    { value: "bg-orange-100 text-orange-800", label: "Orange" },
    { value: "bg-green-100 text-green-800", label: "Green" },
    { value: "bg-purple-100 text-purple-800", label: "Purple" },
    { value: "bg-red-100 text-red-800", label: "Red" },
    { value: "bg-yellow-100 text-yellow-800", label: "Yellow" },
  ]

  const iconOptions = ["🍔", "☕", "🍰", "🍟", "🥗", "🍕", "🍗", "🍪", "🥤", "🍓", "🧁", "📦"]

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    const categoryData: Category = {
      id: editingCategory?.id || Date.now(),
      ...formData,
      productCount: editingCategory?.productCount || 0,
    }

    let updatedCategories
    if (editingCategory) {
      updatedCategories = categories.map((c) => (c.id === editingCategory.id ? categoryData : c))
    } else {
      updatedCategories = [...categories, categoryData]
    }

    setCategories(updatedCategories)
    localStorage.setItem("pos_categories", JSON.stringify(updatedCategories))
    resetForm()
  }

  const handleEdit = (category: Category) => {
    setEditingCategory(category)
    setFormData({
      name: category.name,
      description: category.description,
      color: category.color,
      icon: category.icon,
    })
    setShowAddDialog(true)
  }

  const handleDelete = (categoryId: number) => {
    if (confirm("Are you sure you want to delete this category?")) {
      const updatedCategories = categories.filter((c) => c.id !== categoryId)
      setCategories(updatedCategories)
      localStorage.setItem("pos_categories", JSON.stringify(updatedCategories))
    }
  }

  const resetForm = () => {
    setFormData({
      name: "",
      description: "",
      color: "bg-blue-100 text-blue-800",
      icon: "📦",
    })
    setEditingCategory(null)
    setShowAddDialog(false)
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold">Categories</h1>
          <p className="text-muted-foreground">Organize your products into categories</p>
        </div>
        <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
          <DialogTrigger asChild>
            <Button onClick={() => resetForm()}>
              <Plus className="h-4 w-4 mr-2" />
              Add Category
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>{editingCategory ? "Edit Category" : "Add New Category"}</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label htmlFor="name">Category Name *</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  required
                />
              </div>

              <div>
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  rows={3}
                />
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <Label htmlFor="color">Color</Label>
                  <select
                    id="color"
                    className="w-full px-3 py-2 border border-input rounded-md bg-background"
                    value={formData.color}
                    onChange={(e) => setFormData({ ...formData, color: e.target.value })}
                  >
                    {colorOptions.map((opt) => (
                      <option key={opt.value} value={opt.value}>
                        {opt.label}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <Label htmlFor="icon">Icon</Label>
                  <select
                    id="icon"
                    className="w-full px-3 py-2 border border-input rounded-md bg-background text-lg"
                    value={formData.icon}
                    onChange={(e) => setFormData({ ...formData, icon: e.target.value })}
                  >
                    {iconOptions.map((icon) => (
                      <option key={icon} value={icon}>
                        {icon}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="pt-4">
                <div className={`p-4 rounded-lg ${formData.color} text-center`}>
                  <span className="text-2xl mr-2">{formData.icon}</span>
                  <span className="font-medium">{formData.name || "Category Name"}</span>
                </div>
              </div>

              <div className="flex gap-2 pt-4">
                <Button type="submit">{editingCategory ? "Update Category" : "Add Category"}</Button>
                <Button type="button" variant="outline" onClick={resetForm}>
                  Cancel
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Categories Grid */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {categories.map((category) => (
          <Card key={category.id} className="overflow-hidden hover:shadow-lg transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div className={`p-3 rounded-lg ${category.color} text-2xl`}>{category.icon}</div>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon" className="h-8 w-8">
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={() => handleEdit(category)}>
                      <Edit className="h-4 w-4 mr-2" />
                      Edit
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => handleDelete(category.id)} className="text-red-600">
                      <Trash2 className="h-4 w-4 mr-2" />
                      Delete
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>

              <h3 className="font-semibold text-lg mb-2">{category.name}</h3>
              <p className="text-sm text-muted-foreground mb-4">{category.description}</p>

              <div className="flex items-center justify-between pt-4 border-t">
                <div className="flex items-center gap-2">
                  <Grid className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm text-muted-foreground">{category.productCount} products</span>
                </div>
                <Badge variant="secondary">{category.name}</Badge>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {categories.length === 0 && (
        <Card>
          <CardContent className="p-12 text-center">
            <Tag className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
            <h3 className="font-medium mb-2">No categories found</h3>
            <p className="text-muted-foreground mb-4">Create your first category to get started</p>
            <Button onClick={() => setShowAddDialog(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Add Category
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
