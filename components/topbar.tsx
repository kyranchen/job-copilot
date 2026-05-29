'use client'

import { usePathname } from 'next/navigation'
import { SignOutButton } from '@clerk/nextjs'

const titles: Record<string, string> = {
  '/dashboard':    'Dashboard',
  '/tailor':       'Tailor Resume',
  '/cover-letter': 'Cover Letter',
  '/ats':          'ATS Score',
  '/tracker':      'Tracker',
}

function getTitle(pathname: string) {
  for (const [prefix, label] of Object.entries(titles)) {
    if (pathname === prefix || pathname.startsWith(prefix + '/')) return label
  }
  return 'Job Copilot'
}

export default function Topbar() {
  const pathname = usePathname()

  return (
    <header className="h-14 px-6 flex items-center justify-between border-b border-[#e5e4e0] bg-white">
      <h1
        className="text-sm font-semibold text-[#1c1c1e] tracking-wide"
        style={{ fontFamily: 'var(--font-syne), sans-serif' }}
      >
        {getTitle(pathname)}
      </h1>

      <SignOutButton>
        <button
          className="text-xs text-[#b0aeaa] hover:text-[#1c1c1e] transition-colors cursor-pointer"
          style={{ fontFamily: 'var(--font-mono), monospace' }}
        >
          sign out →
        </button>
      </SignOutButton>
    </header>
  )
}
