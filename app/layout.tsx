import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { CartProvider } from "./context/cart-context"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "DESTINY - POS System",
  description: "Enterprise Point of Sale System",
  generator: 'v0.app',
  viewport: {
    width: 'device-width',
    initialScale: 1,
  }
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className="scroll-smooth" suppressHydrationWarning>
      <head>
        <meta name="theme-color" content="#0c0c0c" />
        <meta charSet="utf-8" />
      </head>
      <body className={`${inter.className} bg-background antialiased`} suppressHydrationWarning>
        <CartProvider>{children}</CartProvider>
      </body>
    </html>
  )
}
