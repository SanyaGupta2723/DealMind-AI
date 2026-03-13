import type { Metadata } from 'next'
import { Geist, Geist_Mono } from 'next/font/google'
import { Analytics } from '@vercel/analytics/next'
import './globals.css'

const _geist = Geist({ subsets: ["latin"] });
const _geistMono = Geist_Mono({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: 'DealMind AI',
  description: 'AI Powered Negotiation Platform',
  generator: 'v0.app',
  icons: {
    icon: 'https://dealmind.us/wp-content/uploads/2025/03/dealmind-logo.jpg',
    apple: 'https://dealmind.us/wp-content/uploads/2025/03/dealmind-logo.jpg',
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className="font-sans antialiased">
        {children}
        <Analytics />
      </body>
    </html>
  )
}
