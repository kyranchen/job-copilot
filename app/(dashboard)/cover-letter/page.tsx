export default function CoverLetterPage() {
  return (
    <div className="max-w-3xl mx-auto flex flex-col gap-5">
      <div className="flex flex-col gap-2">
        <label
          className="text-xs text-[#6b6b6b] uppercase tracking-widest"
          style={{ fontFamily: 'var(--font-mono), monospace' }}
        >
          Job Description
        </label>
        <textarea
          placeholder="Paste the job description here..."
          rows={10}
          className="w-full bg-white border border-[#e5e4e0] rounded-xl p-4 text-sm text-[#1c1c1e] placeholder-[#b0aeaa] resize-none focus:outline-none focus:border-[#22d3a5]/60 transition-colors shadow-sm"
          style={{ fontFamily: 'var(--font-mono), monospace' }}
        />
      </div>

      <div className="flex flex-col gap-2">
        <label
          className="text-xs text-[#6b6b6b] uppercase tracking-widest"
          style={{ fontFamily: 'var(--font-mono), monospace' }}
        >
          Resume
        </label>
        <button
          className="w-full bg-white border border-dashed border-[#d4d2cc] rounded-xl p-8 text-sm text-[#b0aeaa] hover:border-[#22d3a5]/60 hover:text-[#1c1c1e] transition-colors shadow-sm"
          style={{ fontFamily: 'var(--font-mono), monospace' }}
        >
          click to upload resume (.pdf, .docx)
        </button>
      </div>
    </div>
  )
}
