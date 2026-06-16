'use client'

import { useState } from 'react'
import type { Application, BackendStage } from './types'
import { isOverdue, doneCount } from './types'
import { JobDetailsStep, TailorStep, AtsStep, CoverLetterStep, TrackStageStep } from './steps'

const STEP_TABS = ['Job Details', 'Tailor Resume', 'ATS Score', 'Cover Letter', 'Track Stage']

export default function WorkspacePane({
  app,
  onAdvance,
  onReject,
  onArchive,
}: {
  app: Application | null
  onAdvance: (id: string, stage: BackendStage) => void
  onReject: (id: string) => void
  onArchive: (id: string) => void
}) {
  if (!app) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center" style={{ background: 'var(--ws-bg)' }}>
        <div style={{ width: 64, height: 64, borderRadius: 14, border: '1px dashed rgba(240,193,75,0.4)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 26, color: 'var(--ws-accent)', marginBottom: 16 }}>◫</div>
        <p style={{ fontFamily: 'var(--font-syne), sans-serif', fontSize: 18, fontWeight: 700, color: 'var(--ws-text)' }}>Select an application</p>
        <p style={{ fontSize: 12, color: 'var(--ws-muted)', marginTop: 4 }}>Pick one from the list, or add a new one.</p>
      </div>
    )
  }
  return <AppDetail key={app.id} app={app} onAdvance={onAdvance} onReject={onReject} onArchive={onArchive} />
}

function AppDetail({
  app, onAdvance, onReject, onArchive,
}: {
  app: Application
  onAdvance: (id: string, stage: BackendStage) => void
  onReject: (id: string) => void
  onArchive: (id: string) => void
}) {
  const [step, setStep] = useState(0)
  const [jd, setJd] = useState('')
  const [resume, setResume] = useState('')

  const overdue = isOverdue(app)
  const rejected = app.appStatus === 'rejected'
  const current = app.pipeline.find(s => s.status === 'current')

  return (
    <div className="flex-1 flex flex-col min-w-0" style={{ background: 'var(--ws-bg)' }}>
      {/* Header */}
      <div style={{ padding: '16px 28px 0', borderBottom: '1px solid var(--ws-border)' }}>
        <div className="flex items-start gap-3">
          <span style={{
            width: 40, height: 40, borderRadius: 12, flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontFamily: 'var(--font-syne), sans-serif', fontSize: 17, fontWeight: 700,
            background: rejected ? 'rgba(248,113,113,0.08)' : 'rgba(240,193,75,0.12)', color: rejected ? 'var(--ws-red)' : 'var(--ws-accent)',
          }}>{app.company.charAt(0).toUpperCase()}</span>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <h1 style={{ fontFamily: 'var(--font-syne), sans-serif', fontSize: 20, fontWeight: 700, letterSpacing: '-0.03em', color: 'var(--ws-text)' }}>
                {app.company} — {app.role}
              </h1>
              {rejected && <span style={{ fontSize: 11, color: 'var(--ws-red)', background: 'rgba(248,113,113,0.1)', border: '1px solid rgba(248,113,113,0.25)', borderRadius: 5, padding: '2px 8px' }}>rejected</span>}
            </div>
            <div className="flex items-center gap-3 mt-1" style={{ fontSize: 11, color: 'var(--ws-muted)' }}>
              <span>{current?.label ?? '—'}</span>
              <span>· {app.days}d ago</span>
              {overdue && <span style={{ color: 'var(--ws-red)' }}>· ⚡ follow up</span>}
              <span>· {doneCount(app)}/{app.pipeline.length} steps</span>
            </div>
          </div>
          <div className="flex items-center gap-2">
            {!rejected && (
              <button onClick={() => onReject(app.id)} style={{ fontSize: 11, padding: '6px 12px', borderRadius: 6, border: '1px solid rgba(248,113,113,0.3)', color: 'var(--ws-red)', background: 'transparent' }}>Mark Rejected</button>
            )}
            <button onClick={() => onArchive(app.id)} style={{ fontSize: 11, padding: '6px 12px', borderRadius: 6, border: '1px solid var(--ws-border)', color: 'var(--ws-muted)', background: 'transparent' }}>Archive</button>
          </div>
        </div>

        {/* Step tabs */}
        <div className="flex" style={{ marginTop: 14 }}>
          {STEP_TABS.map((label, i) => (
            <button
              key={label}
              onClick={() => setStep(i)}
              className="flex items-center gap-2"
              style={{
                padding: '10px 18px',
                borderBottom: step === i ? '2px solid var(--ws-accent)' : '2px solid transparent',
                color: step === i ? 'var(--ws-text)' : 'var(--ws-muted2)',
              }}
            >
              <span style={{
                width: 20, height: 20, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 10, fontWeight: 700,
                background: step === i ? 'var(--ws-accent)' : 'var(--ws-surf2)', color: step === i ? 'var(--ws-aInk)' : 'var(--ws-muted)',
              }}>{i + 1}</span>
              <span style={{ fontSize: 11 }}>{label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Step content (all mounted, toggled — preserves results across tabs) */}
      <div className="flex-1 overflow-y-auto" style={{ padding: '24px 28px' }}>
        <div style={{ display: step === 0 ? 'block' : 'none' }}><JobDetailsStep jd={jd} setJd={setJd} /></div>
        <div style={{ display: step === 1 ? 'block' : 'none' }}><TailorStep jd={jd} resume={resume} setResume={setResume} /></div>
        <div style={{ display: step === 2 ? 'block' : 'none' }}><AtsStep jd={jd} resume={resume} setResume={setResume} /></div>
        <div style={{ display: step === 3 ? 'block' : 'none' }}><CoverLetterStep jd={jd} resume={resume} setResume={setResume} /></div>
        <div style={{ display: step === 4 ? 'block' : 'none' }}><TrackStageStep app={app} onAdvance={s => onAdvance(app.id, s)} /></div>
      </div>
    </div>
  )
}
