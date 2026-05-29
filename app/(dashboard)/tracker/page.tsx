export default function TrackerPage() {
  const columns = ['Company', 'Role', 'Stage', 'Days', 'Follow-up']

  return (
    <div className="max-w-4xl mx-auto">
      <div className="bg-white border border-[#e5e4e0] rounded-xl overflow-hidden shadow-sm">
        <div
          className="grid border-b border-[#e5e4e0] px-5 py-3"
          style={{ gridTemplateColumns: '2fr 1.5fr 1fr 0.5fr 1fr' }}
        >
          {columns.map(col => (
            <span
              key={col}
              className="text-xs text-[#6b6b6b] uppercase tracking-widest"
              style={{ fontFamily: 'var(--font-mono), monospace' }}
            >
              {col}
            </span>
          ))}
        </div>

        <div className="px-5 py-16 text-center">
          <p
            className="text-sm text-[#b0aeaa]"
            style={{ fontFamily: 'var(--font-mono), monospace' }}
          >
            no applications yet — add your first one to start tracking
          </p>
        </div>
      </div>
    </div>
  )
}
