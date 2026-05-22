'use client'

import { useRouter } from 'next/navigation'
import { AlertCircle, Home, LogOut } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useAuth } from '@/app/context/auth-context'

export default function UnauthorizedPage() {
  const router = useRouter()
  const { logout, userRole } = useAuth()

  const handleLogout = async () => {
    await logout()
    router.push('/landing')
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="bg-slate-800/50 border border-slate-700 rounded-lg p-8 backdrop-blur-md">
          <div className="p-6 bg-red-500/10 border border-red-500/20 rounded-lg text-center">
            <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
            <h2 className="text-red-400 font-semibold mb-2 text-lg">Access Denied</h2>
            <p className="text-red-300 text-sm mb-6">
              {userRole === 'employee' 
                ? 'You are logged in as an employee. The admin dashboard is restricted to administrators only.'
                : 'You do not have permission to access this page. Only administrators can access the admin dashboard.'}
            </p>
            
            <div className="space-y-4">
              {userRole === 'employee' && (
                <div className="bg-slate-700/50 p-4 rounded-lg text-left">
                  <p className="text-slate-300 text-sm font-medium mb-2">What you can do:</p>
                  <ul className="text-slate-400 text-xs space-y-2">
                    <li>• Access the POS system to process sales</li>
                    <li>• View your transaction history</li>
                    <li>• Manage customer information</li>
                    <li>• Generate receipts</li>
                  </ul>
                </div>
              )}
              
              <Button
                onClick={() => router.push('/')}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white gap-2"
              >
                <Home className="w-4 h-4" />
                Go to POS Dashboard
              </Button>
              
              <Button
                onClick={handleLogout}
                variant="outline"
                className="w-full border-slate-600 text-slate-300 hover:bg-slate-700/50 gap-2"
              >
                <LogOut className="w-4 h-4" />
                Logout
              </Button>
            </div>
          </div>
        </div>

        <div className="mt-6 p-4 bg-slate-700/30 border border-slate-600 rounded-lg">
          <p className="text-slate-400 text-xs text-center">
            This page is restricted to administrators. If you believe you should have access, contact your administrator.
          </p>
        </div>
      </div>
    </div>
  )
}
