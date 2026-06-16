'use client'

import { useState } from 'react'
import type { Application, PipelineStage } from '../types'
import { withCurrent } from '../types'
import { ResumeBox, UrlRow, PrimaryButton, ErrorNote, wsField, sectionLabel } from './shared'

function Heading({ label, title }: { label: string; title: string }) {
  return (
    <div className="mb-1">
      <p style={sectionLabel}>{label}</p>
      <h3 style={{ fontFamily: 'var(--font-syne), sans-serif', fontSize: 16, fontWeight: 700, color: 'var(--ws-text)', marginTop: 4 }}>{title}</h3>
    </div>
  )
}

function ResultBlock({ text }: { text: string }) {
  const [copied, setCopied] = useState(false)
  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-center justify-between">
        <span style={sectionLabel}>// result</span>
        <button
          onClick={async () => { await navigator.clipboard.writeText(text); setCopied(true); setTimeout(() => setCopied(false), 1500) }}
          style={{ fontSize: 11, color: 'var(--ws-muted)' }}
        >
          {copied ? 'copied ✓' : 'copy'}
        </button>
      </div>
      <pre style={{ ...wsField, whiteSpace: 'pre-wrap', overflowX: 'auto' }}>{text}</pre>
    </div>
  )
}

// ── Step 1: Job Details ──────────────────────────────────────────────
export function JobDetailsStep({ jd, setJd }: { jd: string; setJd: (s: string) => void }) {
  return (
    <div className="flex flex-col gap-4">
      <Heading label="// job details" title="Job details" />
      <UrlRow onText={setJd} />
      <textarea value={jd} onChange={e => setJd(e.target.value)} placeholder="Paste the job description here…" rows={10} style={wsField} />
    </div>
  )
}

// Shared hook-free helper for the AI steps.
function useAiCall<T>() {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  async function run(path: string, body: unknown, onOk: (data: T) => void) {
    setLoading(true); setError(null)
    try {
      const res = await fetch(path, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) })
      if (!res.ok) throw new Error((await res.json().catch(() => ({}))).error ?? `Error ${res.status}`)
      onOk(await res.json())
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Request failed')
    } finally { setLoading(false) }
  }
  return { loading, error, run }
}

// ── Step 2: Tailor Resume ────────────────────────────────────────────
export function TailorStep({ jd, resume, setResume }: { jd: string; resume: string; setResume: (s: string) => void }) {
  const [result, setResult] = useState<string | null>(null)
  const { loading, error, run } = useAiCall<{ tailoredResume: string }>()
  const ready = jd.trim() && resume.trim() && !loading
  return (
    <div className="flex flex-col gap-4">
      <Heading label="// tailor" title="Tailor resume" />
      <ResumeBox value={resume} onChange={setResume} />
      <PrimaryButton disabled={!ready} onClick={() => run('/api/tailor', { jobDescription: jd, resumeText: resume }, d => setResult(d.tailoredResume))}>
        {loading ? 'tailoring…' : 'generate tailored resume →'}
      </PrimaryButton>
      {error && <ErrorNote msg={error} />}
      {result && <ResultBlock text={result} />}
    </div>
  )
}

// ── Step 3: ATS Score ────────────────────────────────────────────────
type AtsResult = { score: number; matchedKeywords: string[]; missingKeywords: string[]; summary: string }
export function AtsStep({ jd, resume, setResume }: { jd: string; resume: string; setResume: (s: string) => void }) {
  const [result, setResult] = useState<AtsResult | null>(null)
  const { loading, error, run } = useAiCall<AtsResult>()
  const ready = jd.trim() && resume.trim() && !loading
  const color = (s: number) => (s >= 75 ? 'var(--ws-teal)' : s >= 50 ? 'var(--ws-amber)' : 'var(--ws-red)')
  return (
    <div className="flex flex-col gap-4">
      <Heading label="// ats score" title="ATS score" />
      <ResumeBox value={resume} onChange={setResume} />
      <PrimaryButton disabled={!ready} onClick={() => run('/api/ats', { jobDescription: jd, resumeText: resume }, setResult)}>
        {loading ? 'analyzing…' : 'check score →'}
      </PrimaryButton>
      {error && <ErrorNote msg={error} />}
      {result && (
        <div style={{ ...wsField, display: 'flex', flexDirection: 'column', gap: 16 }}>
          <div className="flex items-baseline gap-3">
            <span style={{ fontFamily: 'var(--font-syne), sans-serif', fontSize: 48, fontWeight: 700, color: color(result.score) }}>{result.score}</span>
            <span style={{ fontSize: 12, color: 'var(--ws-muted)' }}>/ 100 match</span>
          </div>
          <p style={{ fontSize: 12, color: 'var(--ws-text)', lineHeight: 1.6 }}>{result.summary}</p>
          <Chips label={`✓ matched (${result.matchedKeywords.length})`} items={result.matchedKeywords} color="var(--ws-teal)" bg="rgba(52,211,153,0.12)" />
          <Chips label={`✗ missing (${result.missingKeywords.length})`} items={result.missingKeywords} color="var(--ws-red)" bg="rgba(248,113,113,0.1)" empty="none — great coverage" />
        </div>
      )}
    </div>
  )
}

function Chips({ label, items, color, bg, empty }: { label: string; items: string[]; color: string; bg: string; empty?: string }) {
  return (
    <div className="flex flex-col gap-2">
      <span style={{ fontSize: 10, letterSpacing: '0.12em', textTransform: 'uppercase', color }}>{label}</span>
      <div className="flex flex-wrap gap-2">
        {items.length === 0 ? <span style={{ fontSize: 11, color: 'var(--ws-muted)' }}>{empty}</span>
          : items.map(k => <span key={k} style={{ fontSize: 11, padding: '4px 10px', borderRadius: 4, color, background: bg }}>{k}</span>)}
      </div>
    </div>
  )
}

// ── Step 4: Cover Letter ─────────────────────────────────────────────
export function CoverLetterStep({ jd, resume, setResume }: { jd: string; resume: string; setResume: (s: string) => void }) {
  const [result, setResult] = useState<string | null>(null)
  const { loading, error, run } = useAiCall<{ coverLetter: string }>()
  const ready = jd.trim() && resume.trim() && !loading
  return (
    <div className="flex flex-col gap-4">
      <Heading label="// cover letter" title="Cover letter" />
      <ResumeBox value={resume} onChange={setResume} />
      <PrimaryButton disabled={!ready} onClick={() => run('/api/cover-letter', { jobDescription: jd, resumeText: resume }, d => setResult(d.coverLetter))}>
        {loading ? 'writing…' : 'generate cover letter →'}
      </PrimaryButton>
      {error && <ErrorNote msg={error} />}
      {result && <ResultBlock text={result} />}
    </div>
  )
}

// ── Step 5: Track Stage ──────────────────────────────────────────────
export function TrackStageStep({ app, onUpdate }: { app: Application; onUpdate: (pipeline: PipelineStage[]) => void }) {
  const [editing, setEditing] = useState(false)
  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <Heading label="// track stage" title="Pipeline" />
        {!editing && (
          <button onClick={() => setEditing(true)} style={{ fontSize: 11, color: 'var(--ws-muted)', border: '1px solid var(--ws-border)', borderRadius: 6, padding: '5px 10px' }}>
            Edit stages
          </button>
        )}
      </div>
      {editing
        ? <PipelineEditor pipeline={app.pipeline} onCancel={() => setEditing(false)} onSave={p => { onUpdate(p); setEditing(false) }} />
        : <PipelineViewer pipeline={app.pipeline} onSelect={i => onUpdate(withCurrent(app.pipeline, i))} />}
    </div>
  )
}

function PipelineViewer({ pipeline, onSelect }: { pipeline: PipelineStage[]; onSelect: (i: number) => void }) {
  return (
    <>
      <p style={{ fontSize: 11, color: 'var(--ws-muted)' }}>Click a stage to mark it as current.</p>
      <div className="flex flex-col">
        {pipeline.map((s, i) => {
          const dot =
            s.status === 'done' ? { bg: 'var(--ws-teal)', mark: '✓' }
              : s.status === 'current' ? { bg: 'var(--ws-accent)', mark: '' }
              : s.status === 'rejected' ? { bg: 'var(--ws-red)', mark: '✕' }
              : { bg: 'transparent', mark: '' }
          return (
            <button key={s.id} onClick={() => onSelect(i)} className="flex items-center gap-3 text-left" style={{ padding: '10px 0' }}>
              <span className="flex flex-col items-center" style={{ width: 20 }}>
                <span style={{
                  width: 16, height: 16, borderRadius: '50%', background: dot.bg,
                  border: s.status === 'upcoming' ? '1px solid var(--ws-border)' : 'none',
                  boxShadow: s.status === 'current' ? '0 0 8px rgba(240,193,75,0.5)' : 'none',
                  display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 9, color: 'var(--ws-aInk)',
                }}>{dot.mark}</span>
                {i < pipeline.length - 1 && <span style={{ width: 1.5, height: 18, background: s.status === 'done' ? 'var(--ws-teal)' : 'var(--ws-border)' }} />}
              </span>
              <span style={{ fontSize: 12, color: s.status === 'upcoming' ? 'var(--ws-muted)' : 'var(--ws-text)' }}>{s.label}</span>
              {s.status === 'current' && <span style={{ fontSize: 10, color: 'var(--ws-accent)' }}>← current</span>}
            </button>
          )
        })}
      </div>
    </>
  )
}

function PipelineEditor({ pipeline, onCancel, onSave }: { pipeline: PipelineStage[]; onCancel: () => void; onSave: (p: PipelineStage[]) => void }) {
  const [stages, setStages] = useState<PipelineStage[]>(() => pipeline.map(s => ({ ...s })))
  const [newLabel, setNewLabel] = useState('')
  const [dragIdx, setDragIdx] = useState<number | null>(null)

  function rename(i: number, label: string) {
    setStages(prev => prev.map((s, idx) => (idx === i ? { ...s, label } : s)))
  }
  function remove(i: number) {
    setStages(prev => prev.filter((_, idx) => idx !== i))
  }
  function add() {
    if (!newLabel.trim()) return
    setStages(prev => [...prev, { id: crypto.randomUUID(), label: newLabel.trim(), status: 'upcoming' }])
    setNewLabel('')
  }
  function onDrop(target: number) {
    if (dragIdx === null || dragIdx === target) return
    setStages(prev => {
      const next = [...prev]
      const [moved] = next.splice(dragIdx, 1)
      next.splice(target, 0, moved)
      return next
    })
    setDragIdx(null)
  }
  function save() {
    let next = stages.filter(s => s.label.trim())
    if (next.length === 0) return
    // Ensure exactly one current stage survives edits.
    if (!next.some(s => s.status === 'current')) {
      next = next.map((s, i) => ({ ...s, status: i === 0 ? 'current' : s.status }))
    }
    onSave(next)
  }

  return (
    <div className="flex flex-col gap-3">
      <div className="flex flex-col">
        {stages.map((s, i) => (
          <div
            key={s.id}
            draggable
            onDragStart={() => setDragIdx(i)}
            onDragOver={e => e.preventDefault()}
            onDrop={() => onDrop(i)}
            className="flex items-center gap-2"
            style={{ padding: '6px 0', opacity: dragIdx === i ? 0.4 : 1 }}
          >
            <span style={{ cursor: 'grab', color: 'var(--ws-muted2)', fontSize: 13 }}>⠿</span>
            <input
              value={s.label}
              onChange={e => rename(i, e.target.value)}
              style={{ flex: 1, background: 'var(--ws-surface)', border: '1px solid var(--ws-border)', borderRadius: 6, color: 'var(--ws-text)', fontSize: 12, padding: '6px 9px', outline: 'none' }}
            />
            <button onClick={() => remove(i)} style={{ color: 'var(--ws-muted)', fontSize: 12, padding: '0 6px' }}>✕</button>
          </div>
        ))}
      </div>

      <div className="flex gap-2">
        <input
          value={newLabel}
          onChange={e => setNewLabel(e.target.value)}
          onKeyDown={e => { if (e.key === 'Enter') { e.preventDefault(); add() } }}
          placeholder="Add a stage…"
          style={{ flex: 1, background: 'var(--ws-surface)', border: '1px solid var(--ws-border)', borderRadius: 6, color: 'var(--ws-text)', fontSize: 12, padding: '7px 10px', outline: 'none' }}
        />
        <button onClick={add} disabled={!newLabel.trim()} style={{ fontSize: 12, padding: '7px 12px', borderRadius: 6, border: '1px solid var(--ws-border)', background: 'var(--ws-surface)', color: 'var(--ws-text)', opacity: newLabel.trim() ? 1 : 0.4 }}>+ Add</button>
      </div>

      <div className="flex gap-2">
        <button onClick={onCancel} style={{ fontSize: 12, padding: '8px 14px', borderRadius: 8, color: 'var(--ws-muted)', background: 'transparent' }}>Cancel</button>
        <button onClick={save} className="font-semibold" style={{ fontSize: 12, padding: '8px 16px', borderRadius: 8, background: 'var(--ws-accent)', color: 'var(--ws-aInk)' }}>Save pipeline</button>
      </div>
    </div>
  )
}
