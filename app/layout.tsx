import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "GitHub-Trace - Find GitHub Connections",
  description: "Reveal connections between GitHub usernames and emails via commit history",
  keywords: ["GitHub", "username", "email", "commit", "trace", "search"],
  authors: [{ name: "M1r0ku" }],
  viewport: "width=device-width, initial-scale=1",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        {children}
      </body>
    </html>
  )
}