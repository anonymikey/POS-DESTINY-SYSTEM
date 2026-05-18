'use client'

import { useState, useEffect } from 'react'
import { format } from 'date-fns'
import { supabaseService } from '../services/supabase-service'
import { db } from '../services/database'
import { Search, RefreshCw } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'

interface Transaction {
  id: string
  receipt_number: string
  customer_name?: string
  total_amount: number
  payment_method: 'cash' | 'card'
  card_last_4?: string
  created_at: string
  items: Array<{
    product_name: string
    quantity: number
    price: number
  }>
}

export function TransactionsDashboard() {
  const [transactions, setTransactions] = useState<Transaction[]>([])
  const [filteredTransactions, setFilteredTransactions] = useState<Transaction[]>([])
  const [searchQuery, setSearchQuery] = useState('')
  const [isLoading, setIsLoading] = useState(true)
  const [isSupabaseEnabled] = useState(supabaseService.isConfigured())

  // Fetch initial transactions
  useEffect(() => {
    loadTransactions()
  }, [])

  // Set up real-time subscription if Supabase is available
  useEffect(() => {
    if (!isSupabaseEnabled) return

    const unsubscribe = supabaseService.subscribeToTransactions((newTransaction) => {
      setTransactions(prev => [newTransaction, ...prev])
      setFilteredTransactions(prev => [newTransaction, ...prev])
    })

    return () => {
      if (unsubscribe) {
        supabaseService.unsubscribeFromTransactions()
      }
    }
  }, [isSupabaseEnabled])

  const loadTransactions = async () => {
    setIsLoading(true)
    try {
      // Try to get from Supabase first
      if (isSupabaseEnabled) {
        const supabaseTransactions = await supabaseService.getTransactions(50)
        if (supabaseTransactions.length > 0) {
          setTransactions(supabaseTransactions as Transaction[])
          setFilteredTransactions(supabaseTransactions as Transaction[])
          setIsLoading(false)
          return
        }
      }

      // Fall back to local storage
      const localTransactions = await db.getTransactions()
      const mapped = localTransactions.map(t => ({
        id: t.id,
        receipt_number: t.receiptNumber,
        customer_name: undefined,
        total_amount: t.total,
        payment_method: (t.paymentMethod.toLowerCase() as 'cash' | 'card'),
        card_last_4: (t as any).cardLast4,
        created_at: t.timestamp?.toISOString() || new Date().toISOString(),
        items: t.items,
      }))
      setTransactions(mapped)
      setFilteredTransactions(mapped)
    } catch (err) {
      console.error('[v0] Error loading transactions:', err)
    } finally {
      setIsLoading(false)
    }
  }

  const handleSearch = (query: string) => {
    setSearchQuery(query)
    if (!query.trim()) {
      setFilteredTransactions(transactions)
      return
    }

    const filtered = transactions.filter(t =>
      t.receipt_number.toLowerCase().includes(query.toLowerCase()) ||
      t.customer_name?.toLowerCase().includes(query.toLowerCase())
    )
    setFilteredTransactions(filtered)
  }

  const getTotalAmount = () => {
    return filteredTransactions.reduce((sum, t) => sum + t.total_amount, 0)
  }

  const getTotalTransactions = () => {
    return filteredTransactions.length
  }

  const getPaymentMethodCount = (method: 'cash' | 'card') => {
    return filteredTransactions.filter(t => t.payment_method === method).length
  }

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Recent Transactions</h2>
        <Button
          variant="outline"
          size="sm"
          onClick={loadTransactions}
          disabled={isLoading}
        >
          <RefreshCw className={`h-4 w-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
          Refresh
        </Button>
      </div>

      {/* Status Indicator */}
      {isSupabaseEnabled && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
          <p className="text-sm text-blue-900">
            Real-time sync enabled - Transactions are synced with Supabase
          </p>
        </div>
      )}

      {/* Summary Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white border rounded-lg p-4">
          <p className="text-xs text-gray-600">Total Sales</p>
          <p className="text-2xl font-bold text-green-600">${getTotalAmount().toFixed(2)}</p>
        </div>
        <div className="bg-white border rounded-lg p-4">
          <p className="text-xs text-gray-600">Transactions</p>
          <p className="text-2xl font-bold">{getTotalTransactions()}</p>
        </div>
        <div className="bg-white border rounded-lg p-4">
          <p className="text-xs text-gray-600">Card Payments</p>
          <p className="text-2xl font-bold text-blue-600">{getPaymentMethodCount('card')}</p>
        </div>
        <div className="bg-white border rounded-lg p-4">
          <p className="text-xs text-gray-600">Cash Payments</p>
          <p className="text-2xl font-bold text-amber-600">{getPaymentMethodCount('cash')}</p>
        </div>
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
        <Input
          placeholder="Search by receipt # or customer name..."
          value={searchQuery}
          onChange={(e) => handleSearch(e.target.value)}
          className="pl-10"
        />
      </div>

      {/* Transactions List */}
      <div className="bg-white border rounded-lg overflow-hidden">
        {isLoading ? (
          <div className="p-8 text-center text-gray-500">
            Loading transactions...
          </div>
        ) : filteredTransactions.length === 0 ? (
          <div className="p-8 text-center text-gray-500">
            No transactions found
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 border-b">
                <tr>
                  <th className="px-4 py-3 text-left font-semibold">Receipt #</th>
                  <th className="px-4 py-3 text-left font-semibold">Customer</th>
                  <th className="px-4 py-3 text-left font-semibold">Items</th>
                  <th className="px-4 py-3 text-right font-semibold">Amount</th>
                  <th className="px-4 py-3 text-left font-semibold">Payment</th>
                  <th className="px-4 py-3 text-left font-semibold">Time</th>
                </tr>
              </thead>
              <tbody>
                {filteredTransactions.map((transaction) => (
                  <tr key={transaction.id} className="border-b hover:bg-gray-50">
                    <td className="px-4 py-3 font-mono font-semibold text-blue-600">
                      #{transaction.receipt_number}
                    </td>
                    <td className="px-4 py-3">
                      {transaction.customer_name || '-'}
                    </td>
                    <td className="px-4 py-3 text-gray-600">
                      {transaction.items.length} item{transaction.items.length !== 1 ? 's' : ''}
                    </td>
                    <td className="px-4 py-3 text-right font-semibold">
                      ${transaction.total_amount.toFixed(2)}
                    </td>
                    <td className="px-4 py-3">
                      <span className={`px-2 py-1 rounded text-xs font-semibold ${
                        transaction.payment_method === 'card'
                          ? 'bg-blue-100 text-blue-800'
                          : 'bg-green-100 text-green-800'
                      }`}>
                        {transaction.payment_method === 'card'
                          ? `Card ****${transaction.card_last_4}`
                          : 'Cash'}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-gray-600">
                      {format(new Date(transaction.created_at), 'HH:mm:ss')}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}
