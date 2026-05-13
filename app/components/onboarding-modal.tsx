'use client'

import { useState, useEffect } from 'react'
import { ChevronRight, X, CheckCircle } from 'lucide-react'
import { Button } from '@/components/ui/button'

interface OnboardingStep {
  id: number
  title: string
  description: string
  icon: React.ReactNode
}

const steps: OnboardingStep[] = [
  {
    id: 1,
    title: 'Welcome to DESTINY POS',
    description: 'Your complete point-of-sale system for fast, efficient checkout. Let\u0027s get you started.',
    icon: '🛒',
  },
  {
    id: 2,
    title: 'Search Products',
    description: 'Use the search bar to find products quickly by name or barcode. Products will appear instantly as you type.',
    icon: '🔍',
  },
  {
    id: 3,
    title: 'Add to Cart',
    description: 'Click on any product to add it to your cart. You can adjust quantities and remove items as needed.',
    icon: '✨',
  },
  {
    id: 4,
    title: 'Checkout & Payment',
    description: 'Review your cart, apply discounts if available, and proceed to secure payment processing.',
    icon: '💳',
  },
  {
    id: 5,
    title: 'Complete Sale',
    description: 'Transaction completed! Print receipts, view history, and start your next sale.',
    icon: '✅',
  },
]

export function OnboardingModal() {
  const [currentStep, setCurrentStep] = useState(0)
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    // Check if user has seen onboarding
    const hasSeenOnboarding = localStorage.getItem('destiny_onboarding_completed')
    if (!hasSeenOnboarding) {
      setIsVisible(true)
    }
  }, [])

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1)
    } else {
      handleComplete()
    }
  }

  const handleComplete = () => {
    localStorage.setItem('destiny_onboarding_completed', 'true')
    setIsVisible(false)
  }

  if (!isVisible) return null

  const step = steps[currentStep]
  const progress = ((currentStep + 1) / steps.length) * 100

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div className="relative w-full max-w-2xl mx-4 overflow-hidden rounded-2xl">
        {/* Gradient background */}
        <div className="absolute inset-0 bg-gradient-to-br from-[#0B2551] via-[#0d3a7a] to-[#051835]" />

        {/* Content */}
        <div className="relative p-8 md:p-12">
          {/* Close button */}
          <button
            onClick={() => setIsVisible(false)}
            className="absolute top-6 right-6 text-white/60 hover:text-white transition-colors"
          >
            <X className="h-6 w-6" />
          </button>

          {/* Progress bar */}
          <div className="mb-8">
            <div className="flex justify-between items-center mb-3">
              <span className="text-sm font-medium text-cyan-400">Step {currentStep + 1} of {steps.length}</span>
              <span className="text-sm text-white/60">{Math.round(progress)}%</span>
            </div>
            <div className="h-1.5 bg-white/10 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-cyan-400 to-blue-500 transition-all duration-500"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>

          {/* Step content */}
          <div className="text-center mb-12">
            <div className="text-6xl mb-6 inline-block animate-bounce">{step.icon}</div>
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">{step.title}</h2>
            <p className="text-lg text-white/80 max-w-lg mx-auto leading-relaxed">{step.description}</p>
          </div>

          {/* Step indicators */}
          <div className="flex justify-center gap-2 mb-10">
            {steps.map((_, idx) => (
              <button
                key={idx}
                onClick={() => setCurrentStep(idx)}
                className={`h-2 rounded-full transition-all duration-300 ${
                  idx === currentStep
                    ? 'bg-cyan-400 w-8'
                    : idx < currentStep
                      ? 'bg-cyan-400/60 w-2'
                      : 'bg-white/20 w-2'
                }`}
              />
            ))}
          </div>

          {/* Buttons */}
          <div className="flex gap-4 justify-center">
            {currentStep > 0 && (
              <Button
                onClick={() => setCurrentStep(currentStep - 1)}
                variant="outline"
                className="border-white/30 text-white hover:bg-white/10"
              >
                Back
              </Button>
            )}
            <Button
              onClick={handleNext}
              className="bg-gradient-to-r from-cyan-400 to-blue-500 text-white border-0 hover:shadow-lg hover:shadow-cyan-400/50 transition-all"
            >
              {currentStep === steps.length - 1 ? (
                <>
                  <CheckCircle className="h-4 w-4 mr-2" />
                  Get Started
                </>
              ) : (
                <>
                  Next
                  <ChevronRight className="h-4 w-4 ml-2" />
                </>
              )}
            </Button>
          </div>

          {/* Skip button */}
          <button
            onClick={() => setIsVisible(false)}
            className="w-full mt-6 py-2 text-white/60 hover:text-white transition-colors text-sm"
          >
            Skip Tutorial
          </button>
        </div>
      </div>
    </div>
  )
}
