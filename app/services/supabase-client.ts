/**
 * Supabase Client Configuration
 * 
 * This client is used for all database operations.
 * Make sure NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY
 * are set in your environment variables.
 */

import { createClient } from "@supabase/supabase-js"

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  console.warn(
    "Supabase credentials not found. Using localStorage fallback. " +
      "Set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY in .env.local for production use."
  )
}

export const supabase = createClient(
  supabaseUrl || "https://placeholder.supabase.co",
  supabaseAnonKey || "placeholder-key"
)

export type Database = {
  public: {
    Tables: {
      users: {
        Row: {
          id: string
          email: string
          full_name: string | null
          role: "admin" | "cashier" | "user"
          created_at: string
          updated_at: string
        }
      }
      customers: {
        Row: {
          id: string
          name: string
          email: string | null
          phone: string | null
          address: string | null
          loyalty_points: number
          total_spent: number
          created_at: string
          updated_at: string
        }
      }
      inventory: {
        Row: {
          id: string
          name: string
          category_id: string | null
          description: string | null
          price: number
          cost: number
          stock: number
          low_stock_threshold: number
          image_url: string | null
          supplier: string | null
          sku: string | null
          barcode: string | null
          created_at: string
          updated_at: string
        }
      }
      orders: {
        Row: {
          id: string
          customer_id: string | null
          user_id: string | null
          customer_name: string | null
          total: number
          subtotal: number
          discount_amount: number
          tax_amount: number
          payment_method: string
          status: "pending" | "completed" | "refunded" | "cancelled"
          notes: string | null
          created_at: string
          updated_at: string
        }
      }
      order_items: {
        Row: {
          id: string
          order_id: string
          product_id: string | null
          product_name: string
          quantity: number
          unit_price: number
          total: number
          created_at: string
        }
      }
      categories: {
        Row: {
          id: string
          name: string
          description: string | null
          color: string
          icon: string
          product_count: number
          created_at: string
          updated_at: string
        }
      }
    }
  }
}
