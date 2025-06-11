import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { authOptions } from '@/lib/auth';
import { BookOpen, ChevronRight } from 'lucide-react';
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

  return (
    <section className="">
      {children}
      <Card className="bg-gradient-to-r from-amber-50 to-orange-50 border-amber-200">
        <CardContent className="p-6">
          <div className="flex items-start space-x-4">
            <div className="bg-amber-100 p-2 rounded-full">
              <BookOpen className="h-5 w-5 text-amber-600" />
            </div>
            <div className="flex-1">
              <h3 className="font-semibold text-amber-900 mb-2">
                Can't find a course?
              </h3>
              <p className="text-amber-800 text-sm mb-4">
                Let's help you find it. Just give us your A-level combination
                and we'll suggest the best courses for you from all Universities
                in Uganda.
              </p>
              <Button
                variant="outline"
                className="border-amber-300 text-amber-700 hover:bg-amber-100"
              >
                Get Course Recommendations
                <ChevronRight className="ml-2 h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </section>
  );
}
