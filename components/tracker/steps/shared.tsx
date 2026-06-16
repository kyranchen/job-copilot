'use client'

import { useState } from 'react'

export const wsField: React.CSSProperties = {
  width: '100%',
  background: 'var(--ws-surface)',
  border: '1px solid var(--ws-border)',
  borderRadius: 8,
  color: 'var(--ws-text)',
  fontSize: 12,
  padding: 12,
  outline: 'none',
  resize: 'none',
}

export const sectionLabel: React.CSSProperties = {
  fontSize: 10,
  letterSpacing: '0.15em',
  textTransform: 'uppercase',
  color: 'var(--ws-accent)',
}

export function PrimaryButton({
  children, onClick, disabled,
}: { children: React.ReactNode; onClick: () => void; disabled?: boolean }) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className="self-start font-semibold"
      style={{
        fontSize: 12, padding: '10px 18px', borderRadius: 8,
        background: 'var(--ws-accent)', color: 'var(--ws-aInk)',
        opacity: disabled ? 0.4 : 1, cursor: disabled ? 'not-allowed' : 'pointer',
      }}
    >
      {children}
    </button>
  )
}

export function ErrorNote({ msg }: { msg: string }) {
  return <div style={{ fontSize: 11, color: 'var(--ws-red)' }}>{msg}</div>
}

/** Dark resume input: paste textarea + PDF/DOCX upload (/api/resume/parse). */
export function ResumeBox({ value, onChange }: { value: string; onChange: (t: string) => void }) {
  const [parsing, setParsing] = useState(false)
  const [err, setErr] = useState<string | null>(null)

  async function handleFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    e.target.value = ''
    if (!file) return
    setParsing(true); setErr(null)
    try {
      const fd = new FormData(); fd.append('file', file)
      const res = await fetch('/api/resume/parse', { method: 'POST', body: fd })
      if (!res.ok) throw new Error((await res.json().catch(() => ({}))).error ?? `Error ${res.status}`)
      onChange((await res.json()).text)
    } catch (e) {
      setErr(e instanceof Error ? e.message : 'Failed to read file')
    } finally { setParsing(false) }
  }

  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-center justify-between">
        <span style={{ fontSize: 11, color: 'var(--ws-muted)' }}>Resume</span>
        <label style={{ fontSize: 11, color: parsing ? 'var(--ws-muted)' : 'var(--ws-accent)', cursor: parsing ? 'default' : 'pointer' }}>
          {parsing ? 'parsing…' : '↑ upload .pdf / .docx'}
          <input
            type="file"
            accept=".pdf,.docx,application/pdf,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
            className="hidden" onChange={handleFile} disabled={parsing}
          />
        </label>
      </div>
      <textarea
        value={value}
        onChange={e => onChange(e.target.value)}
        placeholder="Paste your resume text, or upload a file…"
        rows={8}
        style={wsField}
      />
      {err && <ErrorNote msg={err} />}
    </div>
  )
}

/** Dark URL row: fetch a JD from a link (/api/jd/fetch). */
export function UrlRow({ onText }: { onText: (t: string) => void }) {
  const [url, setUrl] = useState('')
  const [fetching, setFetching] = useState(false)
  const [err, setErr] = useState<string | null>(null)

  async function go() {
    if (!url.trim() || fetching) return
    setFetching(true); setErr(null)
    try {
      const res = await fetch('/api/jd/fetch', {
        method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ url }),
      })
      if (!res.ok) throw new Error((await res.json().catch(() => ({}))).error ?? `Error ${res.status}`)
      onText((await res.json()).text)
    } catch (e) {
      setErr(e instanceof Error ? e.message : 'Failed to fetch URL')
    } finally { setFetching(false) }
  }

  return (
    <div className="flex flex-col gap-2">
      <div className="flex gap-2">
        <input
          type="url" value={url} onChange={e => setUrl(e.target.value)}
          onKeyDown={e => { if (e.key === 'Enter') { e.preventDefault(); go() } }}
          placeholder="…or paste a job posting link to fetch it"
          style={{ ...wsField, flex: 1, padding: '8px 10px' }}
        />
        <button
          onClick={go} disabled={!url.trim() || fetching}
          style={{ padding: '8px 14px', borderRadius: 8, border: '1px solid var(--ws-border)', background: 'var(--ws-surface)', color: 'var(--ws-text)', fontSize: 12, opacity: !url.trim() || fetching ? 0.4 : 1 }}
        >
          {fetching ? 'fetching…' : 'fetch'}
        </button>
      </div>
      {err && <ErrorNote msg={err} />}
    </div>
  )
}
