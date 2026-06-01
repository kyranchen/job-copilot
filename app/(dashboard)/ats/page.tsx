'use client'

import { useState } from 'react'
import ResumeField from '@/components/resume-field'

const mono = { fontFamily: 'var(--font-mono), monospace' }

type AtsResult = {
  score: number
  matchedKeywords: string[]
  missingKeywords: string[]
  summary: string
}

function scoreColor(score: number): string {
  if (score >= 75) return '#16a37e'
  if (score >= 50) return '#d97706'
  return '#ef4444'
}

export default function AtsPage() {
  const [jobDescription, setJobDescription] = useState('')
  const [resumeText, setResumeText] = useState('')
  const [result, setResult] = useState<AtsResult | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const canSubmit = jobDescription.trim() && resumeText.trim() && !loading

  async function check() {
    setLoading(true)
    setError(null)
    setResult(null)
    try {
      const res = await fetch('/api/ats', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ jobDescription, resumeText }),
      })
      if (!res.ok) {
        throw new Error((await res.json().catch(() => ({}))).error ?? `Error ${res.status}`)
      }
      setResult(await res.json())
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Failed to check ATS score')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-3xl mx-auto">
      <div className="mb-6">
        <p className="text-[11px] text-[#22d3a5] uppercase tracking-widest mb-2" style={mono}>
          // ats score
        </p>
        <h2 className="text-2xl font-bold text-[#1c1c1e]" style={{ fontFamily: 'var(--font-syne), sans-serif' }}>
          ATS Score
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
            className="w-full bg-white border border-[#e5e4e0] rounded-xl p-4 text-sm text-[#1c1c1e] placeholder-[#b0aeaa] resize-none focus:outline-none focus:border-[#22d3a5]/60 transition-colors shadow-sm"
            style={mono}
          />
        </div>

        <ResumeField value={resumeText} onChange={setResumeText} />

        <button
          onClick={check}
          disabled={!canSubmit}
          className="self-start px-6 py-3 bg-[#22d3a5] text-[#04120e] text-sm font-semibold rounded-lg transition-opacity hover:opacity-90 disabled:opacity-40 disabled:cursor-not-allowed"
          style={{ ...mono, boxShadow: '0 0 20px rgba(34,211,165,0.25)' }}
        >
          {loading ? 'analyzing…' : 'check score →'}
        </button>

        {error && (
          <div className="bg-white border border-[#ef4444]/40 rounded-xl p-4 text-sm text-[#ef4444]" style={mono}>
            {error}
          </div>
        )}

        {result && (
          <div className="bg-white border border-[#e5e4e0] rounded-xl p-6 shadow-sm flex flex-col gap-5">
            {/* Score */}
            <div className="flex items-baseline gap-3">
              <span
                className="text-5xl font-bold tabular-nums"
                style={{ ...mono, color: scoreColor(result.score) }}
              >
                {result.score}
              </span>
              <span className="text-sm text-[#b0aeaa]" style={mono}>/ 100 match</span>
            </div>

            {/* Summary */}
            <p className="text-[13px] text-[#1c1c1e] leading-relaxed" style={mono}>
              {result.summary}
            </p>

            {/* Matched */}
            <div className="flex flex-col gap-2">
              <span className="text-[10px] uppercase tracking-widest text-[#16a37e]" style={mono}>
                ✓ matched ({result.matchedKeywords.length})
              </span>
              <div className="flex flex-wrap gap-2">
                {result.matchedKeywords.map(k => (
                  <span
                    key={k}
                    className="px-2.5 py-1 rounded text-[11px]"
                    style={{ ...mono, color: '#16a37e', background: 'rgba(34,211,165,0.12)' }}
                  >
                    {k}
                  </span>
                ))}
              </div>
            </div>

            {/* Missing */}
            <div className="flex flex-col gap-2">
              <span className="text-[10px] uppercase tracking-widest text-[#ef4444]" style={mono}>
                ✗ missing ({result.missingKeywords.length})
              </span>
              <div className="flex flex-wrap gap-2">
                {result.missingKeywords.length === 0 ? (
                  <span className="text-[11px] text-[#b0aeaa]" style={mono}>none — great coverage</span>
                ) : (
                  result.missingKeywords.map(k => (
                    <span
                      key={k}
                      className="px-2.5 py-1 rounded text-[11px]"
                      style={{ ...mono, color: '#ef4444', background: 'rgba(239,68,68,0.10)' }}
                    >
                      {k}
                    </span>
                  ))
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
