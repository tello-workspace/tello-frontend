import type { Metadata } from 'next'
import StoreProvider from '@/lib/StoreProvider'
import './globals.css'

export const metadata: Metadata = {
  title: 'Tello',
  description: 'Sana konuşan proje panosu — stale kartları, iş yükünü ve darboğazları kendisi tespit eder.',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="tr" suppressHydrationWarning={true}>
      <body className="bg-slate-50 text-slate-900 antialiased">
        <StoreProvider>{children}</StoreProvider>
      </body>
    </html>
  )
}
