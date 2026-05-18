'use client'

import { TransactionsDashboard } from '@/app/components/transactions-dashboard'

export default function TransactionsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Transactions</h1>
        <p className="text-muted-foreground">Track all sales and payment transactions in real-time</p>
      </div>

      <TransactionsDashboard />
    </div>
  )
}
