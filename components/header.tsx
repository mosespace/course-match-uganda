'use client';
import { siteConfig } from '@/constants/site';
import { GitHubLogoIcon, TwitterLogoIcon } from '@radix-ui/react-icons';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Button } from './ui/button';

export const Header = () => {
  const pathname = usePathname();
  const isRoot = pathname === '/';

  const isStart = pathname === '/start';

  return (
    <>
      {isRoot ? (
        <div className="absolute left-0 right-0 top-0 -z-10 h-52 bg-gradient-to-b from-violet-400/10 from-10% to-white" />
      ) : null}

      <header className="container mx-auto flex max-w-5xl items-center justify-between px-4 py-8">
        <Link href="/">
          <div className="text-xl text-slate-950">{siteConfig.name}</div>
        </Link>
        <nav className="flex items-center gap-6">
          <a
            href="https://twitter.com/bantu_creative"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex"
          >
            <TwitterLogoIcon className="h-6 w-6 text-slate-950 transition-colors hover:text-violet-500" />
          </a>
          <a
            href="https://github.com/mosespace/cm-uganda"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex"
          >
            <GitHubLogoIcon className="h-6 w-6 text-slate-950 transition-colors hover:text-violet-500" />
          </a>
          {!isStart && (
            <Button asChild>
              <a
                href="/start"
                rel="noopener noreferrer"
                className="inline-flex"
              >
                Start Now!
              </a>
            </Button>
          )}
        </nav>
      </header>
    </>
  );
};
