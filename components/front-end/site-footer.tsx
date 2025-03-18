'use client';

import { usePathname } from 'next/navigation';
import React from 'react';

export default function SiteFooter() {
  function getCurrentYear(): number {
    return new Date().getFullYear();
  }

  const pathname = usePathname();

  if (pathname.includes('/waitlist')) {
    return null;
  }

  return (
    <footer className="bg-gray-900 text-white py-4 w-full">
      <div className="space-y-2 text-sm opacity-70 text-center font-instrument-serif">
        Made with <span className="text-red-500">❤️</span>by{' '}
        <span className="font-bold mr-2">mosespace.</span>
        {getCurrentYear()}
        <span className="ml-1">© All rights reserved.</span>
      </div>
    </footer>
  );
}
