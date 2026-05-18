'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { 
  Menu, 
  X, 
  ChevronRight, 
  Sparkles, 
  TrendingUp, 
  Users, 
  Package,
  BarChart3,
  Lock,
  LogIn
} from 'lucide-react'
import Image from 'next/image'

export default function LandingPage() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [currentDate, setCurrentDate] = useState('')
  const router = useRouter()

  useEffect(() => {
    const date = new Date().toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })
    setCurrentDate(date)
  }, [])

  const handleEmployeeLogin = () => {
    router.push('/employee-login')
  }

  const handleAdminLogin = () => {
    router.push('/admin-login')
  }

  return (
    <div className="relative min-h-screen overflow-x-hidden bg-[#0c0c0c] text-white">
      {/* Background */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <div className="absolute inset-0 bg-gradient-to-b from-[#0c0c0c] via-[#0c0c0c] to-[#0a1b2e] opacity-80" />
      </div>

      {/* Navbar */}
      <nav className="relative z-20 border-b border-white/10 bg-black/40 backdrop-blur-xl">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 relative">
              <Image 
                src="/destiny-logo.png" 
                alt="Destiny Supermarket Logo" 
                width={40}
                height={40}
                className="w-full h-full object-contain"
              />
            </div>
            <div>
              <span className="text-lg font-bold tracking-tight">DESTINY</span>
              <p className="text-xs text-white/50">SUPERMARKET</p>
            </div>
          </div>



          <div className="flex items-center gap-4">
            <button
              onClick={handleEmployeeLogin}
              className="hidden sm:flex items-center gap-2 rounded-full border border-white/10 text-white text-sm font-medium px-4 py-2 hover:bg-white/5 transition"
            >
              <LogIn className="w-4 h-4" />
              Employee Login
            </button>
            <button
              onClick={handleAdminLogin}
              className="hidden sm:flex items-center gap-2 rounded-full bg-white text-black text-sm font-medium px-4 py-2 hover:bg-white/90 transition"
            >
              <Lock className="w-4 h-4" />
              Admin Access
            </button>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden w-10 h-10 rounded-full border border-white/10 bg-white/5 flex items-center justify-center"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden border-t border-white/10 bg-black/40">
            <div className="px-6 py-4 space-y-4">
              {['Features', 'Pricing', 'Solutions', 'Blog', 'Support'].map((item) => (
                <a key={item} href="#" className="block text-white/70 text-sm hover:text-white">
                  {item}
                </a>
              ))}
              <button
                onClick={handleEmployeeLogin}
                className="w-full flex items-center justify-center gap-2 rounded-lg border border-white/10 text-white text-sm font-medium px-4 py-2 hover:bg-white/5 transition"
              >
                <LogIn className="w-4 h-4" />
                Employee Login
              </button>
              <button
                onClick={handleAdminLogin}
                className="w-full flex items-center justify-center gap-2 rounded-lg bg-white text-black text-sm font-medium px-4 py-2 hover:bg-white/90 transition"
              >
                <Lock className="w-4 h-4" />
                Admin Access
              </button>
            </div>
          </div>
        )}
      </nav>

      {/* Hero Section */}
      <section className="relative z-10 pt-16 md:pt-32 pb-24 px-6 text-center flex flex-col items-center">
        {/* Eyebrow */}
        <div className="mb-6 flex items-center justify-center gap-2">
          <span className="w-1.5 h-1.5 rounded-full bg-[#A4F4FD]" />
          <span className="text-xs text-white/50 uppercase tracking-widest">POS EXCELLENCE</span>
        </div>

        {/* Main Headline */}
        <h1 className="text-4xl md:text-7xl font-bold tracking-tight leading-[0.9] mb-6 max-w-4xl">
          Destiny Supermarket{' '}
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#A4F4FD] via-[#A4F4FD] to-[#00d2ff]">
            Checkout.
          </span>
        </h1>

        {/* Subheading */}
        <p className="mt-8 text-white/60 max-w-2xl text-base md:text-lg leading-relaxed">
          The official Point of Sale system for Destiny Supermarket. Fast card processing, inventory tracking, employee management, and secure transactions—all designed specifically for Destiny Supermarket operations.
        </p>

        {/* CTA Buttons */}
        <div className="mt-10 flex flex-col sm:flex-row gap-4 justify-center items-center">
          <button
            onClick={handleEmployeeLogin}
            className="group inline-flex items-center justify-center gap-2 rounded-full bg-white text-black font-semibold text-sm px-6 py-3 hover:bg-white/90 transition-all active:scale-[0.98]"
          >
            <LogIn className="w-4 h-4" />
            Employee Access
            <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition" />
          </button>
          <button
            onClick={handleAdminLogin}
            className="inline-flex items-center justify-center gap-2 rounded-full border border-white/20 text-white font-medium text-sm px-6 py-3 hover:bg-white/5 transition"
          >
            <Lock className="w-4 h-4" />
            Admin Dashboard
          </button>
        </div>

        <p className="mt-4 text-xs text-white/40">
          Deploy on your infrastructure • Enterprise-grade security • Real-time sync
        </p>
      </section>

      {/* macOS-style Menu Bar */}
      <div
        className="relative z-10 h-10 bg-black/40 backdrop-blur-md border-y border-white/10 hidden md:flex max-w-6xl mx-auto"
        style={{ marginLeft: 'auto', marginRight: 'auto' }}
      >
        <div className="flex-1 max-w-6xl mx-auto px-6 h-full flex items-center justify-between text-xs text-white/60 w-full">
          <div className="flex items-center gap-4">
            <Package className="w-3.5 h-3.5" />
            <span className="font-bold text-white/80">DESTINY • POS</span>
            <div className="flex gap-4 ml-4">
              {['File', 'Edit', 'View', 'Go', 'Window'].map((item) => (
                <span key={item} className="hover:text-white/80 cursor-pointer">
                  {item}
                </span>
              ))}
            </div>
          </div>
          <div className="text-right">{currentDate}</div>
        </div>
      </div>

      {/* POS Dashboard Mockup */}
      <section className="relative z-10 max-w-6xl mx-auto px-6 py-16 md:py-24">
        <div className="overflow-hidden rounded-lg border border-white/20 bg-white/5 backdrop-blur-lg">
          {/* Title Bar */}
          <div className="flex items-center justify-between p-4 border-b border-white/10 bg-black/20">
            <div className="flex gap-2">
              <div className="w-3 h-3 rounded-full bg-[#ff5f57]" />
              <div className="w-3 h-3 rounded-full bg-[#febc2e]" />
              <div className="w-3 h-3 rounded-full bg-[#28c840]" />
            </div>
            <span className="text-xs text-white/50">DESTINY — Checkout</span>
          </div>

          {/* Dashboard Grid */}
          <div className="grid grid-cols-12 md:grid-cols-16 min-h-[520px] bg-black/10">
            {/* Sidebar */}
            <div className="col-span-12 md:col-span-4 border-r border-white/10 bg-black/30 p-4 space-y-4">
              <button className="w-full rounded-lg bg-white text-black text-xs font-semibold px-4 py-2.5 hover:bg-white/90 transition flex items-center justify-center gap-2">
                <Sparkles className="w-4 h-4" />
                Quick Sale
              </button>

              <nav className="space-y-2 text-xs">
                <div className="px-3 py-2 rounded-lg bg-white/10 text-white font-medium flex items-center justify-between">
                  <span>Active Sales</span>
                  <span className="bg-[#A4F4FD] text-black px-1.5 py-0.5 rounded text-[10px] font-bold">12</span>
                </div>
                {['Completed Orders', 'Pending', 'Returns', 'Reports'].map((item) => (
                  <div key={item} className="px-3 py-2 text-white/60 hover:text-white cursor-pointer transition">
                    {item}
                  </div>
                ))}
              </nav>

              <div className="border-t border-white/10 pt-4">
                <p className="text-xs text-white/50 uppercase tracking-wide font-medium mb-3">Departments</p>
                <div className="flex gap-2">
                  {['Grocery', 'Produce', 'Dairy', 'Checkout'].map((dept, i) => (
                    <div
                      key={dept}
                      className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold text-black"
                      style={{
                        backgroundColor: ['#00d2ff', '#A4F4FD', '#f59e0b', '#10b981'][i],
                      }}
                      title={dept}
                    >
                      {dept[0]}
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Active Orders List */}
            <div className="col-span-12 md:col-span-4 border-r border-white/10 bg-black/20 p-4 space-y-3 overflow-y-auto">
              <div className="flex gap-2 mb-4">
                <input
                  type="text"
                  placeholder="Search transactions..."
                  className="flex-1 bg-black/40 border border-white/10 rounded-lg px-3 py-2 text-xs text-white/70 placeholder-white/40"
                />
              </div>

              {[
                { id: '4521', customer: 'Maria Lopez', total: '$87.50', time: '2:43 PM', status: 'active' },
                { id: '4520', customer: 'John Smith', total: '$156.32', time: '2:39 PM', status: 'complete' },
                { id: '4519', customer: 'Sarah Chen', total: '$42.15', time: '2:35 PM', status: 'complete' },
              ].map((order) => (
                <div
                  key={order.id}
                  className={`p-3 rounded-lg border border-white/10 hover:bg-white/5 cursor-pointer transition ${
                    order.status === 'active' ? 'bg-white/10' : 'bg-black/30'
                  }`}
                >
                  <div className="flex justify-between items-start mb-1">
                    <span className="text-xs font-semibold text-white">#{order.id}</span>
                    <span className="text-[10px] text-white/50">{order.time}</span>
                  </div>
                  <p className="text-xs text-white/70">{order.customer}</p>
                  <p className="text-sm font-bold text-[#A4F4FD] mt-1">{order.total}</p>
                </div>
              ))}
            </div>

            {/* Detailed View */}
            <div className="col-span-12 md:col-span-8 bg-black/20 p-6 space-y-4">
              <div className="flex gap-2 items-center justify-between">
                <div>
                  <p className="text-sm font-semibold text-white">Transaction #4521</p>
                  <p className="text-xs text-white/50">Maria Lopez • 2:43 PM</p>
                </div>
                <span className="text-xs bg-[#A4F4FD]/20 text-[#A4F4FD] px-3 py-1 rounded-full font-medium">
                  Active
                </span>
              </div>

              <div className="border-t border-white/10 pt-4 space-y-3">
                <div className="bg-black/40 border border-white/10 rounded-lg p-3 flex gap-3">
                  <Sparkles className="w-4 h-4 text-[#A4F4FD] flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="text-xs font-semibold text-white">Smart Features Active</p>
                    <p className="text-xs text-white/60 mt-1">
                      Customer identified • Loyalty applied • No discounts pending
                    </p>
                  </div>
                </div>

                <div className="space-y-2">
                  {[
                    { item: 'Organic Milk (2L)', qty: 2, price: '$6.99 each' },
                    { item: 'Fresh Bread', qty: 1, price: '$3.50' },
                    { item: 'Vegetables Mix', qty: 3, price: '$4.99 each' },
                  ].map((product, i) => (
                    <div key={i} className="flex justify-between text-xs text-white/80">
                      <span>
                        {product.item} × {product.qty}
                      </span>
                      <span>{product.price}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="border-t border-white/10 pt-4 space-y-2 text-xs">
                <div className="flex justify-between">
                  <span className="text-white/60">Subtotal</span>
                  <span className="text-white/80">$78.95</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-white/60">Tax</span>
                  <span className="text-white/80">$8.55</span>
                </div>
                <div className="flex justify-between text-base font-bold text-[#A4F4FD] pt-2 border-t border-white/10">
                  <span>Total</span>
                  <span>$87.50</span>
                </div>
              </div>

              <button className="w-full bg-white text-black font-semibold rounded-lg py-2 text-sm hover:bg-white/90 transition mt-4">
                Complete Sale
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="relative z-10 max-w-6xl mx-auto px-6 py-20 md:py-28">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          {/* Left Column */}
          <div>
            <div className="flex items-center gap-2 mb-6">
              <span className="w-1.5 h-1.5 rounded-full bg-[#A4F4FD]" />
              <span className="text-xs text-white/50 uppercase tracking-widest">FEATURES</span>
            </div>
            <h2 className="text-3xl md:text-5xl font-bold tracking-tight leading-[1.02] mb-6">
              Enterprise checkout. <br /> Simplified operations.
            </h2>
            <p className="text-white/60 text-base leading-[1.6] max-w-md mb-6">
              DESTINY brings together inventory management, POS checkout, employee workflows, and real-time analytics.
              One platform. Complete control.
            </p>

            <div className="flex flex-wrap gap-2 mb-8">
              {['Real-time Sync', 'Inventory Tracking', 'Team Management', 'Advanced Analytics'].map((chip) => (
                <span
                  key={chip}
                  className="text-xs text-white/70 px-3 py-1.5 rounded-full border border-white/10 bg-white/[0.03]"
                >
                  {chip}
                </span>
              ))}
            </div>
          </div>

          {/* Right Column - Feature Cards */}
          <div className="space-y-4">
            {[
              { icon: TrendingUp, title: 'Real-Time Analytics', desc: 'Track sales, inventory, and performance instantly' },
              { icon: Users, title: 'Team Management', desc: 'Manage staff, schedules, and performance metrics' },
              { icon: BarChart3, title: 'Advanced Reporting', desc: 'Deep insights into sales patterns and trends' },
            ].map((feature, i) => (
              <div key={i} className="flex gap-4">
                <div className="flex-shrink-0">
                  <div className="w-10 h-10 rounded-lg bg-[#A4F4FD]/10 border border-[#A4F4FD]/20 flex items-center justify-center">
                    <feature.icon className="w-5 h-5 text-[#A4F4FD]" />
                  </div>
                </div>
                <div>
                  <h3 className="text-sm font-semibold text-white">{feature.title}</h3>
                  <p className="text-xs text-white/60 mt-1">{feature.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>



      {/* CTA Footer */}
      <section className="relative z-10 max-w-6xl mx-auto px-6 py-20 text-center">
        <h2 className="text-3xl md:text-5xl font-bold mb-6">Get Started with Destiny Supermarket POS</h2>
        <p className="text-white/60 max-w-2xl mx-auto mb-8 text-base">
          Access the official POS system for Destiny Supermarket. Fast checkout, secure card processing, and complete inventory management.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <button
            onClick={handleEmployeeLogin}
            className="inline-flex items-center justify-center gap-2 rounded-full bg-white text-black font-semibold px-6 py-3 hover:bg-white/90 transition"
          >
            <LogIn className="w-4 h-4" />
            Get Started
          </button>
          <button className="inline-flex items-center justify-center gap-2 rounded-full border border-white/20 text-white font-medium px-6 py-3 hover:bg-white/5 transition">
            Learn More
          </button>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative z-10 border-t border-white/10 bg-black/40 backdrop-blur-xl">
        <div className="max-w-6xl mx-auto px-6 py-12">
          <div className="grid md:grid-cols-3 gap-8 mb-8">
            <div>
              <div className="flex items-center gap-2 mb-4">
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
                  <span className="font-bold block">DESTINY</span>
                  <span className="text-xs text-white/50">SUPERMARKET</span>
                </div>
              </div>
              <p className="text-xs text-white/60">Official POS System for Destiny Supermarket</p>
            </div>
            <div>
              <h4 className="text-sm font-semibold mb-4">Support</h4>
              <ul className="space-y-2 text-xs text-white/60">
                <li><a href="#" className="hover:text-white">Help Center</a></li>
                <li><a href="#" className="hover:text-white">Contact Us</a></li>
                <li><a href="#" className="hover:text-white">Documentation</a></li>
              </ul>
            </div>
            <div>
              <h4 className="text-sm font-semibold mb-4">Legal</h4>
              <ul className="space-y-2 text-xs text-white/60">
                <li><a href="#" className="hover:text-white">Privacy Policy</a></li>
                <li><a href="#" className="hover:text-white">Terms of Service</a></li>
                <li><a href="#" className="hover:text-white">Security</a></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-white/10 pt-8 flex justify-between items-center text-xs text-white/60">
            <span>© 2024 Destiny Supermarket. All rights reserved.</span>
            <span>Secure POS System</span>
          </div>
        </div>
      </footer>
    </div>
  )
}
