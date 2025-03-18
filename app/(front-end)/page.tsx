'use client';

import { Button } from '@/components/ui/button';
import { signOut } from 'next-auth/react';
import Link from 'next/link';

export default function page() {
  return (
    <div className="h-screen mx-auto flex items-center full w-full">
      {/* CTA Section */}
      <section className="py-20 w-full">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Ready to transform your future?
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto mb-8">
            Join thousands of businesses that trust EPMS for their payroll
            needs. Get started today with our 14-day free trial.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button asChild size="lg" className="px-8">
              <Link href="/login">Start Free Trial</Link>
            </Button>
            <Button
              onClick={() => signOut({ callbackUrl: '/login' })}
              variant="outline"
              size="lg"
              className="px-8"
            >
              Schedule Demo
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}
