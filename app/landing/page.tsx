'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { m } from 'motion/react'
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
  LogIn,
  Download
} from 'lucide-react'
import { Button } from '@/components/ui/button'

const AnimatedShinyText = ({ children }: { children: React.ReactNode }) => (
  <span
    className="animate-shiny bg-gradient-to-r from-[#091020] via-[#A4F4FD] to-[#091020] bg-[200%] bg-clip-text text-transparent"
    style={{
      backgroundSize: '200% auto',
      WebkitBackgroundClip: 'text',
      WebkitTextFillColor: 'transparent',
    }}
  >
    {children}
  </span>
)

const LiquidGlassCard = ({ children, className = '' }: { children: React.ReactNode; className?: string }) => (
  <div
    className={`liquid-glass rounded-2xl border border-white/10 backdrop-blur-xl ${className}`}
    style={{
      background: 'rgba(255,255,255,0.01)',
      backdropFilter: 'blur(4px)',
      boxShadow: 'inset 0 1px 1px rgba(255,255,255,0.1)',
    }}
  >
    {children}
  </div>
)

export default function LandingPage() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [userType, setUserType] = useState<'employee' | 'admin' | null>(null)
  const [currentDate, setCurrentDate] = useState<string>('')
  const router = useRouter()

  useEffect(() => {
    setCurrentDate(new Date().toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' }))
  }, [])

  const handleEmployeeLogin = () => {
    localStorage.setItem('pos_employee_access', 'true')
    router.push('/')
  }

  const handleAdminLogin = () => {
    localStorage.setItem('pos_admin_access', 'true')
    router.push('/admin')
  }

  return (
    <div className="relative min-h-screen overflow-x-hidden bg-[#0c0c0c] text-white">
      {/* Background Video */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <div className="absolute inset-0 bg-gradient-to-b from-[#0c0c0c] via-[#0c0c0c] to-[#0a1b2e] opacity-80" />
      </div>

      {/* Noise Filter SVG */}
      <svg className="absolute w-0 h-0">
        <filter id="destiny-noise">
          <feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="2" stitchTiles="stitch" />
          <feColorMatrix type="matrix" values="0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 0.35 0" />
          <feComposite in2="SourceGraphic" operator="in" result="noise" />
          <feBlend in="SourceGraphic" in2="noise" mode="multiply" />
        </filter>
      </svg>

      {/* Navbar */}
      <m.nav
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: 'easeOut' }}
        className="relative z-20 border-b border-white/10 bg-black/40 backdrop-blur-xl"
      >
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#00d2ff] to-[#0B2551] flex items-center justify-center">
              <Package className="w-5 h-5 text-white" />
            </div>
            <span className="text-lg font-bold tracking-tight">DESTINY</span>
          </div>

          {/* Desktop Menu */}
          <div className="hidden md:flex gap-8 items-center">
            {['Features', 'Pricing', 'Solutions', 'Blog', 'Support'].map((item, i) => (
              <m.div key={item} initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 + i * 0.05 }}>
                <a href="#" className="text-white/70 text-sm font-medium hover:text-white transition">
                  {item}
                </a>
              </m.div>
            ))}
          </div>

          <div className="flex items-center gap-4">
            {!userType && (
              <>
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
              </>
            )}

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
          <m.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden border-t border-white/10 bg-black/40"
          >
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
          </m.div>
        )}
      </m.nav>

      {/* Hero Section */}
      <m.section
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
        className="relative z-10 pt-16 md:pt-32 pb-24 px-6 text-center flex flex-col items-center"
      >
        {/* Eyebrow */}
        <m.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mb-6 flex items-center justify-center gap-2"
        >
          <span className="w-1.5 h-1.5 rounded-full bg-[#A4F4FD]" />
          <span className="text-xs text-white/50 uppercase tracking-widest">POS EXCELLENCE</span>
        </m.div>

        {/* Main Headline */}
        <m.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.8, ease: 'cubic-bezier(.22,1,.36,1)' }}
          className="text-4xl md:text-7xl font-bold tracking-tight leading-[0.9] mb-6 max-w-4xl"
        >
          Your supermarket.{' '}
          <AnimatedShinyText>
            Unified.
          </AnimatedShinyText>
        </m.h1>

        {/* Subheading */}
        <m.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.8 }}
          className="mt-8 text-white/60 max-w-2xl text-base md:text-lg leading-relaxed"
        >
          DESTINY transforms your supermarket operations into a seamless ecosystem. Real-time inventory, lightning-fast checkout, complete employee management, and powerful analytics—all in one unified platform.
        </m.p>

        {/* CTA Buttons */}
        <m.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7, duration: 0.8 }}
          className="mt-10 flex flex-col sm:flex-row gap-4 justify-center items-center"
        >
          <button
            onClick={() => setUserType('employee')}
            className="group inline-flex items-center justify-center gap-2 rounded-full bg-white text-black font-semibold text-sm px-6 py-3 hover:bg-white/90 transition-all active:scale-[0.98]"
          >
            <LogIn className="w-4 h-4" />
            Employee Access
            <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition" />
          </button>
          <button
            onClick={() => setUserType('admin')}
            className="inline-flex items-center justify-center gap-2 rounded-full border border-white/20 text-white font-medium text-sm px-6 py-3 hover:bg-white/5 transition"
          >
            <Lock className="w-4 h-4" />
            Admin Dashboard
          </button>
        </m.div>

        <m.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.9 }}
          className="mt-4 text-xs text-white/40"
        >
          Deploy on your infrastructure • Enterprise-grade security • Real-time sync
        </m.p>
      </m.section>

      {/* macOS-style Menu Bar */}
      <m.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.9 }}
        className="relative z-10 h-10 bg-black/40 backdrop-blur-md border-y border-white/10 hidden md:flex max-w-6xl mx-auto"
        style={{ marginLeft: 'auto', marginRight: 'auto' }}
      >
        <div className="flex-1 max-w-6xl mx-auto px-6 h-full flex items-center justify-between text-xs text-white/60 mx-auto w-full">
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
          <div className="text-right">
            {currentDate || 'Loading...'}
          </div>
        </div>
      </m.div>

      {/* POS Dashboard Mockup */}
      <m.section
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.1, duration: 0.8 }}
        className="relative z-10 max-w-6xl mx-auto px-6 py-16 md:py-24"
      >
        <LiquidGlassCard className="overflow-hidden">
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
                  className={`p-3 rounded-lg border border-white/10 hover:bg-white/5 cursor-pointer transition ${order.status === 'active' ? 'bg-white/10' : 'bg-black/30'
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
                <span className="text-xs bg-[#A4F4FD]/20 text-[#A4F4FD] px-3 py-1 rounded-full font-medium">Active</span>
              </div>

              <div className="border-t border-white/10 pt-4 space-y-3">
                <div className="bg-black/40 border border-white/10 rounded-lg p-3 flex gap-3">
                  <Sparkles className="w-4 h-4 text-[#A4F4FD] flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="text-xs font-semibold text-white">Smart Features Active</p>
                    <p className="text-xs text-white/60 mt-1">Customer identified • Loyalty applied • No discounts pending</p>
                  </div>
                </div>

                <div className="space-y-2">
                  {[
                    { item: 'Organic Milk (2L)', qty: 2, price: '$6.99 each' },
                    { item: 'Fresh Bread', qty: 1, price: '$3.50' },
                    { item: 'Vegetables Mix', qty: 3, price: '$4.99 each' },
                  ].map((product, i) => (
                    <div key={i} className="flex justify-between text-xs text-white/80">
                      <span>{product.item} × {product.qty}</span>
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
        </LiquidGlassCard>
      </m.section>

      {/* Features Section */}
      <m.section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.3 }}
        className="relative z-10 max-w-6xl mx-auto px-6 py-20 md:py-28"
      >
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
              DESTINY brings together inventory management, POS checkout, employee workflows, and real-time analytics. One platform. Complete control.
            </p>

            <div className="flex flex-wrap gap-2 mb-8">
              {['Real-time Sync', 'Inventory Tracking', 'Team Management', 'Advanced Analytics'].map((chip) => (
                <span key={chip} className="text-xs text-white/70 px-3 py-1.5 rounded-full border border-white/10 bg-white/[0.03]">
                  {chip}
                </span>
              ))}
            </div>
          </div>

          {/* Right Column - Feature Cards */}
          <div className="space-y-4">
            {[
              { title: 'Smart Checkout', desc: 'Lightning-fast transactions with barcode scanning', icon: TrendingUp },
              { title: 'Team Coordination', desc: 'Manage staff schedules and performance', icon: Users },
              { title: 'Inventory Control', desc: 'Real-time stock tracking and alerts', icon: Package },
              { title: 'Powerful Analytics', desc: 'Deep insights into sales and customer behavior', icon: BarChart3 },
            ].map(({ title, desc, icon: Icon }) => (
              <LiquidGlassCard key={title} className="p-4">
                <div className="flex gap-3">
                  <Icon className="w-5 h-5 text-[#A4F4FD] flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="font-semibold text-sm text-white">{title}</p>
                    <p className="text-xs text-white/60 mt-1">{desc}</p>
                  </div>
                </div>
              </LiquidGlassCard>
            ))}
          </div>
        </div>
      </m.section>

      {/* Login Section */}
      {userType && (
        <m.section
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="relative z-20 fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4"
        >
          <m.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.3 }}
            className="bg-[#0a0a0a] border border-white/10 rounded-2xl p-8 max-w-md w-full"
          >
            <button
              onClick={() => setUserType(null)}
              className="absolute top-4 right-4 text-white/50 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="mb-8 text-center">
              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[#00d2ff] to-[#0B2551] flex items-center justify-center mx-auto mb-4">
                {userType === 'employee' ? (
                  <LogIn className="w-6 h-6 text-white" />
                ) : (
                  <Lock className="w-6 h-6 text-white" />
                )}
              </div>
              <h3 className="text-2xl font-bold text-white mb-2">
                {userType === 'employee' ? 'Employee Login' : 'Admin Access'}
              </h3>
              <p className="text-white/60 text-sm">
                {userType === 'employee'
                  ? 'Access the POS checkout and sales system'
                  : 'Manage inventory, staff, and analytics'}
              </p>
            </div>

            <form className="space-y-4" onSubmit={(e) => {
              e.preventDefault()
              if (userType === 'employee') {
                localStorage.setItem('pos_employee_access', 'true')
                router.push('/')
              } else {
                localStorage.setItem('pos_admin_access', 'true')
                router.push('/admin')
              }
            }}>
              <input
                type="email"
                placeholder="Email address"
                className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2.5 text-white placeholder-white/40 text-sm"
              />
              <input
                type="password"
                placeholder="Password"
                className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2.5 text-white placeholder-white/40 text-sm"
              />

              <button
                type="submit"
                className="w-full bg-white text-black font-semibold rounded-lg py-2.5 hover:bg-white/90 transition mt-6"
              >
                {userType === 'employee' ? 'Enter POS' : 'Admin Dashboard'}
              </button>
            </form>

            <p className="text-xs text-white/50 text-center mt-6">
              Demo credentials • Use any email + password
            </p>
          </m.div>
        </m.section>
      )}

      {/* Final CTA */}
      <m.section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.5 }}
        className="relative z-10 max-w-6xl mx-auto px-6 py-20 md:py-32"
      >
        <LiquidGlassCard className="relative overflow-hidden rounded-3xl px-8 py-16 md:py-24 text-center">
          <div
            className="absolute inset-0 opacity-20"
            style={{
              background: 'radial-gradient(600px circle at 50% 0%, rgba(255,255,255,0.15), transparent 70%)',
            }}
          />

          <div className="relative z-10">
            <h2 className="text-4xl md:text-6xl font-bold tracking-tight leading-[1.02] mb-6">
              Streamline operations. <br /> Boost revenue.
            </h2>
            <p className="mt-6 text-white/60 max-w-md mx-auto text-sm leading-[1.6]">
              Join supermarkets worldwide using DESTINY to modernize their checkout experience and gain real-time insights into every sale.
            </p>

            <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center items-center">
              <button
                onClick={handleEmployeeLogin}
                className="group inline-flex items-center justify-center gap-2 rounded-full bg-white text-black font-semibold text-sm px-6 py-3 hover:bg-white/90 transition-all active:scale-[0.98]"
              >
                <LogIn className="w-4 h-4" />
                Try Employee Mode
                <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition" />
              </button>
              <button
                onClick={handleAdminLogin}
                className="inline-flex items-center justify-center gap-2 rounded-full border border-white/15 text-white text-sm font-medium px-6 py-3 hover:bg-white/5 transition"
              >
                <Lock className="w-4 h-4" />
                Admin Dashboard
              </button>
            </div>
          </div>
        </LiquidGlassCard>
      </m.section>

      {/* Footer */}
      <m.footer
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.7 }}
        className="relative z-10 max-w-6xl mx-auto px-6 py-12 border-t border-white/10 text-center text-xs text-white/50"
      >
        <p>DESTINY Supermarket POS System • Enterprise-Grade Point of Sale</p>
        <p className="mt-2">Secure • Scalable • Supermarket-Built</p>
      </m.footer>
    </div>
  )
}
