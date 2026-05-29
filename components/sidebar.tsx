'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { UserButton } from '@clerk/nextjs'
import { useState } from 'react'

const links = [
  { href: '/dashboard',     label: 'Dashboard'     },
  { href: '/tailor',        label: 'Tailor Resume'  },
  { href: '/cover-letter',  label: 'Cover Letter'   },
  { href: '/ats',           label: 'ATS Score'      },
  { href: '/tracker',       label: 'Tracker'        },
]

export default function Sidebar() {
  const pathname = usePathname()
  const [open, setOpen] = useState(false)

  return (
    <>
      {/* Mobile toggle */}
      <button
        onClick={() => setOpen(o => !o)}
        className="fixed top-4 left-4 z-50 md:hidden flex items-center justify-center w-8 h-8 text-[#1c1c1e]"
        aria-label="Toggle sidebar"
      >
        {open ? '✕' : '☰'}
      </button>

      {/* Backdrop */}
      {open && (
        <div
          className="fixed inset-0 z-30 bg-black/20 md:hidden"
          onClick={() => setOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`
          fixed top-0 left-0 z-40 h-full w-56 flex flex-col
          bg-white border-r border-[#e5e4e0]
          transition-transform duration-200
          ${open ? 'translate-x-0' : '-translate-x-full'}
          md:translate-x-0 md:static md:z-auto
        `}
      >
        {/* Logo */}
        <div className="px-5 py-5 border-b border-[#e5e4e0]">
          <span
            className="flex items-center gap-2 text-sm font-medium text-[#1c1c1e]"
            style={{ fontFamily: 'var(--font-mono), monospace' }}
          >
            <span
              className="w-2 h-2 rounded-full bg-[#22d3a5]"
              style={{ boxShadow: '0 0 8px #22d3a5' }}
            />
            job_copilot
          </span>
        </div>

        {/* Nav links */}
        <nav className="flex-1 px-3 py-4 flex flex-col gap-1">
          {links.map(({ href, label }) => {
            const active = pathname === href || pathname.startsWith(href + '/')
            return (
              <Link
                key={href}
                href={href}
                onClick={() => setOpen(false)}
                className={`
                  flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-colors
                  ${active
                    ? 'bg-[#22d3a5]/10 text-[#16a37e]'
                    : 'text-[#6b6b6b] hover:text-[#1c1c1e] hover:bg-[#f5f4f2]'
                  }
                `}
                style={{ fontFamily: 'var(--font-mono), monospace' }}
              >
                <span
                  className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${active ? 'bg-[#22d3a5]' : 'bg-[#d4d2cc]'}`}
                />
                {label}
              </Link>
            )
          })}
        </nav>

        {/* User section */}
        <div className="px-4 py-4 border-t border-[#e5e4e0] flex items-center gap-3">
          <UserButton
            appearance={{
              elements: { avatarBox: 'w-7 h-7' },
            }}
          />
          <span
            className="text-xs text-[#b0aeaa] truncate"
            style={{ fontFamily: 'var(--font-mono), monospace' }}
          >
            account
          </span>
        </div>
      </aside>
    </>
  )
}
