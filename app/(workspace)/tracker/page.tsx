'use client'

import { useEffect, useMemo, useRef, useState } from 'react'
import IconRail from '@/components/tracker/IconRail'
import AppListPane from '@/components/tracker/AppListPane'
import WorkspacePane from '@/components/tracker/WorkspacePane'
import type { Application, AppStatus, PipelineStage } from '@/components/tracker/types'
import { fromBackend, isOverdue, doneCount } from '@/components/tracker/types'

export default function TrackerWorkspace() {
  const [apps, setApps] = useState<Application[]>([])
  const [selectedId, setSelectedId] = useState<string | null>(null)
  const [mode, setMode] = useState<'overview' | 'workspace'>('workspace')
  const [filter, setFilter] = useState('All')
  const [sort, setSort] = useState('recent')
  const [search, setSearch] = useState('')
  const [page, setPage] = useState(0)
  const [showNew, setShowNew] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const searchRef = useRef<HTMLInputElement | null>(null)

  useEffect(() => { load() }, [])

  async function load() {
    setError(null)
    try {
      const res = await fetch('/api/applications')
      if (!res.ok) throw new Error((await res.json().catch(() => ({}))).error ?? `Error ${res.status}`)
      const raw = await res.json()
      setApps(raw.map(fromBackend))
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Failed to load applications')
    }
  }

  const overdueCount = apps.filter(a => a.appStatus === 'active' && isOverdue(a)).length

  const visible = useMemo(() => {
    let list = apps.filter(a => a.appStatus !== 'archived')
    if (filter === 'Active') list = list.filter(a => a.appStatus === 'active')
    else if (filter === 'Rejected') list = list.filter(a => a.appStatus === 'rejected')
    if (search.trim()) {
      const q = search.toLowerCase()
      list = list.filter(a => a.company.toLowerCase().includes(q) || a.role.toLowerCase().includes(q))
    }
    const sorted = [...list]
    if (sort === 'recent') sorted.sort((a, b) => a.days - b.days)
    else if (sort === 'overdue') sorted.sort((a, b) => (Number(isOverdue(b)) - Number(isOverdue(a))) || (b.days - a.days))
    else if (sort === 'progress') sorted.sort((a, b) => doneCount(b) - doneCount(a))
    else if (sort === 'az') sorted.sort((a, b) => a.company.localeCompare(b.company))
    return sorted
  }, [apps, filter, sort, search])

  const selected = apps.find(a => a.id === selectedId) ?? null

  async function createApp(company: string, role: string) {
    try {
      const res = await fetch('/api/applications', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ company, role }),
      })
      if (!res.ok) throw new Error((await res.json().catch(() => ({}))).error ?? `Error ${res.status}`)
      const created = fromBackend(await res.json())
      setApps(prev => [created, ...prev])
      setSelectedId(created.id)
      setShowNew(false)
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Failed to create')
    }
  }

  async function updatePipeline(id: string, pipeline: PipelineStage[]) {
    setApps(prev => prev.map(a => a.id === id ? { ...a, pipeline } : a)) // optimistic
    await patch(id, { pipeline })
  }

  async function setStatus(id: string, appStatus: AppStatus) {
    setApps(prev => prev.map(a => a.id === id ? { ...a, appStatus } : a)) // optimistic
    if (appStatus === 'archived' && selectedId === id) setSelectedId(null)
    await patch(id, { appStatus })
  }

  async function patch(id: string, body: Record<string, unknown>) {
    try {
      const res = await fetch(`/api/applications/${id}`, {
        method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body),
      })
      if (!res.ok) throw new Error()
    } catch {
      load() // revert to server truth
    }
  }

  const reject = (id: string) => setStatus(id, 'rejected')
  const archive = (id: string) => setStatus(id, 'archived')

  return (
    <div className="tracker-ws flex" style={{ height: '100vh', overflow: 'hidden' }}>
      <IconRail mode={mode} setMode={setMode} overdueCount={overdueCount} />

      {mode === 'workspace' ? (
        <>
          <AppListPane
            apps={visible}
            total={apps.filter(a => a.appStatus !== 'archived').length}
            selected={selected}
            onSelect={a => setSelectedId(a.id)}
            search={search} setSearch={setSearch}
            sort={sort} setSort={setSort}
            filter={filter} setFilter={setFilter}
            page={page} setPage={setPage}
            overdueCount={overdueCount}
            onNew={() => setShowNew(true)}
            searchRef={searchRef}
          />
          <WorkspacePane app={selected} onUpdatePipeline={updatePipeline} onReject={reject} onArchive={archive} />
        </>
      ) : (
        <div className="flex-1 flex items-center justify-center" style={{ background: 'var(--ws-bg)' }}>
          <p style={{ fontSize: 13, color: 'var(--ws-muted)' }}>Overview dashboard — coming in the next pass</p>
        </div>
      )}

      {error && (
        <div style={{ position: 'fixed', bottom: 24, left: '50%', transform: 'translateX(-50%)', background: 'var(--ws-surface)', border: '1px solid var(--ws-border2)', borderRadius: 10, padding: '10px 16px', fontSize: 12, color: 'var(--ws-red)', zIndex: 900 }}>
          {error}
        </div>
      )}

      {showNew && <NewAppModal onClose={() => setShowNew(false)} onCreate={createApp} />}
    </div>
  )
}

function NewAppModal({ onClose, onCreate }: { onClose: () => void; onCreate: (c: string, r: string) => void }) {
  const [company, setCompany] = useState('')
  const [role, setRole] = useState('')
  const field: React.CSSProperties = { width: '100%', background: 'var(--ws-bg2)', border: '1px solid var(--ws-border)', borderRadius: 8, color: 'var(--ws-text)', fontSize: 13, padding: '9px 11px', outline: 'none' }
  return (
    <div onClick={onClose} style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.7)', zIndex: 800, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div onClick={e => e.stopPropagation()} style={{ width: 420, background: 'var(--ws-surface)', border: '1px solid var(--ws-border2)', borderRadius: 14, padding: 28, boxShadow: '0 8px 32px rgba(0,0,0,0.7)' }}>
        <h2 style={{ fontFamily: 'var(--font-syne), sans-serif', fontSize: 18, fontWeight: 700, color: 'var(--ws-text)', marginBottom: 16 }}>New application</h2>
        <div className="flex flex-col gap-3">
          <input autoFocus value={company} onChange={e => setCompany(e.target.value)} placeholder="Company" style={field} />
          <input value={role} onChange={e => setRole(e.target.value)} placeholder="Role" style={field} />
        </div>
        <div className="flex justify-end gap-2" style={{ marginTop: 20 }}>
          <button onClick={onClose} style={{ fontSize: 12, padding: '8px 14px', borderRadius: 8, color: 'var(--ws-muted)', background: 'transparent' }}>Cancel</button>
          <button
            onClick={() => onCreate(company.trim(), role.trim())}
            disabled={!company.trim() || !role.trim()}
            className="font-semibold"
            style={{ fontSize: 12, padding: '8px 16px', borderRadius: 8, background: 'var(--ws-accent)', color: 'var(--ws-aInk)', opacity: !company.trim() || !role.trim() ? 0.4 : 1 }}
          >
            Create
          </button>
        </div>
      </div>
    </div>
  )
}
