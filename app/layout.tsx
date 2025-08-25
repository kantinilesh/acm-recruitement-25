import type React from "react"
import type { Metadata } from "next"
import { Space_Grotesk, DM_Sans } from "next/font/google"
import localFont from "next/font/local"
import "./globals.css"

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-space-grotesk",
})

const dmSans = DM_Sans({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-dm-sans",
})

// ✅ Add your local rdrf font
const rdrf = localFont({
  src: "./fonts/rdrf.ttf", // make sure app/fonts/rdrf.ttf exists
  variable: "--font-rdrf",
  display: "swap",
})

export const metadata: Metadata = {
  title: "ACM SIGKDD Recruitments 2025 - Ride into the Future",
  description:
    "Join ACM SIGKDD and explore new territories in data science, machine learning, and innovation. Recruitments now open!",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html
      lang="en"
      className={`${spaceGrotesk.variable} ${dmSans.variable} ${rdrf.variable}`}
    >
      {/* ✅ rdrf applied globally */}
      <body className={`${rdrf.className} antialiased`}>{children}</body>
    </html>
  )
}
