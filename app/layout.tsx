import { Header } from '@/components/header';
import Providers from '@/components/providers';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'EPMS | Employee Payroll Management System',
  description: 'crafted by @mosespace',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        suppressHydrationWarning={true}
        className={`${inter.className} bg-black`}
      >
        <Providers>
          <div className="relative min-h-screen">
            <Header />

            <main className="container mx-auto flex max-w-5xl flex-1 flex-col px-4">
              {children}
            </main>
            <footer>
              <div className="flex items-center justify-center py-8">
                <span className="text-sm text-gray-400">
                  Made by
                  <a
                    href="https://desishub.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="ml-1 text-gray-50"
                  >
                    @desishub
                  </a>
                </span>
              </div>
            </footer>
          </div>
        </Providers>
      </body>
    </html>
  );
}
