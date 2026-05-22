'use client'

import { useRouter } from 'next/navigation'
import { ArrowLeft, BookOpen, Zap, Users, ShoppingCart } from 'lucide-react'

export default function DocumentationPage() {
  const router = useRouter()

  const docs = [
    {
      icon: Zap,
      title: 'Getting Started',
      description: 'Learn how to set up and access the Destiny Supermarket POS system for the first time.'
    },
    {
      icon: Users,
      title: 'Employee Management',
      description: 'Guide for creating employee accounts, managing roles, and handling access control.'
    },
    {
      icon: ShoppingCart,
      title: 'Point of Sale Operations',
      description: 'Complete guide for processing transactions, accepting payments, and managing receipts.'
    },
    {
      icon: BookOpen,
      title: 'Admin Dashboard',
      description: 'Learn how to manage inventory, view analytics, and generate reports.'
    }
  ]

  return (
    <div className="min-h-screen bg-gradient-to-b from-black via-slate-900 to-black relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-blue-500/10 rounded-full blur-3xl" />
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-cyan-500/10 rounded-full blur-3xl" />
      </div>

      <div className="relative z-10">
        {/* Header */}
        <div className="border-b border-white/10 bg-black/40 backdrop-blur-xl">
          <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
            <h1 className="text-2xl font-bold">Destiny Supermarket</h1>
            <button
              onClick={() => router.back()}
              className="flex items-center gap-2 text-white/60 hover:text-white transition"
            >
              <ArrowLeft className="w-4 h-4" />
              Back
            </button>
          </div>
        </div>

        {/* Documentation Content */}
        <main className="max-w-6xl mx-auto px-6 py-16">
          <div className="text-center mb-16">
            <h2 className="text-5xl font-bold mb-4">Documentation</h2>
            <p className="text-xl text-white/60 max-w-2xl mx-auto">
              Everything you need to know about using the Destiny Supermarket POS system.
            </p>
          </div>

          {/* Documentation Sections */}
          <div className="grid md:grid-cols-2 gap-8 mb-16">
            {docs.map((doc, index) => {
              const Icon = doc.icon
              return (
                <div
                  key={index}
                  className="rounded-lg border border-white/10 bg-white/5 backdrop-blur-xl p-8 hover:border-white/20 transition cursor-pointer group"
                >
                  <div className="flex items-center gap-4 mb-4">
                    <div className="w-12 h-12 rounded-lg bg-blue-500/20 group-hover:bg-blue-500/30 flex items-center justify-center transition">
                      <Icon className="w-6 h-6 text-blue-400" />
                    </div>
                    <h3 className="text-xl font-semibold group-hover:text-blue-400 transition">{doc.title}</h3>
                  </div>
                  <p className="text-white/60">{doc.description}</p>
                </div>
              )
            })}
          </div>

          {/* Quick Links */}
          <div className="space-y-8">
            <section>
              <h3 className="text-3xl font-bold mb-4">Getting Started</h3>
              <div className="rounded-lg border border-white/10 bg-white/5 backdrop-blur-xl p-8">
                <ol className="space-y-4 text-white/70 list-decimal list-inside">
                  <li>Access the system through the employee login at the landing page</li>
                  <li>Enter your credentials provided by your manager</li>
                  <li>Navigate to the Point of Sale dashboard</li>
                  <li>Start processing transactions by adding items to the cart</li>
                  <li>Complete payment using card or cash payment methods</li>
                  <li>Print or save the receipt for the customer</li>
                </ol>
              </div>
            </section>

            <section>
              <h3 className="text-3xl font-bold mb-4">Key Features</h3>
              <div className="grid md:grid-cols-2 gap-6">
                <div className="rounded-lg border border-white/10 bg-white/5 backdrop-blur-xl p-6">
                  <h4 className="font-semibold mb-3">Card Processing</h4>
                  <p className="text-white/60 text-sm">
                    Accept card payments with real-time validation. Scan or manually enter card numbers for secure transactions.
                  </p>
                </div>
                <div className="rounded-lg border border-white/10 bg-white/5 backdrop-blur-xl p-6">
                  <h4 className="font-semibold mb-3">Receipt Management</h4>
                  <p className="text-white/60 text-sm">
                    Generate, print, and track receipts. All receipts are automatically backed up to the cloud.
                  </p>
                </div>
                <div className="rounded-lg border border-white/10 bg-white/5 backdrop-blur-xl p-6">
                  <h4 className="font-semibold mb-3">Real-time Inventory</h4>
                  <p className="text-white/60 text-sm">
                    Inventory is updated in real-time as transactions are completed. Stay informed of stock levels.
                  </p>
                </div>
                <div className="rounded-lg border border-white/10 bg-white/5 backdrop-blur-xl p-6">
                  <h4 className="font-semibold mb-3">Analytics Dashboard</h4>
                  <p className="text-white/60 text-sm">
                    View detailed sales reports, transaction history, and performance metrics for your store.
                  </p>
                </div>
              </div>
            </section>

            <section>
              <h3 className="text-3xl font-bold mb-4">Need Help?</h3>
              <p className="text-white/70 mb-4">
                If you need additional assistance or have questions not covered in the documentation, please reach out to our support team:
              </p>
              <p>
                <strong>Email:</strong> <a href="mailto:admin@anonymikletech.online" className="text-blue-400 hover:text-blue-300">admin@anonymikletech.online</a><br />
                <strong>Phone:</strong> <a href="tel:+254782829321" className="text-blue-400 hover:text-blue-300">+254 782 829 321</a>
              </p>
            </section>
          </div>
        </main>
      </div>
    </div>
  )
}
