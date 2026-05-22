'use client'

import { useRouter } from 'next/navigation'
import { ArrowLeft } from 'lucide-react'

export default function PrivacyPage() {
  const router = useRouter()

  return (
    <div className="min-h-screen bg-gradient-to-b from-black via-slate-900 to-black relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-blue-500/10 rounded-full blur-3xl" />
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-cyan-500/10 rounded-full blur-3xl" />
      </div>

      <div className="relative z-10">
        {/* Header */}
        <div className="border-b border-white/10 bg-black/40 backdrop-blur-xl">
          <div className="max-w-4xl mx-auto px-6 py-4 flex items-center justify-between">
            <h1 className="text-2xl font-bold">Destiny Supermarket</h1>
            <button
              onClick={() => router.back()}
              className="flex items-center gap-2 text-white/60 hover:text-white transition"
            >
              <ArrowLeft className="w-4 h-4" />
              Back
            </button>
          </div>
        </div>

        {/* Privacy Policy Content */}
        <main className="max-w-4xl mx-auto px-6 py-12">
          <h2 className="text-4xl font-bold mb-8">Privacy Policy</h2>

          <div className="space-y-8 text-white/80">
            <section>
              <h3 className="text-2xl font-semibold mb-3 text-white">1. Introduction</h3>
              <p>
                Destiny Supermarket POS is committed to protecting your privacy. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use our Point of Sale system.
              </p>
            </section>

            <section>
              <h3 className="text-2xl font-semibold mb-3 text-white">2. Information We Collect</h3>
              <p>We may collect information about you in a variety of ways. The information we may collect on the Site includes:</p>
              <ul className="list-disc list-inside mt-4 space-y-2 text-white/70">
                <li>Personal identification information (name, email address, phone number, etc.)</li>
                <li>Transaction data (purchase history, payment information, items purchased)</li>
                <li>Employee information (credentials, work history, performance data)</li>
                <li>Device information (IP address, browser type, operating system)</li>
              </ul>
            </section>

            <section>
              <h3 className="text-2xl font-semibold mb-3 text-white">3. Use of Your Information</h3>
              <p>Having accurate information about you permits us to provide you with a smooth, efficient, and customized experience. Specifically, we may use information collected about you via the Site to:</p>
              <ul className="list-disc list-inside mt-4 space-y-2 text-white/70">
                <li>Generate a personal profile about you</li>
                <li>Increase the efficiency and operation of the Site</li>
                <li>Monitor and analyze usage and trends to improve your experience with the Site</li>
                <li>Process transactions and send related information</li>
              </ul>
            </section>

            <section>
              <h3 className="text-2xl font-semibold mb-3 text-white">4. Disclosure of Your Information</h3>
              <p>We may share information we have collected about you in certain situations:</p>
              <ul className="list-disc list-inside mt-4 space-y-2 text-white/70">
                <li>By Law or to Protect Rights</li>
                <li>Third-Party Service Providers</li>
                <li>Marketing Communications</li>
              </ul>
            </section>

            <section>
              <h3 className="text-2xl font-semibold mb-3 text-white">5. Security of Your Information</h3>
              <p>
                We use administrative, technical, and physical security measures to protect your personal information. However, perfect security does not exist on the Internet. You are responsible for maintaining the confidentiality of your credentials.
              </p>
            </section>

            <section>
              <h3 className="text-2xl font-semibold mb-3 text-white">6. Contact Us</h3>
              <p>
                If you have questions or comments about this Privacy Policy, please contact us at:
              </p>
              <p className="mt-4">
                <strong>Email:</strong> <a href="mailto:admin@anonymikletech.online" className="text-blue-400 hover:text-blue-300">admin@anonymikletech.online</a><br />
                <strong>Phone:</strong> <a href="tel:+254782829321" className="text-blue-400 hover:text-blue-300">+254 782 829 321</a>
              </p>
            </section>
          </div>
        </main>
      </div>
    </div>
  )
}
