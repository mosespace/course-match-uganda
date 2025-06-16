import { Header } from '@/components/header';
import { SendFeedback } from '@/components/send-feedback';
import React from 'react';

export default async function FrontEndLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  // const session = await getServerSession(authOptions);

  // if (!session) {
  //   redirect(`/login?callback=${encodeURIComponent('/start')}`);
  // }

  // console.log(`Session User:`, session);

  return (
    <section>
      <div className="bg-white">
        <div className="relative min-h-screen">
          <Header />

          <main className="container mx-auto flex max-w-5xl flex-1 flex-col px-4">
            {children}
          </main>
        </div>

        <footer>
          <div className="flex items-center justify-center py-8">
            <span className="text-sm text-gray-400">
              Made by
              <a
                href="https://desishub.com"
                target="_blank"
                rel="noopener noreferrer"
                className="ml-1 text-slate-950"
              >
                @desishub
              </a>
            </span>
          </div>
        </footer>
      </div>

      <SendFeedback user={session?.user} />
    </section>
  );
}
