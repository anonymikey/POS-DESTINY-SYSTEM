'use client'

import { ReactNode } from 'react'

interface TourTooltipProps {
  children: ReactNode
  title: string
  description: string
  position?: 'top' | 'bottom' | 'left' | 'right'
  isActive?: boolean
}

export function TourTooltip({
  children,
  title,
  description,
  position = 'bottom',
  isActive = false,
}: TourTooltipProps) {
  if (!isActive) return children

  const positionClasses = {
    top: 'bottom-full mb-4',
    bottom: 'top-full mt-4',
    left: 'right-full mr-4',
    right: 'left-full ml-4',
  }

  return (
    <div className="relative inline-block">
      {children}

      {isActive && (
        <>
          {/* Highlight ring */}
          <div className="absolute inset-0 rounded-lg ring-2 ring-cyan-400 ring-opacity-50 shadow-lg shadow-cyan-400/30 animate-pulse" />

          {/* Tooltip */}
          <div className={`absolute ${positionClasses[position]} z-50 w-64`}>
            <div className="bg-gradient-to-br from-cyan-400 to-blue-500 rounded-lg p-4 text-white shadow-xl">
              <h3 className="font-bold text-sm mb-2">{title}</h3>
              <p className="text-xs opacity-90">{description}</p>

              {/* Arrow */}
              <div
                className={`absolute w-3 h-3 bg-gradient-to-br from-cyan-400 to-blue-500 transform rotate-45 ${
                  position === 'bottom'
                    ? '-top-1.5 left-1/2 -translate-x-1/2'
                    : position === 'top'
                      ? '-bottom-1.5 left-1/2 -translate-x-1/2'
                      : position === 'right'
                        ? '-left-1.5 top-1/2 -translate-y-1/2'
                        : '-right-1.5 top-1/2 -translate-y-1/2'
                }`}
              />
            </div>
          </div>
        </>
      )}
    </div>
  )
}
