'use client';

import React from 'react';
import QueryProvider from '@/lib/query-provider';
import { SessionProvider } from 'next-auth/react';
import { Analytics } from '@vercel/analytics/react';
import { Toaster as MToast } from '@mosespace/toast';

interface ProvidersProps {
  children: React.ReactNode;
  session?: any;
}
export default function Providers({ children, session }: ProvidersProps) {
  return (
    <SessionProvider session={session}>
      <QueryProvider>
        {children}
        <MToast position="bottom-left" />
        <Analytics />
      </QueryProvider>
    </SessionProvider>
  );
}
