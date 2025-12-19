// app/layout.tsx
import "./globals.css"
import ClientWrapper from "@/components/client-wrapper"

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
        <ClientWrapper />
      </body>
    </html>
  )
}
