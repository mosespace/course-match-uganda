import { authOptions } from '@/lib/auth';
import { getServerSession } from 'next-auth';
import { redirect } from 'next/navigation';
import React from 'react';

export default async function StatLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect(`/login?callback=${encodeURIComponent('/start')}`);
  }

  // console.log(`Session User:`, session);

  return <section>{children}</section>;
}
