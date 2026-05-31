'use client'

import { useEffect, useState } from 'react'

type Stage = 'APPLIED' | 'PHONE_SCREEN' | 'TECHNICAL' | 'SYSTEM_DESIGN' | 'OFFER'

type Application = {
  id: string
  company: string
  role: string
  stage: Stage
  appliedAt: string
  lastActivityAt: string
  notes: string | null
}

const STAGES: { value: Stage; label: string; color: string; bg: string }[] = [
  { value: 'APPLIED',       label: 'Applied',       color: '#4f6ef7', bg: 'rgba(79,110,247,0.12)'  },
  { value: 'PHONE_SCREEN',  label: 'Phone Screen',  color: '#b8860b', bg: 'rgba(240,193,75,0.18)'  },
  { value: 'TECHNICAL',     label: 'Technical',     color: '#7c5cd6', bg: 'rgba(124,58,237,0.12)'  },
  { value: 'SYSTEM_DESIGN', label: 'System Design', color: '#9333ea', bg: 'rgba(147,51,234,0.12)'  },
  { value: 'OFFER',         label: 'Offer',         color: '#16a37e', bg: 'rgba(34,211,165,0.14)'  },
]

const stageMeta = (s: Stage) => STAGES.find(x => x.value === s) ?? STAGES[0]
const mono = { fontFamily: 'var(--font-mono), monospace' }

function daysSince(iso: string): number {
  return Math.max(0, Math.floor((Date.now() - Date.parse(iso)) / 86_400_000))
}

const GRID = '2fr 1.5fr 1.3fr 0.5fr 1fr 0.4fr'

export default function TrackerPage() {
  const [apps, setApps] = useState<Application[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [adding, setAdding] = useState(false)
  const [form, setForm] = useState({ company: '', role: '', stage: 'APPLIED' as Stage })
  const [submitting, setSubmitting] = useState(false)

  async function load() {
    setLoading(true)
    setError(null)
    try {
      const res = await fetch('/api/applications')
      if (!res.ok) throw new Error((await res.json().catch(() => ({}))).error ?? `Error ${res.status}`)
      setApps(await res.json())
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Failed to load')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { load() }, [])

  async function addApp(e: React.FormEvent) {
    e.preventDefault()
    if (!form.company.trim() || !form.role.trim()) return
    setSubmitting(true)
    try {
      const res = await fetch('/api/applications', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })
      if (!res.ok) throw new Error(`Error ${res.status}`)
      setForm({ company: '', role: '', stage: 'APPLIED' })
      setAdding(false)
      await load()
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Failed to add')
    } finally {
      setSubmitting(false)
    }
  }

  async function deleteApp(id: string) {
    setApps(prev => prev.filter(a => a.id !== id)) // optimistic
    try {
      const res = await fetch(`/api/applications/${id}`, { method: 'DELETE' })
      if (!res.ok) throw new Error()
    } catch {
      load() // revert by reloading truth
    }
  }

  async function updateStage(id: string, stage: Stage) {
    setApps(prev => prev.map(a => (a.id === id ? { ...a, stage } : a))) // optimistic
    try {
      const res = await fetch(`/api/applications/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ stage }),
      })
      if (!res.ok) throw new Error()
    } catch {
      load() // revert to server truth
    }
  }

  const inputCls =
    'bg-white border border-[#e5e4e0] rounded-lg px-3 py-2 text-[13px] text-[#1c1c1e] ' +
    'placeholder-[#b0aeaa] focus:outline-none focus:border-[#22d3a5]/60'

  return (
    <div className="max-w-4xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <p className="text-[11px] text-[#22d3a5] uppercase tracking-widest mb-2" style={mono}>
            // pipeline
          </p>
          <h2 className="text-2xl font-bold text-[#1c1c1e]" style={{ fontFamily: 'var(--font-syne), sans-serif' }}>
            Application Tracker
          </h2>
        </div>
        <button
          onClick={() => setAdding(a => !a)}
          className="px-4 py-2 rounded-lg bg-[#22d3a5] text-[#04120e] text-[12px] font-semibold transition-opacity hover:opacity-90"
          style={{ ...mono, boxShadow: '0 0 20px rgba(34,211,165,0.25)' }}
        >
          {adding ? 'cancel' : '+ add application'}
        </button>
      </div>

      {/* Add form */}
      {adding && (
        <form
          onSubmit={addApp}
          className="bg-white border border-[#e5e4e0] rounded-xl p-4 mb-4 shadow-sm flex flex-wrap items-center gap-3"
        >
          <input
            autoFocus
            className={inputCls + ' flex-1 min-w-[160px]'}
            style={mono}
            placeholder="company"
            value={form.company}
            onChange={e => setForm(f => ({ ...f, company: e.target.value }))}
          />
          <input
            className={inputCls + ' flex-1 min-w-[160px]'}
            style={mono}
            placeholder="role"
            value={form.role}
            onChange={e => setForm(f => ({ ...f, role: e.target.value }))}
          />
          <select
            className={inputCls}
            style={mono}
            value={form.stage}
            onChange={e => setForm(f => ({ ...f, stage: e.target.value as Stage }))}
          >
            {STAGES.map(s => <option key={s.value} value={s.value}>{s.label}</option>)}
          </select>
          <button
            type="submit"
            disabled={submitting}
            className="px-4 py-2 rounded-lg bg-[#1c1c1e] text-white text-[12px] font-semibold disabled:opacity-50"
            style={mono}
          >
            {submitting ? 'saving…' : 'save'}
          </button>
        </form>
      )}

      {/* Table */}
      <div className="bg-white border border-[#e5e4e0] rounded-xl overflow-hidden shadow-sm">
        <div className="grid border-b border-[#e5e4e0] px-5 py-3" style={{ gridTemplateColumns: GRID }}>
          {['Company', 'Role', 'Stage', 'Days', 'Follow-up', ''].map((c, i) => (
            <span key={i} className="text-[10px] text-[#6b6b6b] uppercase tracking-widest" style={mono}>{c}</span>
          ))}
        </div>

        {loading ? (
          <div className="px-5 py-16 text-center text-sm text-[#b0aeaa]" style={mono}>loading…</div>
        ) : error ? (
          <div className="px-5 py-16 text-center text-sm text-[#ef4444]" style={mono}>{error}</div>
        ) : apps.length === 0 ? (
          <div className="px-5 py-16 text-center text-sm text-[#b0aeaa]" style={mono}>
            no applications yet — add your first one to start tracking
          </div>
        ) : (
          apps.map(app => {
            const meta = stageMeta(app.stage)
            const days = daysSince(app.appliedAt)
            const needsFollowUp = app.stage !== 'OFFER' && days >= 7
            return (
              <div
                key={app.id}
                className="grid items-center px-5 py-3 border-b border-[#f0efed] last:border-0 group"
                style={{ gridTemplateColumns: GRID }}
              >
                <span className="text-[13px] font-medium text-[#1c1c1e] truncate pr-2" style={mono}>{app.company}</span>
                <span className="text-[13px] text-[#6b6b6b] truncate pr-2" style={mono}>{app.role}</span>
                <span>
                  <span
                    className="inline-flex items-center gap-1.5 pl-2 pr-1.5 py-1 rounded text-[11px] font-medium"
                    style={{ color: meta.color, background: meta.bg }}
                  >
                    <span className="w-1.5 h-1.5 rounded-full" style={{ background: meta.color }} />
                    <select
                      value={app.stage}
                      onChange={e => updateStage(app.id, e.target.value as Stage)}
                      aria-label="Change stage"
                      className="appearance-none bg-transparent border-0 cursor-pointer focus:outline-none"
                      style={{ ...mono, color: meta.color, fontWeight: 500, fontSize: '11px' }}
                    >
                      {STAGES.map(s => (
                        <option key={s.value} value={s.value} style={{ color: '#1c1c1e', background: '#fff' }}>
                          {s.label}
                        </option>
                      ))}
                    </select>
                    <span className="text-[8px] opacity-60">▾</span>
                  </span>
                </span>
                <span className="text-[12px] text-[#6b6b6b]" style={mono}>{days}d</span>
                <span className="text-[11px]" style={{ ...mono, color: needsFollowUp ? '#ef4444' : '#b0aeaa' }}>
                  {needsFollowUp ? '⚡ follow up' : '— on track'}
                </span>
                <button
                  onClick={() => deleteApp(app.id)}
                  className="text-[#b0aeaa] hover:text-[#ef4444] text-sm opacity-0 group-hover:opacity-100 transition-opacity justify-self-end"
                  aria-label="Delete"
                >
                  ✕
                </button>
              </div>
            )
          })
        )}
      </div>
    </div>
  )
}
