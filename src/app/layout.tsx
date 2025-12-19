// app/layout.tsx
import { Toaster } from "sonner"
import "./globals.css"

export const metadata = {
  title: "JuanTap",
  description: "",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-gray-50">
        {children}
        <Toaster richColors position="top-center" />
      </body>
    </html>
  )
}
