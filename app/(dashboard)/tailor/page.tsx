'use client'

import { useState } from 'react'

const mono = { fontFamily: 'var(--font-mono), monospace' }

export default function TailorPage() {
  const [jobDescription, setJobDescription] = useState('')
  const [resumeText, setResumeText] = useState('')
  const [result, setResult] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [copied, setCopied] = useState(false)

  const canSubmit = jobDescription.trim() && resumeText.trim() && !loading

  async function tailor() {
    setLoading(true)
    setError(null)
    setResult(null)
    try {
      const res = await fetch('/api/tailor', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ jobDescription, resumeText }),
      })
      if (!res.ok) {
        const msg = (await res.json().catch(() => ({}))).error ?? `Error ${res.status}`
        throw new Error(msg)
      }
      const data = await res.json()
      setResult(data.tailoredResume)
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Failed to tailor resume')
    } finally {
      setLoading(false)
    }
  }

  async function copyResult() {
    if (!result) return
    await navigator.clipboard.writeText(result)
    setCopied(true)
    setTimeout(() => setCopied(false), 1500)
  }

  const inputCls =
    'w-full bg-white border border-[#e5e4e0] rounded-xl p-4 text-sm text-[#1c1c1e] ' +
    'placeholder-[#b0aeaa] resize-none focus:outline-none focus:border-[#22d3a5]/60 transition-colors shadow-sm'

  return (
    <div className="max-w-3xl mx-auto">
      <div className="mb-6">
        <p className="text-[11px] text-[#22d3a5] uppercase tracking-widest mb-2" style={mono}>
          // tailor
        </p>
        <h2 className="text-2xl font-bold text-[#1c1c1e]" style={{ fontFamily: 'var(--font-syne), sans-serif' }}>
          Tailor Resume
        </h2>
      </div>

      <div className="flex flex-col gap-5">
        <div className="flex flex-col gap-2">
          <label className="text-xs text-[#6b6b6b] uppercase tracking-widest" style={mono}>
            Job Description
          </label>
          <textarea
            value={jobDescription}
            onChange={e => setJobDescription(e.target.value)}
            placeholder="Paste the job description here..."
            rows={8}
            className={inputCls}
            style={mono}
          />
        </div>

        <div className="flex flex-col gap-2">
          <label className="text-xs text-[#6b6b6b] uppercase tracking-widest" style={mono}>
            Resume
          </label>
          <textarea
            value={resumeText}
            onChange={e => setResumeText(e.target.value)}
            placeholder="Paste your resume text here..."
            rows={10}
            className={inputCls}
            style={mono}
          />
          <span className="text-[11px] text-[#b0aeaa]" style={mono}>
            file upload (.pdf, .docx) coming soon — paste your resume text for now
          </span>
        </div>

        <button
          onClick={tailor}
          disabled={!canSubmit}
          className="self-start px-6 py-3 bg-[#22d3a5] text-[#04120e] text-sm font-semibold rounded-lg transition-opacity hover:opacity-90 disabled:opacity-40 disabled:cursor-not-allowed"
          style={{ ...mono, boxShadow: '0 0 20px rgba(34,211,165,0.25)' }}
        >
          {loading ? 'tailoring…' : 'tailor resume →'}
        </button>

        {error && (
          <div
            className="bg-white border border-[#ef4444]/40 rounded-xl p-4 text-sm text-[#ef4444]"
            style={mono}
          >
            {error}
          </div>
        )}

        {result && (
          <div className="flex flex-col gap-2">
            <div className="flex items-center justify-between">
              <label className="text-xs text-[#22d3a5] uppercase tracking-widest" style={mono}>
                // tailored resume
              </label>
              <button
                onClick={copyResult}
                className="text-[11px] text-[#6b6b6b] hover:text-[#1c1c1e] transition-colors"
                style={mono}
              >
                {copied ? 'copied ✓' : 'copy'}
              </button>
            </div>
            <pre
              className="w-full bg-white border border-[#e5e4e0] rounded-xl p-4 text-sm text-[#1c1c1e] whitespace-pre-wrap shadow-sm overflow-x-auto"
              style={mono}
            >
              {result}
            </pre>
          </div>
        )}
      </div>
    </div>
  )
}
