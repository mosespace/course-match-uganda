import { AppSidebar } from '@/components/back-end/app-sidebar';

import { Separator } from '@/components/ui/separator';
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from '@/components/ui/sidebar';
import React from 'react';
import Breadcrumb from '../../components/back-end/breadcrumb';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { redirect } from 'next/navigation';
import { SendFeedback } from '@/components/send-feedback';

export default async function FrontEndLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect(`/login?callback=${encodeURIComponent('/start')}`);
  }

  // console.log(`Session User:`, session);

  return (
    <section>
      <div className="">{children}</div>

      <SendFeedback user={session?.user} />
    </section>
  );
}
