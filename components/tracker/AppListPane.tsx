'use client'

import { useRef } from 'react'
import type { Application } from './types'
import { isOverdue } from './types'
import MiniPipeline from './MiniPipeline'

const PAGE_SIZE = 8

const inputStyle: React.CSSProperties = {
  background: 'var(--ws-surface)',
  border: '1px solid var(--ws-border)',
  borderRadius: 8,
  color: 'var(--ws-text)',
  fontSize: 12,
}

export default function AppListPane({
  apps,
  total,
  selected,
  onSelect,
  search,
  setSearch,
  sort,
  setSort,
  filter,
  setFilter,
  page,
  setPage,
  overdueCount,
  onNew,
  searchRef,
}: {
  apps: Application[]
  total: number
  selected: Application | null
  onSelect: (a: Application) => void
  search: string
  setSearch: (s: string) => void
  sort: string
  setSort: (s: string) => void
  filter: string
  setFilter: (s: string) => void
  page: number
  setPage: (n: number) => void
  overdueCount: number
  onNew: () => void
  searchRef: React.RefObject<HTMLInputElement | null>
}) {
  const pages = Math.max(1, Math.ceil(apps.length / PAGE_SIZE))
  const start = page * PAGE_SIZE
  const slice = apps.slice(start, start + PAGE_SIZE)

  const tab = (key: string, label: string, badge?: number) => (
    <button
      onClick={() => { setFilter(key); setPage(0) }}
      className="flex items-center gap-1.5 px-2.5 py-1 rounded text-[11px]"
      style={{
        background: filter === key ? 'var(--ws-surf2)' : 'transparent',
        color: filter === key ? 'var(--ws-text)' : 'var(--ws-muted)',
      }}
    >
      {label}
      {badge ? (
        <span style={{ width: 14, height: 14, borderRadius: 7, background: 'var(--ws-red)', color: '#fff', fontSize: 9, display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}>{badge}</span>
      ) : null}
    </button>
  )

  return (
    <div className="flex flex-col shrink-0" style={{ width: 280, background: 'var(--ws-bg2)', borderRight: '1px solid var(--ws-border)' }}>
      {/* Header */}
      <div style={{ padding: '18px 14px 10px' }}>
        <div className="flex items-center justify-between mb-3">
          <span style={{ fontFamily: 'var(--font-syne), sans-serif', fontSize: 14, fontWeight: 700, color: 'var(--ws-text)' }}>
            Applications
          </span>
          <button
            onClick={onNew}
            className="font-semibold"
            style={{ fontSize: 11, padding: '5px 10px', borderRadius: 6, background: 'var(--ws-accent)', color: 'var(--ws-aInk)' }}
          >
            + New
          </button>
        </div>

        <div className="relative mb-2">
          <span style={{ position: 'absolute', left: 9, top: '50%', transform: 'translateY(-50%)', color: 'var(--ws-muted)', fontSize: 12 }}>⌕</span>
          <input
            ref={searchRef}
            value={search}
            onChange={e => { setSearch(e.target.value); setPage(0) }}
            placeholder="Search…"
            className="w-full outline-none"
            style={{ ...inputStyle, padding: '7px 10px 7px 28px' }}
          />
        </div>

        <select value={sort} onChange={e => setSort(e.target.value)} className="w-full outline-none" style={{ ...inputStyle, padding: '7px 10px' }}>
          <option value="recent">Most recent</option>
          <option value="overdue">Overdue first</option>
          <option value="progress">By progress</option>
          <option value="az">A → Z</option>
        </select>
      </div>

      {/* Filter tabs */}
      <div className="flex items-center gap-1" style={{ padding: '0 12px 10px', borderBottom: '1px solid var(--ws-border)' }}>
        {tab('All', 'All')}
        {tab('Active', 'Active', overdueCount || undefined)}
        {tab('Rejected', 'Rejected')}
        <span className="ml-auto" style={{ fontSize: 10, color: 'var(--ws-muted2)' }}>{total}</span>
      </div>

      {/* List */}
      <div className="flex-1 overflow-y-auto" style={{ padding: '6px 8px' }}>
        {slice.length === 0 ? (
          <div style={{ padding: '32px 12px', textAlign: 'center', fontSize: 12, color: 'var(--ws-muted)' }}>no applications</div>
        ) : (
          slice.map(app => {
            const overdue = isOverdue(app)
            const isSel = selected?.id === app.id
            const rejected = app.appStatus === 'rejected'
            const current = app.pipeline.find(s => s.status === 'current')
            return (
              <button
                key={app.id}
                onClick={() => onSelect(app)}
                className="w-full text-left flex items-center gap-2.5"
                style={{
                  borderRadius: 9, marginBottom: 2, padding: '9px 10px',
                  background: isSel ? 'var(--ws-surface)' : overdue ? 'rgba(248,113,113,0.04)' : 'transparent',
                  border: isSel ? '1px solid var(--ws-border)' : overdue ? '1px solid rgba(248,113,113,0.12)' : '1px solid transparent',
                  opacity: rejected ? 0.7 : 1,
                }}
              >
                <span
                  style={{
                    width: 32, height: 32, borderRadius: 8, flexShrink: 0,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontFamily: 'var(--font-syne), sans-serif', fontSize: 13, fontWeight: 700,
                    background: isSel ? 'rgba(240,193,75,0.12)' : rejected ? 'rgba(248,113,113,0.08)' : 'var(--ws-surf2)',
                    color: isSel ? 'var(--ws-accent)' : rejected ? 'var(--ws-red)' : 'var(--ws-muted)',
                  }}
                >
                  {app.company.charAt(0).toUpperCase()}
                </span>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-1.5">
                    <span
                      className="truncate"
                      style={{ fontSize: 12, fontWeight: isSel ? 600 : 400, color: 'var(--ws-text)', textDecoration: rejected ? 'line-through' : 'none' }}
                    >
                      {app.company}
                    </span>
                    {overdue && <span style={{ color: 'var(--ws-red)', fontSize: 9 }}>⚡</span>}
                  </div>
                  <div className="flex items-center gap-2 mt-1">
                    <span style={{ fontSize: 9, padding: '1px 5px', borderRadius: 3, background: 'var(--ws-surf2)', color: 'var(--ws-muted)' }}>
                      {current?.label ?? '—'}
                    </span>
                    <MiniPipeline pipeline={app.pipeline} />
                  </div>
                </div>
              </button>
            )
          })
        )}
      </div>

      {/* Pagination */}
      {pages > 1 && (
        <div className="flex items-center justify-between" style={{ padding: '10px 14px 16px', borderTop: '1px solid var(--ws-border)' }}>
          <span style={{ fontSize: 10, color: 'var(--ws-muted2)' }}>
            {start + 1}–{Math.min(start + PAGE_SIZE, apps.length)} of {apps.length}
          </span>
          <div className="flex items-center gap-1">
            <PageBtn label="‹" disabled={page === 0} onClick={() => setPage(Math.max(0, page - 1))} />
            {Array.from({ length: pages }).map((_, i) => (
              <PageBtn key={i} label={String(i + 1)} active={i === page} onClick={() => setPage(i)} />
            ))}
            <PageBtn label="›" disabled={page >= pages - 1} onClick={() => setPage(Math.min(pages - 1, page + 1))} />
          </div>
        </div>
      )}
    </div>
  )
}

function PageBtn({ label, active, disabled, onClick }: { label: string; active?: boolean; disabled?: boolean; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      style={{
        width: 28, height: 28, borderRadius: 6, fontSize: 11,
        background: active ? 'rgba(240,193,75,0.1)' : 'transparent',
        border: active ? '1px solid rgba(240,193,75,0.35)' : '1px solid transparent',
        color: active ? 'var(--ws-accent)' : 'var(--ws-muted)',
        opacity: disabled ? 0.3 : 1,
      }}
    >
      {label}
    </button>
  )
}
