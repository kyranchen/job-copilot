// Frontend model for the tracker workspace. The backend persists company/role/stage;
// the richer fields (pipeline status, steps, appStatus) are derived or frontend-only for v1.

export type BackendStage = 'APPLIED' | 'PHONE_SCREEN' | 'TECHNICAL' | 'SYSTEM_DESIGN' | 'OFFER'

export const DEFAULT_STAGES: { key: BackendStage; label: string }[] = [
  { key: 'APPLIED', label: 'Applied' },
  { key: 'PHONE_SCREEN', label: 'Phone Screen' },
  { key: 'TECHNICAL', label: 'Technical' },
  { key: 'SYSTEM_DESIGN', label: 'System Design' },
  { key: 'OFFER', label: 'Offer' },
]

export type AppStatus = 'active' | 'rejected' | 'archived'
export type StageStatus = 'done' | 'current' | 'upcoming' | 'rejected'

export type PipelineStage = {
  id: string
  label: string
  key?: BackendStage
  status: StageStatus
}

export type Application = {
  id: string
  company: string
  role: string
  stage: BackendStage // persisted current stage
  createdAt: string
  days: number
  appStatus: AppStatus
  rejectedStage?: string
  steps: boolean[] // [jobDetails, tailor, ats, cover, track] — frontend-only
  pipeline: PipelineStage[]
}

type BackendApplication = {
  id: string
  company: string
  role: string
  stage: BackendStage
  createdAt: string
  updatedAt: string
  notes: string | null
}

export function daysSince(iso: string): number {
  return Math.max(0, Math.floor((Date.now() - Date.parse(iso)) / 86_400_000))
}

/** Build the default 5-stage pipeline with status relative to the current stage. */
export function buildPipeline(current: BackendStage, rejectedStage?: string): PipelineStage[] {
  const currentIdx = DEFAULT_STAGES.findIndex(s => s.key === current)
  return DEFAULT_STAGES.map((s, i) => {
    let status: StageStatus
    if (rejectedStage && s.label === rejectedStage) status = 'rejected'
    else if (i < currentIdx) status = 'done'
    else if (i === currentIdx) status = 'current'
    else status = 'upcoming'
    return { id: s.key, label: s.label, key: s.key, status }
  })
}

/** Map a backend record into the workspace Application model. */
export function fromBackend(raw: BackendApplication): Application {
  return {
    id: raw.id,
    company: raw.company,
    role: raw.role,
    stage: raw.stage,
    createdAt: raw.createdAt,
    days: daysSince(raw.createdAt),
    appStatus: 'active',
    steps: [false, false, false, false, false],
    pipeline: buildPipeline(raw.stage),
  }
}

/** Overdue: active, 7+ days, and not yet at Offer. */
export function isOverdue(app: Application): boolean {
  return app.appStatus === 'active' && app.days >= 7 && app.stage !== 'OFFER'
}

export function doneCount(app: Application): number {
  return app.pipeline.filter(s => s.status === 'done' || s.status === 'current').length
}
