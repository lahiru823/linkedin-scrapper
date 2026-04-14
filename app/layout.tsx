import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'LinkedIn Profile Search',
  description: 'Search LinkedIn profiles by skills, qualifications, and experience',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="bg-gray-50">{children}</body>
    </html>
  )
}
