"use client"

import { useRouter } from "next/navigation"
import { AlertCircle, Home } from "lucide-react"
import { Button } from "@/components/ui/button"

export default function AdminSignupPage() {
  const router = useRouter()

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-white mb-2">DESTINY</h1>
          <p className="text-slate-400">Admin Registration</p>
        </div>

        {/* Blocked Message */}
        <div className="bg-slate-800/50 border border-slate-700 rounded-lg p-8 backdrop-blur-md">
          <div className="p-6 bg-red-500/10 border border-red-500/20 rounded-lg text-center">
            <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
            <h2 className="text-red-400 font-semibold mb-2">Admin Registration Disabled</h2>
            <p className="text-red-300 text-sm mb-6">
              For security reasons, admin accounts can only be created by existing administrators. This prevents unauthorized access to the admin dashboard.
            </p>
            <div className="space-y-4">
              <div className="bg-slate-700/50 p-4 rounded-lg text-left">
                <p className="text-slate-300 text-sm font-medium mb-2">What to do:</p>
                <ul className="text-slate-400 text-xs space-y-2">
                  <li>• Contact your existing administrator</li>
                  <li>• Request to be created as an admin user</li>
                  <li>• You&apos;ll receive login credentials via secure channel</li>
                  <li>• Use those credentials to login at the admin login page</li>
                </ul>
              </div>
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

        {/* Security Notice */}
        <div className="mt-6 p-4 bg-slate-700/30 border border-slate-600 rounded-lg">
          <p className="text-slate-400 text-xs text-center">
            This restriction is in place to maintain the security and integrity of the admin system.
          </p>
        </div>
      </div>
    </div>
  )
}
