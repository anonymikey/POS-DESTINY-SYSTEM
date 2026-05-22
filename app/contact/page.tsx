'use client'

import { useRouter } from 'next/navigation'
import { ArrowLeft, Mail, Phone } from 'lucide-react'
import { Button } from '@/components/ui/button'

export default function ContactPage() {
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

        {/* Contact Section */}
        <main className="max-w-4xl mx-auto px-6 py-16">
          <div className="text-center mb-12">
            <h2 className="text-4xl md:text-5xl font-bold mb-4">Contact Us</h2>
            <p className="text-white/60 max-w-2xl mx-auto">
              Get in touch with our support team for any questions or inquiries about our POS system.
            </p>
          </div>

          {/* Contact Information */}
          <div className="grid md:grid-cols-2 gap-8 mb-12">
            {/* Email */}
            <div className="rounded-lg border border-white/10 bg-white/5 backdrop-blur-xl p-8">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-lg bg-blue-500/20 flex items-center justify-center">
                  <Mail className="w-5 h-5 text-blue-400" />
                </div>
                <h3 className="text-lg font-semibold">Email</h3>
              </div>
              <p className="text-white/60 mb-4">Send us an email and we'll respond as soon as possible.</p>
              <a
                href="mailto:admin@anonymikletech.online"
                className="inline-flex items-center gap-2 text-blue-400 hover:text-blue-300 transition"
              >
                admin@anonymikletech.online
              </a>
            </div>

            {/* Phone */}
            <div className="rounded-lg border border-white/10 bg-white/5 backdrop-blur-xl p-8">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-lg bg-cyan-500/20 flex items-center justify-center">
                  <Phone className="w-5 h-5 text-cyan-400" />
                </div>
                <h3 className="text-lg font-semibold">Phone</h3>
              </div>
              <p className="text-white/60 mb-4">Call us directly for urgent support.</p>
              <a
                href="tel:+254782829321"
                className="inline-flex items-center gap-2 text-cyan-400 hover:text-cyan-300 transition"
              >
                +254 782 829 321
              </a>
            </div>
          </div>

          {/* Contact Form */}
          <div className="rounded-lg border border-white/10 bg-white/5 backdrop-blur-xl p-8 max-w-2xl mx-auto">
            <h3 className="text-2xl font-bold mb-6">Send us a Message</h3>
            <form className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">Name</label>
                <input
                  type="text"
                  placeholder="Your name"
                  className="w-full px-4 py-2 rounded-lg bg-white/5 border border-white/10 text-white placeholder-white/40 focus:outline-none focus:border-white/30 transition"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Email</label>
                <input
                  type="email"
                  placeholder="your@email.com"
                  className="w-full px-4 py-2 rounded-lg bg-white/5 border border-white/10 text-white placeholder-white/40 focus:outline-none focus:border-white/30 transition"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Message</label>
                <textarea
                  placeholder="Your message here..."
                  rows={4}
                  className="w-full px-4 py-2 rounded-lg bg-white/5 border border-white/10 text-white placeholder-white/40 focus:outline-none focus:border-white/30 transition resize-none"
                />
              </div>
              <Button className="w-full bg-white text-black hover:bg-white/90">
                Send Message
              </Button>
            </form>
          </div>

          {/* Business Hours */}
          <div className="mt-12 text-center">
            <h3 className="text-xl font-semibold mb-4">Business Hours</h3>
            <p className="text-white/60">
              Monday - Friday: 8:00 AM - 6:00 PM <br />
              Saturday: 9:00 AM - 4:00 PM <br />
              Sunday: Closed
            </p>
          </div>
        </main>
      </div>
    </div>
  )
}
