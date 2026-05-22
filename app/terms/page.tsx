'use client'

import { useRouter } from 'next/navigation'
import { ArrowLeft } from 'lucide-react'

export default function TermsPage() {
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

        {/* Terms Content */}
        <main className="max-w-4xl mx-auto px-6 py-12">
          <h2 className="text-4xl font-bold mb-8">Terms of Service</h2>

          <div className="space-y-8 text-white/80">
            <section>
              <h3 className="text-2xl font-semibold mb-3 text-white">1. Agreement to Terms</h3>
              <p>
                By accessing and using this POS system ("Service"), you accept and agree to be bound by and comply with the terms and provision of this agreement. If you do not agree to abide by the above, please do not use this service.
              </p>
            </section>

            <section>
              <h3 className="text-2xl font-semibold mb-3 text-white">2. License and Use Restrictions</h3>
              <p>
                Destiny Supermarket grants you a limited, non-exclusive, revocable license to use the Service. You are not permitted to:
              </p>
              <ul className="list-disc list-inside mt-4 space-y-2 text-white/70">
                <li>Modify or copy the software or materials</li>
                <li>Use the software for any commercial purpose or for any public display</li>
                <li>Remove any copyright or other proprietary notations</li>
                <li>Reverse engineer, disassemble, or decompile the Service</li>
                <li>Transfer the software or materials to another person or "mirror" the software</li>
              </ul>
            </section>

            <section>
              <h3 className="text-2xl font-semibold mb-3 text-white">3. Disclaimer of Warranties</h3>
              <p>
                THE SERVICE IS PROVIDED ON AN "AS-IS" AND "AS-AVAILABLE" BASIS. DESTINY SUPERMARKET MAKES NO REPRESENTATIONS OR WARRANTIES OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE, AND NONINFRINGEMENT.
              </p>
            </section>

            <section>
              <h3 className="text-2xl font-semibold mb-3 text-white">4. Limitation of Liability</h3>
              <p>
                IN NO EVENT SHALL DESTINY SUPERMARKET BE LIABLE FOR ANY INDIRECT, INCIDENTAL, SPECIAL, CONSEQUENTIAL, OR PUNITIVE DAMAGES RESULTING FROM YOUR USE OF OR INABILITY TO USE THE SERVICE.
              </p>
            </section>

            <section>
              <h3 className="text-2xl font-semibold mb-3 text-white">5. Governing Law</h3>
              <p>
                These terms and conditions are governed by and construed in accordance with the laws of Kenya and you irrevocably submit to the exclusive jurisdiction of the courts in that location.
              </p>
            </section>

            <section>
              <h3 className="text-2xl font-semibold mb-3 text-white">6. Contact Information</h3>
              <p>
                If you have any questions about these Terms, please contact us at:
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
