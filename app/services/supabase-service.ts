import { createClient } from '@supabase/supabase-js'
import type { RealtimeChannel } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  console.warn('[v0] Supabase credentials not configured - using local storage only')
}

export const supabase = supabaseUrl && supabaseAnonKey 
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null

export interface TransactionData {
  id?: string
  receipt_number: string
  customer_name?: string | null
  total_amount: number
  payment_method: 'cash' | 'card'
  card_last_4?: string | null
  items: Array<{
    product_id: number
    product_name: string
    quantity: number
    price: number
    subtotal: number
  }>
  subtotal: number
  tax: number
  discount: number
  created_at?: string
  created_by?: string
}

export interface ReceiptData {
  id?: string
  transaction_id: string
  receipt_number: string
  customer_name?: string | null
  total_amount: number
  items_count: number
  status: 'pending' | 'printed' | 'sent'
  printed_at?: string | null
  created_at?: string
}

class SupabaseService {
  private transactionChannel: RealtimeChannel | null = null

  /**
   * Save transaction to Supabase
   */
  async saveTransaction(data: TransactionData) {
    if (!supabase) {
      console.warn('[v0] Supabase not configured, transaction not saved to cloud')
      return null
    }

    try {
      const { data: transaction, error } = await supabase
        .from('transactions')
        .insert([
          {
            receipt_number: data.receipt_number,
            customer_name: data.customer_name,
            total_amount: data.total_amount,
            payment_method: data.payment_method,
            card_last_4: data.card_last_4,
            items: data.items,
            subtotal: data.subtotal,
            tax: data.tax,
            discount: data.discount,
          },
        ])
        .select()
        .single()

      if (error) {
        console.error('[v0] Error saving transaction:', error)
        return null
      }

      console.log('[v0] Transaction saved to Supabase:', transaction.id)
      return transaction
    } catch (err) {
      console.error('[v0] Error saving transaction:', err)
      return null
    }
  }

  /**
   * Get all transactions with pagination
   */
  async getTransactions(limit = 50, offset = 0) {
    if (!supabase) return []

    try {
      const { data, error } = await supabase
        .from('transactions')
        .select('*')
        .order('created_at', { ascending: false })
        .range(offset, offset + limit - 1)

      if (error) {
        console.error('[v0] Error fetching transactions:', error)
        return []
      }

      return data || []
    } catch (err) {
      console.error('[v0] Error fetching transactions:', err)
      return []
    }
  }

  /**
   * Get transaction by ID
   */
  async getTransaction(transactionId: string) {
    if (!supabase) return null

    try {
      const { data, error } = await supabase
        .from('transactions')
        .select('*')
        .eq('id', transactionId)
        .single()

      if (error) {
        console.error('[v0] Error fetching transaction:', error)
        return null
      }

      return data
    } catch (err) {
      console.error('[v0] Error fetching transaction:', err)
      return null
    }
  }

  /**
   * Get transactions for today
   */
  async getTodayTransactions() {
    if (!supabase) return []

    try {
      const today = new Date()
      today.setHours(0, 0, 0, 0)
      const tomorrow = new Date(today)
      tomorrow.setDate(tomorrow.getDate() + 1)

      const { data, error } = await supabase
        .from('transactions')
        .select('*')
        .gte('created_at', today.toISOString())
        .lt('created_at', tomorrow.toISOString())
        .order('created_at', { ascending: false })

      if (error) {
        console.error('[v0] Error fetching today transactions:', error)
        return []
      }

      return data || []
    } catch (err) {
      console.error('[v0] Error fetching today transactions:', err)
      return []
    }
  }

  /**
   * Search transactions by receipt number or customer name
   */
  async searchTransactions(query: string) {
    if (!supabase) return []

    try {
      const { data, error } = await supabase
        .from('transactions')
        .select('*')
        .or(`receipt_number.ilike.%${query}%,customer_name.ilike.%${query}%`)
        .order('created_at', { ascending: false })
        .limit(50)

      if (error) {
        console.error('[v0] Error searching transactions:', error)
        return []
      }

      return data || []
    } catch (err) {
      console.error('[v0] Error searching transactions:', err)
      return []
    }
  }

  /**
   * Save receipt tracking info
   */
  async saveReceipt(data: ReceiptData) {
    if (!supabase) return null

    try {
      const { data: receipt, error } = await supabase
        .from('receipts')
        .insert([
          {
            transaction_id: data.transaction_id,
            receipt_number: data.receipt_number,
            customer_name: data.customer_name,
            total_amount: data.total_amount,
            items_count: data.items_count,
            status: 'pending',
          },
        ])
        .select()
        .single()

      if (error) {
        console.error('[v0] Error saving receipt:', error)
        return null
      }

      return receipt
    } catch (err) {
      console.error('[v0] Error saving receipt:', err)
      return null
    }
  }

  /**
   * Update receipt status (printed, sent, etc.)
   */
  async updateReceiptStatus(receiptId: string, status: 'printed' | 'sent') {
    if (!supabase) return null

    try {
      const updateData: any = { status }
      if (status === 'printed') {
        updateData.printed_at = new Date().toISOString()
      }

      const { data, error } = await supabase
        .from('receipts')
        .update(updateData)
        .eq('id', receiptId)
        .select()
        .single()

      if (error) {
        console.error('[v0] Error updating receipt status:', error)
        return null
      }

      return data
    } catch (err) {
      console.error('[v0] Error updating receipt status:', err)
      return null
    }
  }

  /**
   * Get daily sales summary
   */
  async getDailySalesSummary(date?: Date) {
    if (!supabase) return null

    try {
      const targetDate = date || new Date()
      targetDate.setHours(0, 0, 0, 0)
      const nextDate = new Date(targetDate)
      nextDate.setDate(nextDate.getDate() + 1)

      const { data, error } = await supabase
        .from('transactions')
        .select('total_amount, payment_method')
        .gte('created_at', targetDate.toISOString())
        .lt('created_at', nextDate.toISOString())

      if (error) {
        console.error('[v0] Error fetching sales summary:', error)
        return null
      }

      const transactions = data || []
      const totalSales = transactions.reduce((sum, t) => sum + (t.total_amount || 0), 0)
      const totalTransactions = transactions.length
      const cardTransactions = transactions.filter(t => t.payment_method === 'card').length
      const cashTransactions = transactions.filter(t => t.payment_method === 'cash').length

      return {
        date: targetDate.toISOString().split('T')[0],
        totalSales,
        totalTransactions,
        cardTransactions,
        cashTransactions,
        averageTransaction: totalTransactions > 0 ? totalSales / totalTransactions : 0,
      }
    } catch (err) {
      console.error('[v0] Error fetching sales summary:', err)
      return null
    }
  }

  /**
   * Subscribe to new transactions in real-time
   */
  subscribeToTransactions(callback: (transaction: any) => void) {
    if (!supabase) {
      console.warn('[v0] Supabase not configured, cannot subscribe to transactions')
      return null
    }

    try {
      this.transactionChannel = supabase
        .channel('transactions:*')
        .on(
          'postgres_changes',
          {
            event: 'INSERT',
            schema: 'public',
            table: 'transactions',
          },
          (payload) => {
            console.log('[v0] New transaction received:', payload.new)
            callback(payload.new)
          }
        )
        .subscribe()

      return this.transactionChannel
    } catch (err) {
      console.error('[v0] Error subscribing to transactions:', err)
      return null
    }
  }

  /**
   * Unsubscribe from transaction updates
   */
  unsubscribeFromTransactions() {
    if (this.transactionChannel && supabase) {
      supabase.removeChannel(this.transactionChannel)
      this.transactionChannel = null
    }
  }

  /**
   * Check if Supabase is configured
   */
  isConfigured(): boolean {
    return supabase !== null
  }
}

export const supabaseService = new SupabaseService()
