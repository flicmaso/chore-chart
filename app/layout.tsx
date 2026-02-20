import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Chore Chart - Mason & Shannon',
    description: 'Weekly chore tracking for Mason and Shannon',
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