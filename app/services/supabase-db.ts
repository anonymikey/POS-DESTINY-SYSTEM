/**
 * Supabase Database Service
 * 
 * Handles all database operations for the POS system.
 * Provides both Supabase and localStorage fallbacks.
 */

import { supabase } from "./supabase-client"

const USE_SUPABASE = process.env.NEXT_PUBLIC_SUPABASE_URL

// Types
export interface Customer {
  id: string
  name: string
  email?: string
  phone?: string
  address?: string
  loyalty_points: number
  total_spent: number
  created_at: string
  updated_at: string
}

export interface Product {
  id: string
  name: string
  category_id?: string
  description?: string
  price: number
  cost: number
  stock: number
  low_stock_threshold: number
  image_url?: string
  supplier?: string
  sku?: string
  barcode?: string
  created_at: string
  updated_at: string
}

export interface Order {
  id: string
  customer_id?: string
  customer_name?: string
  total: number
  subtotal: number
  discount_amount: number
  tax_amount: number
  payment_method: string
  status: "pending" | "completed" | "refunded" | "cancelled"
  notes?: string
  items: OrderItem[]
  created_at: string
  updated_at: string
}

export interface OrderItem {
  id: string
  order_id: string
  product_id?: string
  product_name: string
  quantity: number
  unit_price: number
  total: number
  created_at: string
}

export interface Category {
  id: string
  name: string
  description?: string
  color: string
  icon: string
  product_count: number
  created_at: string
  updated_at: string
}

// ==================== CUSTOMERS ====================

export const customerService = {
  async getAll(): Promise<Customer[]> {
    if (USE_SUPABASE) {
      const { data, error } = await supabase.from("customers").select("*")
      if (error) {
        console.error("Error fetching customers:", error)
        return []
      }
      return data || []
    }
    // Fallback to localStorage
    const customers = localStorage.getItem("customers")
    return customers ? JSON.parse(customers) : []
  },

  async create(customer: Omit<Customer, "id" | "created_at" | "updated_at">): Promise<Customer | null> {
    if (USE_SUPABASE) {
      const { data, error } = await supabase
        .from("customers")
        .insert([customer])
        .select()
        .single()
      if (error) {
        console.error("Error creating customer:", error)
        return null
      }
      return data
    }
    // Fallback to localStorage
    const id = Math.random().toString(36).substr(2, 9)
    const now = new Date().toISOString()
    const newCustomer: Customer = {
      id,
      created_at: now,
      updated_at: now,
      loyalty_points: 0,
      total_spent: 0,
      ...customer,
    }
    const customers = await this.getAll()
    customers.push(newCustomer)
    localStorage.setItem("customers", JSON.stringify(customers))
    return newCustomer
  },

  async update(id: string, updates: Partial<Customer>): Promise<Customer | null> {
    if (USE_SUPABASE) {
      const { data, error } = await supabase
        .from("customers")
        .update({ ...updates, updated_at: new Date().toISOString() })
        .eq("id", id)
        .select()
        .single()
      if (error) {
        console.error("Error updating customer:", error)
        return null
      }
      return data
    }
    // Fallback to localStorage
    const customers = await this.getAll()
    const index = customers.findIndex((c) => c.id === id)
    if (index === -1) return null
    customers[index] = {
      ...customers[index],
      ...updates,
      updated_at: new Date().toISOString(),
    }
    localStorage.setItem("customers", JSON.stringify(customers))
    return customers[index]
  },

  async delete(id: string): Promise<boolean> {
    if (USE_SUPABASE) {
      const { error } = await supabase.from("customers").delete().eq("id", id)
      if (error) {
        console.error("Error deleting customer:", error)
        return false
      }
      return true
    }
    // Fallback to localStorage
    const customers = await this.getAll()
    const filtered = customers.filter((c) => c.id !== id)
    localStorage.setItem("customers", JSON.stringify(filtered))
    return true
  },
}

// ==================== PRODUCTS ====================

export const productService = {
  async getAll(): Promise<Product[]> {
    if (USE_SUPABASE) {
      const { data, error } = await supabase.from("inventory").select("*")
      if (error) {
        console.error("Error fetching products:", error)
        return []
      }
      return data || []
    }
    // Fallback to localStorage
    const products = localStorage.getItem("products")
    return products ? JSON.parse(products) : []
  },

  async getByCategory(categoryId: string): Promise<Product[]> {
    if (USE_SUPABASE) {
      const { data, error } = await supabase
        .from("inventory")
        .select("*")
        .eq("category_id", categoryId)
      if (error) {
        console.error("Error fetching products by category:", error)
        return []
      }
      return data || []
    }
    // Fallback to localStorage
    const products = await this.getAll()
    return products.filter((p) => p.category_id === categoryId)
  },

  async create(product: Omit<Product, "id" | "created_at" | "updated_at">): Promise<Product | null> {
    if (USE_SUPABASE) {
      const { data, error } = await supabase
        .from("inventory")
        .insert([product])
        .select()
        .single()
      if (error) {
        console.error("Error creating product:", error)
        return null
      }
      return data
    }
    // Fallback to localStorage
    const id = Math.random().toString(36).substr(2, 9)
    const now = new Date().toISOString()
    const newProduct: Product = {
      id,
      created_at: now,
      updated_at: now,
      ...product,
    }
    const products = await this.getAll()
    products.push(newProduct)
    localStorage.setItem("products", JSON.stringify(products))
    return newProduct
  },

  async update(id: string, updates: Partial<Product>): Promise<Product | null> {
    if (USE_SUPABASE) {
      const { data, error } = await supabase
        .from("inventory")
        .update({ ...updates, updated_at: new Date().toISOString() })
        .eq("id", id)
        .select()
        .single()
      if (error) {
        console.error("Error updating product:", error)
        return null
      }
      return data
    }
    // Fallback to localStorage
    const products = await this.getAll()
    const index = products.findIndex((p) => p.id === id)
    if (index === -1) return null
    products[index] = {
      ...products[index],
      ...updates,
      updated_at: new Date().toISOString(),
    }
    localStorage.setItem("products", JSON.stringify(products))
    return products[index]
  },

  async delete(id: string): Promise<boolean> {
    if (USE_SUPABASE) {
      const { error } = await supabase.from("inventory").delete().eq("id", id)
      if (error) {
        console.error("Error deleting product:", error)
        return false
      }
      return true
    }
    // Fallback to localStorage
    const products = await this.getAll()
    const filtered = products.filter((p) => p.id !== id)
    localStorage.setItem("products", JSON.stringify(filtered))
    return true
  },
}

// ==================== ORDERS ====================

export const orderService = {
  async getAll(): Promise<Order[]> {
    if (USE_SUPABASE) {
      const { data, error } = await supabase
        .from("orders")
        .select("*, order_items(*)")
        .order("created_at", { ascending: false })
      if (error) {
        console.error("Error fetching orders:", error)
        return []
      }
      return (data || []).map((order: any) => ({
        ...order,
        items: order.order_items || [],
      }))
    }
    // Fallback to localStorage
    const orders = localStorage.getItem("orders")
    return orders ? JSON.parse(orders) : []
  },

  async create(order: Omit<Order, "id" | "created_at" | "updated_at">): Promise<Order | null> {
    if (USE_SUPABASE) {
      const { data: orderData, error: orderError } = await supabase
        .from("orders")
        .insert([{
          customer_name: order.customer_name,
          total: order.total,
          subtotal: order.subtotal,
          discount_amount: order.discount_amount,
          tax_amount: order.tax_amount,
          payment_method: order.payment_method,
          status: order.status,
          customer_id: order.customer_id,
          notes: order.notes,
        }])
        .select()
        .single()

      if (orderError) {
        console.error("Error creating order:", orderError)
        return null
      }

      // Insert order items
      if (order.items && order.items.length > 0) {
        const items = order.items.map((item) => ({
          order_id: orderData.id,
          product_id: item.product_id,
          product_name: item.product_name,
          quantity: item.quantity,
          unit_price: item.unit_price,
          total: item.total,
        }))

        const { error: itemsError } = await supabase.from("order_items").insert(items)
        if (itemsError) {
          console.error("Error creating order items:", itemsError)
        }
      }

      return {
        ...orderData,
        items: order.items || [],
      }
    }
    // Fallback to localStorage
    const id = Math.random().toString(36).substr(2, 9)
    const now = new Date().toISOString()
    const newOrder: Order = {
      id,
      created_at: now,
      updated_at: now,
      ...order,
    }
    const orders = await this.getAll()
    orders.push(newOrder)
    localStorage.setItem("orders", JSON.stringify(orders))
    return newOrder
  },

  async update(id: string, updates: Partial<Order>): Promise<Order | null> {
    if (USE_SUPABASE) {
      const { data, error } = await supabase
        .from("orders")
        .update({ ...updates, updated_at: new Date().toISOString() })
        .eq("id", id)
        .select()
        .single()
      if (error) {
        console.error("Error updating order:", error)
        return null
      }
      return { ...data, items: updates.items || [] }
    }
    // Fallback to localStorage
    const orders = await this.getAll()
    const index = orders.findIndex((o) => o.id === id)
    if (index === -1) return null
    orders[index] = {
      ...orders[index],
      ...updates,
      updated_at: new Date().toISOString(),
    }
    localStorage.setItem("orders", JSON.stringify(orders))
    return orders[index]
  },
}

// ==================== CATEGORIES ====================

export const categoryService = {
  async getAll(): Promise<Category[]> {
    if (USE_SUPABASE) {
      const { data, error } = await supabase.from("categories").select("*")
      if (error) {
        console.error("Error fetching categories:", error)
        return []
      }
      return data || []
    }
    // Fallback to localStorage
    const categories = localStorage.getItem("categories")
    return categories ? JSON.parse(categories) : []
  },

  async create(category: Omit<Category, "id" | "created_at" | "updated_at">): Promise<Category | null> {
    if (USE_SUPABASE) {
      const { data, error } = await supabase
        .from("categories")
        .insert([category])
        .select()
        .single()
      if (error) {
        console.error("Error creating category:", error)
        return null
      }
      return data
    }
    // Fallback to localStorage
    const id = Math.random().toString(36).substr(2, 9)
    const now = new Date().toISOString()
    const newCategory: Category = {
      id,
      created_at: now,
      updated_at: now,
      ...category,
    }
    const categories = await this.getAll()
    categories.push(newCategory)
    localStorage.setItem("categories", JSON.stringify(categories))
    return newCategory
  },

  async update(id: string, updates: Partial<Category>): Promise<Category | null> {
    if (USE_SUPABASE) {
      const { data, error } = await supabase
        .from("categories")
        .update({ ...updates, updated_at: new Date().toISOString() })
        .eq("id", id)
        .select()
        .single()
      if (error) {
        console.error("Error updating category:", error)
        return null
      }
      return data
    }
    // Fallback to localStorage
    const categories = await this.getAll()
    const index = categories.findIndex((c) => c.id === id)
    if (index === -1) return null
    categories[index] = {
      ...categories[index],
      ...updates,
      updated_at: new Date().toISOString(),
    }
    localStorage.setItem("categories", JSON.stringify(categories))
    return categories[index]
  },
}

// ==================== HEALTH CHECK ====================

export const dbHealthCheck = {
  isSupabaseConnected(): boolean {
    return !!USE_SUPABASE
  },

  async test(): Promise<{
    supabase: boolean
    localStorage: boolean
  }> {
    const result = { supabase: false, localStorage: true }

    if (USE_SUPABASE) {
      try {
        const { data, error } = await supabase.from("categories").select("count")
        result.supabase = !error && data !== null
      } catch (err) {
        result.supabase = false
      }
    }

    return result
  },
}
