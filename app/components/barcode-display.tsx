"use client"

import { useEffect, useRef } from "react"

interface BarcodeDisplayProps {
  value: string
  format?: "CODE128" | "CODE39" | "EAN13" | "UPC"
  width?: number
  height?: number
  displayValue?: boolean
}

/**
 * Barcode Display Component
 * 
 * Generates a barcode using canvas or SVG
 * Requires: pnpm add jsbarcode
 * 
 * Usage:
 * <BarcodeDisplay value="123456789012" format="EAN13" />
 */
export function BarcodeDisplay({
  value,
  format = "CODE128",
  width = 2,
  height = 100,
  displayValue = true,
}: BarcodeDisplayProps) {
  const barcodeRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!barcodeRef.current) return

    // Dynamic import to reduce bundle size
    const loadBarcode = async () => {
      try {
        const JsBarcode = (await import("jsbarcode")).default

        JsBarcode(barcodeRef.current, value, {
          format,
          width,
          height,
          displayValue,
          fontSize: 14,
          margin: 10,
        })
      } catch (error) {
        console.error("Error generating barcode:", error)
        // Fallback: display text representation
        if (barcodeRef.current) {
          barcodeRef.current.innerHTML = `
            <div style="
              border: 2px solid #000;
              padding: 8px;
              text-align: center;
              font-family: monospace;
              font-size: 12px;
            ">
              <div style="letter-spacing: 2px; margin-bottom: 4px;">
                ${Array.from(value).join(" ")}
              </div>
              <div style="font-weight: bold;">${value}</div>
            </div>
          `
        }
      }
    }

    loadBarcode()
  }, [value, format, width, height, displayValue])

  return (
    <div
      ref={barcodeRef}
      className="flex justify-center"
      style={{ minHeight: height + 40 }}
    />
  )
}

/**
 * Barcode for Product Labels
 * Used in inventory management
 */
export function ProductBarcode({
  sku,
  productName,
}: {
  sku: string
  productName: string
}) {
  const barcodeRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!barcodeRef.current) return

    const loadBarcode = async () => {
      try {
        const JsBarcode = (await import("jsbarcode")).default

        // Generate barcode with proper format
        const barcodeValue = sku.padEnd(12, "0").slice(0, 12) // EAN13 needs 12 digits

        JsBarcode(barcodeRef.current, barcodeValue, {
          format: "EAN13",
          width: 2,
          height: 80,
          displayValue: true,
          fontSize: 12,
          margin: 5,
        })
      } catch (error) {
        console.error("Error generating product barcode:", error)
      }
    }

    loadBarcode()
  }, [sku])

  return (
    <div className="rounded-lg border border-gray-200 bg-white p-4 text-center">
      <p className="mb-2 text-sm font-medium">{productName}</p>
      <div ref={barcodeRef} className="flex justify-center" />
      <p className="mt-2 text-xs text-gray-600">SKU: {sku}</p>
    </div>
  )
}
