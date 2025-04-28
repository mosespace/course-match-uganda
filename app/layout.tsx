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
      <body suppressHydrationWarning={true} className={`${inter.className}`}>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
