import './globals.css'
import Navbar from '@/components/Navbar'
import AdScript from "@/components/AdScript";
import Script from 'next/script'

export const metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL),
}

export default function RootLayout({ children }) {
  return (
    <html lang="id">
      <head>
        <Script
          strategy="afterInteractive"
          src="https://www.googletagmanager.com/gtag/js?id=G-3WQ4STSLRS"
        />
        <Script
          id="google-analytics"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{
            __html: `
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              gtag('config', 'G-3WQ4STSLRS');
            `,
          }}
        />
      <meta name="msvalidate.01" content="6E41AC696D5DE948A1156393421936A2" />
      </head>
      <body className="bg-slate-950 text-slate-200 min-h-screen flex flex-col font-sans">
        <AdScript />
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