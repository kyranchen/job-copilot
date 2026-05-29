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
    <header className="h-12 px-5 flex items-center justify-between border-b border-[#e5e4e0] bg-[#fafaf9]">
      <div className="flex items-center gap-2">
        <span
          className="text-[10px] tracking-widest uppercase text-[#22d3a5]"
          style={{ fontFamily: 'var(--font-mono), monospace' }}
        >
          //
        </span>
        <h1
          className="text-[13px] font-semibold text-[#1c1c1e]"
          style={{ fontFamily: 'var(--font-mono), monospace' }}
        >
          {getTitle(pathname)}
        </h1>
      </div>

      <SignOutButton>
        <button
          className="text-[11px] text-[#b0aeaa] hover:text-[#22d3a5] transition-colors cursor-pointer"
          style={{ fontFamily: 'var(--font-mono), monospace' }}
        >
          sign_out →
        </button>
      </SignOutButton>
    </header>
  )
}
