'use client'

import { useEffect, ReactNode } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/app/context/auth-context'
import { AlertCircle, Home } from 'lucide-react'
import { Button } from '@/components/ui/button'

interface AdminRouteGuardProps {
  children: ReactNode
}

export function AdminRouteGuard({ children }: AdminRouteGuardProps) {
  const { user, isLoading, userRole } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!isLoading && (!user || userRole !== 'admin')) {
      // Redirect to appropriate login page
      if (!user) {
        router.push('/admin-login')
      } else {
        // User is logged in but doesn't have admin role
        router.push('/unauthorized')
      }
    }
  }, [user, isLoading, userRole, router])

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    )
  }

  if (!user || userRole !== 'admin') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800 flex items-center justify-center p-4">
        <div className="w-full max-w-md">
          <div className="bg-slate-800/50 border border-slate-700 rounded-lg p-8 backdrop-blur-md">
            <div className="p-6 bg-red-500/10 border border-red-500/20 rounded-lg text-center">
              <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
              <h2 className="text-red-400 font-semibold mb-2">Access Denied</h2>
              <p className="text-red-300 text-sm mb-6">
                You do not have permission to access this page. Only administrators can access the admin dashboard.
              </p>
              <Button
                onClick={() => router.push('/admin-login')}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white gap-2"
              >
                <Home className="w-4 h-4" />
                Go to Admin Login
              </Button>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return <>{children}</>
}
