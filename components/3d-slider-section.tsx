'use client'

import { useState, useRef, useEffect } from 'react'
import { Scene3D } from './3d-scene'
import { TrendingUp, Zap, Users, BarChart3, Lock } from 'lucide-react'

interface CardData {
  id: number
  title: string
  description: string
  icon: string
}

const CARDS: CardData[] = [
  {
    id: 1,
    title: 'Real-Time Inventory',
    description: 'Track stock levels instantly across all departments',
    icon: 'package',
  },
  {
    id: 2,
    title: 'Lightning Checkout',
    description: 'Process transactions 10x faster with smart scanning',
    icon: 'zap',
  },
  {
    id: 3,
    title: 'Employee Management',
    description: 'Schedule shifts, track performance, manage payroll',
    icon: 'users',
  },
  {
    id: 4,
    title: 'Advanced Analytics',
    description: 'Deep insights into sales patterns and customer behavior',
    icon: 'chart',
  },
  {
    id: 5,
    title: 'Enterprise Security',
    description: 'Military-grade encryption and compliance protection',
    icon: 'lock',
  },
]

const getIconComponent = (iconName: string) => {
  const iconMap: Record<string, React.ReactNode> = {
    package: <TrendingUp className="w-6 h-6" />,
    zap: <Zap className="w-6 h-6" />,
    users: <Users className="w-6 h-6" />,
    chart: <BarChart3 className="w-6 h-6" />,
    lock: <Lock className="w-6 h-6" />,
  }
  return iconMap[iconName] || <TrendingUp className="w-6 h-6" />
}

export function Slider3D() {
  const [scrollProgress, setScrollProgress] = useState(0)
  const sectionRef = useRef<HTMLDivElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleScroll = () => {
      if (!sectionRef.current) return

      const sectionTop = sectionRef.current.offsetTop
      const sectionHeight = sectionRef.current.offsetHeight
      const windowHeight = window.innerHeight

      // Calculate where the section is relative to viewport
      const scrollPosition = window.scrollY
      const sectionViewTop = sectionTop - scrollPosition

      // Calculate progress: 0 when section enters, 1 when it exits
      const progress = Math.max(
        0,
        Math.min(
          1,
          1 - (sectionViewTop + sectionHeight / 2) / (windowHeight / 2),
        ),
      )

      setScrollProgress(progress)
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <section
      ref={sectionRef}
      className="relative z-10 min-h-screen flex items-center justify-center py-20 md:py-28"
    >
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#00d2ff]/5 to-transparent pointer-events-none" />

      <div className="relative max-w-6xl mx-auto w-full px-6">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="flex items-center justify-center gap-2 mb-6">
            <span className="w-1.5 h-1.5 rounded-full bg-[#A4F4FD]" />
            <span className="text-xs text-white/50 uppercase tracking-widest">
              INTERACTIVE FEATURES
            </span>
          </div>
          <h2 className="text-3xl md:text-5xl font-bold tracking-tight leading-[1.02] mb-6 text-balance">
            Experience DESTINY&apos;s Power in 3D
          </h2>
          <p className="text-white/60 text-base leading-[1.6] max-w-2xl mx-auto">
            Scroll through our interactive 3D showcase to see how each feature transforms your retail operations.
          </p>
        </div>

        {/* 3D Canvas Container */}
        <div className="relative h-[500px] md:h-[600px] rounded-2xl border border-white/10 overflow-hidden bg-gradient-to-b from-[#0a2e4a]/40 to-[#0c0c0c]/80 backdrop-blur-sm">
          <Scene3D scrollProgress={scrollProgress} cards={CARDS} />

          {/* Progress indicator */}
          <div className="absolute bottom-6 left-6 text-xs text-white/60 z-20">
            <div className="mb-2">Scroll Progress</div>
            <div className="w-32 h-1 bg-white/10 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-[#A4F4FD] to-[#00d2ff] transition-all duration-300"
                style={{ width: `${scrollProgress * 100}%` }}
              />
            </div>
          </div>

          {/* Card info display */}
          <div className="absolute top-6 right-6 z-20">
            <div className="rounded-xl border border-white/10 bg-black/40 backdrop-blur-md p-4 max-w-xs">
              <div className="text-xs text-white/50 mb-2">FEATURED</div>
              <div className="flex gap-3">
                <div className="flex-shrink-0 w-10 h-10 rounded-lg bg-[#A4F4FD]/10 border border-[#A4F4FD]/20 flex items-center justify-center text-[#A4F4FD]">
                  {getIconComponent(CARDS[Math.floor(scrollProgress * CARDS.length)].icon)}
                </div>
                <div className="flex-1">
                  <h3 className="text-sm font-semibold text-white">
                    {CARDS[Math.floor(scrollProgress * CARDS.length)].title}
                  </h3>
                  <p className="text-xs text-white/60 mt-1">
                    {CARDS[Math.floor(scrollProgress * CARDS.length)].description}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Cards Grid Info */}
        <div className="mt-16">
          <div className="grid md:grid-cols-2 lg:grid-cols-5 gap-4">
            {CARDS.map((card, index) => (
              <div
                key={card.id}
                className={`p-4 rounded-xl border transition-all duration-300 ${
                  Math.floor(scrollProgress * CARDS.length) === index
                    ? 'border-[#A4F4FD] bg-[#A4F4FD]/10'
                    : 'border-white/10 bg-white/5'
                }`}
              >
                <div className="w-8 h-8 rounded-lg bg-[#A4F4FD]/10 border border-[#A4F4FD]/20 flex items-center justify-center text-[#A4F4FD] mb-3">
                  {getIconComponent(card.icon)}
                </div>
                <h3 className="text-sm font-semibold text-white mb-2">{card.title}</h3>
                <p className="text-xs text-white/60">{card.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
