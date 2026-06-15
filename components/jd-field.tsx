'use client'

import { useState } from 'react'

const mono = { fontFamily: 'var(--font-mono), monospace' }

/**
 * Job-description input shared by tailor / cover-letter / ATS pages: a paste textarea
 * plus an optional URL fetch (/api/jd/fetch). URL is a convenience — paste always works,
 * and links that can't be read (LinkedIn, etc.) surface a clear message.
 */
export default function JdField({
  value,
  onChange,
}: {
  value: string
  onChange: (text: string) => void
}) {
  const [url, setUrl] = useState('')
  const [fetching, setFetching] = useState(false)
  const [fetchError, setFetchError] = useState<string | null>(null)

  async function fetchUrl() {
    if (!url.trim() || fetching) return
    setFetching(true)
    setFetchError(null)
    try {
      const res = await fetch('/api/jd/fetch', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url }),
      })
      if (!res.ok) {
        throw new Error((await res.json().catch(() => ({}))).error ?? `Error ${res.status}`)
      }
      onChange((await res.json()).text)
    } catch (e) {
      setFetchError(e instanceof Error ? e.message : 'Failed to fetch URL')
    } finally {
      setFetching(false)
    }
  }

  return (
    <div className="flex flex-col gap-2">
      <label className="text-xs text-[#6b6b6b] uppercase tracking-widest" style={mono}>
        Job Description
      </label>

      <div className="flex gap-2">
        <input
          type="url"
          value={url}
          onChange={e => setUrl(e.target.value)}
          onKeyDown={e => { if (e.key === 'Enter') { e.preventDefault(); fetchUrl() } }}
          placeholder="…or paste a job posting link to fetch it"
          className="flex-1 bg-white border border-[#e5e4e0] rounded-lg px-3 py-2 text-[12px] text-[#1c1c1e] placeholder-[#b0aeaa] focus:outline-none focus:border-[#22d3a5]/60 transition-colors"
          style={mono}
        />
        <button
          onClick={fetchUrl}
          disabled={!url.trim() || fetching}
          className="px-4 py-2 rounded-lg border border-[#e5e4e0] bg-white text-[12px] text-[#1c1c1e] hover:border-[#22d3a5]/60 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
          style={mono}
        >
          {fetching ? 'fetching…' : 'fetch'}
        </button>
      </div>

      <textarea
        value={value}
        onChange={e => onChange(e.target.value)}
        placeholder="Paste the job description here…"
        rows={8}
        className="w-full bg-white border border-[#e5e4e0] rounded-xl p-4 text-sm text-[#1c1c1e] placeholder-[#b0aeaa] resize-none focus:outline-none focus:border-[#22d3a5]/60 transition-colors shadow-sm"
        style={mono}
      />
      {fetchError && (
        <span className="text-[11px] text-[#ef4444]" style={mono}>
          {fetchError}
        </span>
      )}
    </div>
  )
}
