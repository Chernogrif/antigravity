import type { Metadata } from 'next'
import { Unbounded, Manrope, Cinzel, Cormorant_Garamond, Playfair_Display, Montserrat } from 'next/font/google'
import './globals.css'

const unbounded = Unbounded({ subsets: ['latin', 'cyrillic'], variable: '--font-unbounded', display: 'swap' })
const jakarta = Manrope({ subsets: ['latin', 'cyrillic'], variable: '--font-jakarta', display: 'swap' })
const cinzel = Cinzel({ subsets: ['latin'], variable: '--font-cinzel', display: 'swap' })
const cormorant = Cormorant_Garamond({ weight: ['300', '400', '600', '700'], subsets: ['cyrillic', 'latin'], variable: '--font-cormorant', display: 'swap' })
const playfair = Playfair_Display({ subsets: ['cyrillic', 'latin'], variable: '--font-playfair', display: 'swap' })
const montserrat = Montserrat({ subsets: ['cyrillic', 'latin'], variable: '--font-montserrat', display: 'swap' })

import { createClient } from '@/utils/supabase/server'
import { AdminProvider } from '@/components/AdminProvider'
import { PremiumCursor } from '@/components/PremiumCursor'

export const metadata: Metadata = {
  title: 'ООО ПИФ "ВОЗРОЖДЕНИЕ" | Комплексное проектирование и Изыскания',
  description: 'Инновационные решения: от геодезии и изысканий до комплексного проектирования',
}

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  return (
    <html lang="ru" className={`${unbounded.variable} ${jakarta.variable} ${cinzel.variable} ${cormorant.variable} ${playfair.variable} ${montserrat.variable}`}>
      <body className="font-sans antialiased bg-[#f8f6f0] text-[#1a1d24] scroll-smooth">
        <PremiumCursor />
        <AdminProvider initialIsAdmin={!!user}>
          {children}
        </AdminProvider>
      </body>
    </html>
  )
}
