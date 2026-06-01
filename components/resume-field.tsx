'use client'

import { useState } from 'react'

const mono = { fontFamily: 'var(--font-mono), monospace' }

/**
 * Resume input shared by tailor / cover-letter / ATS pages: a paste textarea plus a
 * PDF/DOCX upload that parses server-side (/api/resume/parse) and fills the textarea.
 */
export default function ResumeField({
  value,
  onChange,
}: {
  value: string
  onChange: (text: string) => void
}) {
  const [parsing, setParsing] = useState(false)
  const [parseError, setParseError] = useState<string | null>(null)

  async function handleFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    e.target.value = '' // allow re-selecting the same file
    if (!file) return
    setParsing(true)
    setParseError(null)
    try {
      const fd = new FormData()
      fd.append('file', file)
      const res = await fetch('/api/resume/parse', { method: 'POST', body: fd })
      if (!res.ok) {
        const msg = (await res.json().catch(() => ({}))).error ?? `Error ${res.status}`
        throw new Error(msg)
      }
      const data = await res.json()
      onChange(data.text)
    } catch (err) {
      setParseError(err instanceof Error ? err.message : 'Failed to read file')
    } finally {
      setParsing(false)
    }
  }

  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-center justify-between">
        <label className="text-xs text-[#6b6b6b] uppercase tracking-widest" style={mono}>
          Resume
        </label>
        <label
          className={`text-[11px] transition-colors ${parsing ? 'text-[#b0aeaa]' : 'text-[#22d3a5] hover:opacity-80 cursor-pointer'}`}
          style={mono}
        >
          {parsing ? 'parsing…' : '↑ upload .pdf / .docx'}
          <input
            type="file"
            accept=".pdf,.docx,application/pdf,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
            className="hidden"
            onChange={handleFile}
            disabled={parsing}
          />
        </label>
      </div>
      <textarea
        value={value}
        onChange={e => onChange(e.target.value)}
        placeholder="Paste your resume text here, or upload a file above…"
        rows={10}
        className="w-full bg-white border border-[#e5e4e0] rounded-xl p-4 text-sm text-[#1c1c1e] placeholder-[#b0aeaa] resize-none focus:outline-none focus:border-[#22d3a5]/60 transition-colors shadow-sm"
        style={mono}
      />
      {parseError && (
        <span className="text-[11px] text-[#ef4444]" style={mono}>
          {parseError}
        </span>
      )}
    </div>
  )
}
