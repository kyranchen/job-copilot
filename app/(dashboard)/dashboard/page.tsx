export default function DashboardPage() {
  const stats = [
    { label: 'Resumes Tailored',       value: '0' },
    { label: 'Cover Letters',           value: '0' },
    { label: 'Applications Tracked',    value: '0' },
  ]

  return (
    <div className="max-w-4xl mx-auto">
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {stats.map(({ label, value }) => (
          <div
            key={label}
            className="bg-white border border-[#e5e4e0] rounded-xl p-6 shadow-sm"
          >
            <p
              className="text-xs text-[#6b6b6b] uppercase tracking-widest mb-3"
              style={{ fontFamily: 'var(--font-mono), monospace' }}
            >
              {label}
            </p>
            <p
              className="text-4xl font-bold text-[#1c1c1e]"
              style={{ fontFamily: 'var(--font-syne), sans-serif' }}
            >
              {value}
            </p>
          </div>
        ))}
      </div>
    </div>
  )
}
