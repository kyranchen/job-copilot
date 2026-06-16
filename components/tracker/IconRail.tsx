'use client'

import { UserButton } from '@clerk/nextjs'

type Mode = 'overview' | 'workspace'

const navBtn = (active: boolean): React.CSSProperties => ({
  width: 40,
  height: 40,
  borderRadius: 10,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  fontSize: 18,
  cursor: 'pointer',
  border: 'none',
  background: active ? 'var(--ws-surface)' : 'transparent',
  color: active ? 'var(--ws-accent)' : 'var(--ws-muted)',
  boxShadow: active ? 'inset 0 0 0 1px var(--ws-border)' : 'none',
})

export default function IconRail({
  mode,
  setMode,
  overdueCount,
}: {
  mode: Mode
  setMode: (m: Mode) => void
  overdueCount: number
}) {
  return (
    <div
      className="flex flex-col items-center shrink-0"
      style={{ width: 64, gap: 6, padding: '18px 0', background: 'var(--ws-bg2)', borderRight: '1px solid var(--ws-border)' }}
    >
      {/* Logo mark */}
      <div
        style={{
          width: 36, height: 36, borderRadius: 10, marginBottom: 20,
          background: 'rgba(240,193,75,0.12)', border: '1px solid rgba(240,193,75,0.25)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}
      >
        <span style={{ width: 8, height: 8, borderRadius: '50%', background: 'var(--ws-accent)', boxShadow: '0 0 8px rgba(240,193,75,0.5)' }} />
      </div>

      <button style={navBtn(mode === 'overview')} onClick={() => setMode('overview')} title="Overview">⊞</button>
      <button style={navBtn(mode === 'workspace')} onClick={() => setMode('workspace')} title="Applications">≡</button>
      <button style={navBtn(false)} title="Settings (coming soon)">◈</button>

      <div className="flex-1" />

      {/* Notifications */}
      <button style={{ ...navBtn(false), position: 'relative', color: overdueCount > 0 ? 'var(--ws-amber)' : 'var(--ws-muted)' }} title={`${overdueCount} need follow-up`}>
        ◎
        {overdueCount > 0 && (
          <span
            style={{
              position: 'absolute', top: 4, right: 4, minWidth: 14, height: 14, padding: '0 3px',
              borderRadius: 7, background: 'var(--ws-red)', color: '#fff', fontSize: 9,
              display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700,
            }}
          >
            {overdueCount}
          </span>
        )}
      </button>

      <div style={{ marginTop: 6 }}>
        <UserButton appearance={{ elements: { avatarBox: 'w-[34px] h-[34px]' } }} />
      </div>
    </div>
  )
}
