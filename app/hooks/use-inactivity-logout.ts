'use client'

import { useEffect, useRef, useCallback, useState } from 'react'
import { useRouter } from 'next/navigation'

export function useInactivityLogout(onLogout: () => void, timeoutMinutes: number = 10) {
  const router = useRouter()
  const timeoutRef = useRef<NodeJS.Timeout | null>(null)
  const warningTimeoutRef = useRef<NodeJS.Timeout | null>(null)
  const [showWarning, setShowWarning] = useState(false)
  const [countdown, setCountdown] = useState(60) // seconds until logout
  const countdownRef = useRef(countdown)

  const resetTimer = useCallback(() => {
    // Clear existing timers
    if (timeoutRef.current) clearTimeout(timeoutRef.current)
    if (warningTimeoutRef.current) clearTimeout(warningTimeoutRef.current)
    setShowWarning(false)
    setCountdown(60)

    // Set new timers
    // Warning shows after (timeoutMinutes - 1) minutes
    const warningDelay = (timeoutMinutes - 1) * 60 * 1000
    warningTimeoutRef.current = setTimeout(() => {
      setShowWarning(true)
      countdownRef.current = 60
      setCountdown(60)

      // Start countdown
      const countdownInterval = setInterval(() => {
        setCountdown((prev) => {
          if (prev <= 1) {
            clearInterval(countdownInterval)
            return 0
          }
          return prev - 1
        })
      }, 1000)
    }, warningDelay)

    // Logout after timeoutMinutes
    const logoutDelay = timeoutMinutes * 60 * 1000
    timeoutRef.current = setTimeout(() => {
      setShowWarning(false)
      onLogout()
    }, logoutDelay)
  }, [timeoutMinutes, onLogout])

  const dismissWarning = useCallback(() => {
    setShowWarning(false)
    resetTimer()
  }, [resetTimer])

  useEffect(() => {
    resetTimer()

    const events = ['mousedown', 'keydown', 'scroll', 'touchstart', 'click']

    const handleActivity = () => {
      // Only reset if warning is not showing
      if (!showWarning) {
        resetTimer()
      }
    }

    events.forEach((event) => {
      document.addEventListener(event, handleActivity)
    })

    return () => {
      events.forEach((event) => {
        document.removeEventListener(event, handleActivity)
      })
      if (timeoutRef.current) clearTimeout(timeoutRef.current)
      if (warningTimeoutRef.current) clearTimeout(warningTimeoutRef.current)
    }
  }, [resetTimer, showWarning])

  return { showWarning, countdown, dismissWarning }
}
