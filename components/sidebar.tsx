'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { UserButton } from '@clerk/nextjs'
import { useState } from 'react'

const links = [
  { href: '/dashboard',    label: 'dashboard'     },
  { href: '/tailor',       label: 'tailor_resume'  },
  { href: '/cover-letter', label: 'cover_letter'   },
  { href: '/ats',          label: 'ats_score'      },
  { href: '/tracker',      label: 'tracker'        },
]

export default function Sidebar() {
  const pathname = usePathname()
  const [open, setOpen] = useState(false)

  return (
    <>
      <button
        onClick={() => setOpen(o => !o)}
        className="fixed top-3.5 left-4 z-50 md:hidden text-[#1c1c1e] text-lg"
        aria-label="Toggle sidebar"
      >
        {open ? '✕' : '☰'}
      </button>

      {open && (
        <div
          className="fixed inset-0 z-30 bg-black/20 md:hidden"
          onClick={() => setOpen(false)}
        />
      )}

      <aside
        className={`
          fixed top-0 left-0 z-40 h-full w-56 flex flex-col
          bg-[#f5f4f2] border-r border-[#e5e4e0]
          transition-transform duration-200
          ${open ? 'translate-x-0' : '-translate-x-full'}
          md:translate-x-0 md:static md:z-auto
        `}
      >
        {/* Logo */}
        <div className="px-4 pt-5 pb-4">
          <div
            className="flex items-center gap-2 text-[13px] font-medium text-[#1c1c1e]"
            style={{ fontFamily: 'var(--font-mono), monospace' }}
          >
            <span
              className="w-2 h-2 rounded-full bg-[#22d3a5] shrink-0"
              style={{ boxShadow: '0 0 8px #22d3a5' }}
            />
            job_copilot
          </div>
        </div>

        {/* Section label */}
        <div className="px-4 pb-2">
          <span
            className="text-[10px] tracking-widest uppercase text-[#b0aeaa]"
            style={{ fontFamily: 'var(--font-mono), monospace' }}
          >
            // navigation
          </span>
        </div>

        {/* Nav links */}
        <nav className="flex-1 px-2 flex flex-col gap-0.5">
          {links.map(({ href, label }) => {
            const active = pathname === href || pathname.startsWith(href + '/')
            return (
              <Link
                key={href}
                href={href}
                onClick={() => setOpen(false)}
                className={`
                  relative flex items-center gap-2.5 px-4 py-2.5 rounded-lg text-[12px] transition-all duration-150 w-full
                  ${active
                    ? 'bg-white text-[#22d3a5] shadow-sm border border-[#e5e4e0]'
                    : 'text-[#6b6b6b] hover:text-[#1c1c1e] hover:bg-white/60'
                  }
                `}
                style={{ fontFamily: 'var(--font-mono), monospace' }}
              >
                <span className={`text-[10px] ${active ? 'text-[#22d3a5]' : 'text-[#d4d2cc]'}`}>
                  {active ? '▶' : '▷'}
                </span>
                {label}
              </Link>
            )
          })}
        </nav>

        {/* User section */}
        <div className="px-3 pt-4 pb-6 mt-2 border-t border-[#e5e4e0] shrink-0">
          <div className="flex items-center gap-3 px-3 py-2.5 rounded-lg bg-white border border-[#e5e4e0]">
            <UserButton appearance={{ elements: { avatarBox: 'w-8 h-8' } }} />
            <span
              className="text-[12px] text-[#6b6b6b] truncate"
              style={{ fontFamily: 'var(--font-mono), monospace' }}
            >
              account
            </span>
          </div>
        </div>
      </aside>
    </>
  )
}
