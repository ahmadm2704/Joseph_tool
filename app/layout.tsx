import { Analytics } from '@vercel/analytics/next'
import type { Metadata, Viewport } from 'next'
import './globals.css'
import { Inter } from 'next/font/google'
import { Providers } from '@/components/providers'

const inter = Inter({ 
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-inter',
})

export const metadata: Metadata = {
  title: 'CoursePro | Premium Professional Training',
  description: 'Transform your career with world-class professional courses. Expert instructors, cutting-edge curriculum, and lifetime support.',
  keywords: 'professional courses, training, web development, data science, career growth, online education',
  openGraph: {
    title: 'CoursePro | Premium Professional Training',
    description: 'Transform your career with world-class professional courses.',
    type: 'website',
  },
}

export const viewport: Viewport = {
  colorScheme: 'light',
  themeColor: '#f8fafc',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className={`${inter.variable} bg-[#f8fafc]`}>
      <body className="antialiased font-[family-name:var(--font-inter)] text-[#0f172a]">
        <Providers>
          {children}
        </Providers>
        {process.env.NODE_ENV === 'production' && <Analytics />}
      </body>
    </html>
  )
}
