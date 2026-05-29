import type { Metadata } from 'next'
import { JetBrains_Mono, Syne } from 'next/font/google'
import { ClerkProvider } from '@clerk/nextjs'
import './globals.css'

const jetbrainsMono = JetBrains_Mono({
  variable: '--font-mono',
  subsets: ['latin'],
})

const syne = Syne({
  variable: '--font-syne',
  subsets: ['latin'],
})

export const metadata: Metadata = {
  title: 'Job Copilot',
  description: 'AI-powered job application tool for software engineers',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <ClerkProvider>
      <html lang="en" className={`${jetbrainsMono.variable} ${syne.variable}`}>
        <body className="min-h-screen bg-[#080810] text-[#e8e8f0] antialiased">
          {children}
        </body>
      </html>
    </ClerkProvider>
  )
}
