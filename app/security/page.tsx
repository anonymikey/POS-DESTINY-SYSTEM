'use client'

import { useRouter } from 'next/navigation'
import { ArrowLeft, Lock, Shield, Eye, Zap } from 'lucide-react'

export default function SecurityPage() {
  const router = useRouter()

  const securityFeatures = [
    {
      icon: Lock,
      title: 'End-to-End Encryption',
      description: 'All data is encrypted using industry-standard protocols to protect sensitive information.'
    },
    {
      icon: Shield,
      title: 'Security Audits',
      description: 'Regular security audits and penetration testing ensure our systems remain secure.'
    },
    {
      icon: Eye,
      title: 'Access Control',
      description: 'Role-based access control and authentication ensure only authorized users can access data.'
    },
    {
      icon: Zap,
      title: 'Real-time Monitoring',
      description: 'Continuous monitoring and logging of all transactions for fraud detection and prevention.'
    }
  ]

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
          <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
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

        {/* Security Content */}
        <main className="max-w-6xl mx-auto px-6 py-16">
          <div className="text-center mb-16">
            <h2 className="text-5xl font-bold mb-4">Security First</h2>
            <p className="text-xl text-white/60 max-w-2xl mx-auto">
              Destiny Supermarket POS is built with enterprise-grade security to protect your data and transactions.
            </p>
          </div>

          {/* Security Features */}
          <div className="grid md:grid-cols-2 gap-8 mb-16">
            {securityFeatures.map((feature, index) => {
              const Icon = feature.icon
              return (
                <div
                  key={index}
                  className="rounded-lg border border-white/10 bg-white/5 backdrop-blur-xl p-8 hover:border-white/20 transition"
                >
                  <div className="flex items-center gap-4 mb-4">
                    <div className="w-12 h-12 rounded-lg bg-blue-500/20 flex items-center justify-center">
                      <Icon className="w-6 h-6 text-blue-400" />
                    </div>
                    <h3 className="text-xl font-semibold">{feature.title}</h3>
                  </div>
                  <p className="text-white/60">{feature.description}</p>
                </div>
              )
            })}
          </div>

          {/* Detailed Security Info */}
          <div className="space-y-8">
            <section>
              <h3 className="text-3xl font-bold mb-4">Data Protection</h3>
              <p className="text-white/70 mb-4">
                All customer and transaction data is protected using AES-256 encryption. Our infrastructure follows PCI DSS compliance standards to ensure payment card data is handled securely.
              </p>
            </section>

            <section>
              <h3 className="text-3xl font-bold mb-4">Authentication & Authorization</h3>
              <p className="text-white/70 mb-4">
                We implement multi-factor authentication, strong password policies, and role-based access control. All user actions are logged and monitored for suspicious activity.
              </p>
            </section>

            <section>
              <h3 className="text-3xl font-bold mb-4">Compliance & Certifications</h3>
              <ul className="space-y-2 text-white/70">
                <li>PCI DSS Level 1 Compliant</li>
                <li>GDPR Compliant</li>
                <li>ISO 27001 Information Security Management</li>
                <li>Regular Third-Party Security Audits</li>
              </ul>
            </section>

            <section>
              <h3 className="text-3xl font-bold mb-4">Security Incident Response</h3>
              <p className="text-white/70 mb-4">
                In the unlikely event of a security incident, we have a comprehensive incident response plan. We notify affected parties within 24 hours and provide detailed reports of remediation steps.
              </p>
            </section>

            <section>
              <h3 className="text-3xl font-bold mb-4">Report a Security Vulnerability</h3>
              <p className="text-white/70 mb-4">
                If you discover a security vulnerability, please report it to our security team immediately:
              </p>
              <p>
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
