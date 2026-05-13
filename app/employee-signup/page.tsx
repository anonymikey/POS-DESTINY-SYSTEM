'use client'

import { useRouter } from 'next/navigation'
import { AlertCircle, Home } from 'lucide-react'
import { Button } from '@/components/ui/button'

export default function EmployeeSignupPage() {
  const router = useRouter()

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-white mb-2">DESTINY</h1>
          <p className="text-slate-400">Employee Registration</p>
        </div>

        {/* Blocked Message */}
        <div className="bg-slate-800/50 border border-slate-700 rounded-lg p-8 backdrop-blur-md">
          <div className="p-6 bg-orange-500/10 border border-orange-500/20 rounded-lg text-center">
            <AlertCircle className="w-12 h-12 text-orange-500 mx-auto mb-4" />
            <h2 className="text-orange-400 font-semibold mb-2">Employee Sign-ups Disabled</h2>
            <p className="text-orange-300 text-sm mb-6">
              For data protection and security, employees cannot self-register. Your administrator creates all employee accounts.
            </p>
            <div className="space-y-4">
              <div className="bg-slate-700/50 p-4 rounded-lg text-left">
                <p className="text-slate-300 text-sm font-medium mb-2">What to do:</p>
                <ul className="text-slate-400 text-xs space-y-2">
                  <li>• Contact your store manager or administrator</li>
                  <li>• Request an employee account to be created</li>
                  <li>• You&apos;ll receive login credentials via email</li>
                  <li>• Use those credentials to login at the employee login page</li>
                </ul>
              </div>
              <Button
                onClick={() => router.push('/employee-login')}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white gap-2"
              >
                <Home className="w-4 h-4" />
                Go to Employee Login
              </Button>
            </div>
          </div>
        </div>

        {/* Security Notice */}
        <div className="mt-6 p-4 bg-slate-700/30 border border-slate-600 rounded-lg">
          <p className="text-slate-400 text-xs text-center">
            This policy protects supermarket data and employee information from unauthorized access.
          </p>
        </div>
      </div>
    </div>
  )
}
