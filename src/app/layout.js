import './globals.css'
import Navbar from '@/components/Navbar'

export const metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL),
}

export default function RootLayout({ children }) {
  return (
    <html lang="id">
      <body className="bg-slate-950 text-slate-200 min-h-screen flex flex-col font-sans">
        <Navbar />
        <main className="flex-grow">
          {children}
        </main>
        <footer className="bg-slate-900 border-t border-slate-800 py-6 mt-10 text-center text-sm text-slate-500">
          <p>&copy; {new Date().getFullYear()} {process.env.NEXT_PUBLIC_SITE_NAME}. All rights reserved.</p>
        </footer>
      </body>
    </html>
  )
}