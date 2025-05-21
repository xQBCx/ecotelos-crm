import './globals.css'
import Navbar from '@/components/Navbar'

export const metadata = {
  title: 'EcoTelos CRM',
  description: 'White-label CRM for Smart Infrastructure',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <Navbar />
        {children}
      </body>
    </html>
  )
}
