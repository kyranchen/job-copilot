import Link from 'next/link'

export default function DashboardPage() {
  const stats = [
    { label: 'Resumes Tailored',     value: '0', hint: 'this month' },
    { label: 'Cover Letters',         value: '0', hint: 'this month' },
    { label: 'Applications Tracked', value: '0', hint: 'total'      },
  ]

  return (
    <div className="max-w-4xl mx-auto pt-4">
      {/* Page header */}
      <div className="mb-8">
        <p
          className="text-[11px] text-[#22d3a5] uppercase tracking-widest mb-2"
          style={{ fontFamily: 'var(--font-mono), monospace' }}
        >
          // overview
        </p>
        <h2
          className="text-2xl font-bold text-[#1c1c1e]"
          style={{ fontFamily: 'var(--font-syne), sans-serif' }}
        >
          Your activity
        </h2>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-10">
        {stats.map(({ label, value, hint }) => (
          <div
            key={label}
            className="bg-white border border-[#e5e4e0] rounded-xl p-5 hover:-translate-y-0.5 transition-transform"
            style={{ boxShadow: '0 1px 4px rgba(0,0,0,0.04), 0 4px 16px rgba(0,0,0,0.03)' }}
          >
            <p
              className="text-[10px] text-[#b0aeaa] uppercase tracking-widest mb-5"
              style={{ fontFamily: 'var(--font-mono), monospace' }}
            >
              {label}
            </p>
            <div className="flex items-baseline gap-2">
              <span
                className="text-4xl font-medium text-[#1c1c1e] tabular-nums"
                style={{ fontFamily: 'var(--font-mono), monospace' }}
              >
                {value}
              </span>
              <span
                className="text-[11px] text-[#b0aeaa]"
                style={{ fontFamily: 'var(--font-mono), monospace' }}
              >
                {hint}
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Next action — empty-state prompt */}
      <div>
        <p
          className="text-[11px] text-[#22d3a5] uppercase tracking-widest mb-4"
          style={{ fontFamily: 'var(--font-mono), monospace' }}
        >
          // get started
        </p>
        <Link
          href="/tailor"
          className="group block bg-white border border-[#e5e4e0] rounded-xl p-6 transition-all hover:border-[#22d3a5]/50 hover:-translate-y-0.5"
          style={{ boxShadow: '0 1px 4px rgba(0,0,0,0.04), 0 4px 16px rgba(0,0,0,0.03)' }}
        >
          <div className="flex items-center justify-between">
            <div>
              <h3
                className="text-base font-bold text-[#1c1c1e] mb-1"
                style={{ fontFamily: 'var(--font-syne), sans-serif' }}
              >
                Tailor your first resume
              </h3>
              <p
                className="text-[12px] text-[#6b6b6b]"
                style={{ fontFamily: 'var(--font-mono), monospace' }}
              >
                Paste a job description and let Claude match your resume to the role.
              </p>
            </div>
            <span
              className="text-[#22d3a5] text-sm shrink-0 ml-4 transition-transform group-hover:translate-x-1"
              style={{ fontFamily: 'var(--font-mono), monospace' }}
            >
              →
            </span>
          </div>
        </Link>
      </div>
    </div>
  )
}
