import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'CRM - Deal Management',
  description: 'Deal and contact management system',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}

