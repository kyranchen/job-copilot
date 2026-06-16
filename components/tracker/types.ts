// Frontend model for the tracker workspace. The backend now persists the full
// per-application pipeline + appStatus, so these map straight through.

export type StageStatus = 'done' | 'current' | 'upcoming' | 'rejected'
export type AppStatus = 'active' | 'rejected' | 'archived'

export type PipelineStage = {
  id: string
  label: string
  status: StageStatus
}

export type Application = {
  id: string
  company: string
  role: string
  appStatus: AppStatus
  pipeline: PipelineStage[]
  createdAt: string
  days: number
  notes: string | null
}

type BackendApplication = {
  id: string
  company: string
  role: string
  pipeline?: PipelineStage[]
  appStatus?: AppStatus
  createdAt: string
  updatedAt: string
  notes: string | null
}

const DEFAULT_LABELS = ['Applied', 'Phone Screen', 'Technical', 'System Design', 'Offer']

export function defaultPipeline(): PipelineStage[] {
  return DEFAULT_LABELS.map((label, i) => ({
    id: crypto.randomUUID(),
    label,
    status: i === 0 ? 'current' : 'upcoming',
  }))
}

export function daysSince(iso: string): number {
  return Math.max(0, Math.floor((Date.now() - Date.parse(iso)) / 86_400_000))
}

export function fromBackend(raw: BackendApplication): Application {
  return {
    id: raw.id,
    company: raw.company,
    role: raw.role,
    appStatus: raw.appStatus ?? 'active',
    pipeline: raw.pipeline && raw.pipeline.length ? raw.pipeline : defaultPipeline(),
    createdAt: raw.createdAt,
    days: daysSince(raw.createdAt),
    notes: raw.notes ?? null,
  }
}

export function currentStage(pipeline: PipelineStage[]): PipelineStage | undefined {
  return pipeline.find(s => s.status === 'current')
}

/** Overdue: active, 7+ days, and the current stage isn't the last one. */
export function isOverdue(app: Application): boolean {
  if (app.appStatus !== 'active' || app.days < 7) return false
  const idx = app.pipeline.findIndex(s => s.status === 'current')
  return idx >= 0 && idx < app.pipeline.length - 1
}

export function doneCount(app: Application): number {
  return app.pipeline.filter(s => s.status === 'done' || s.status === 'current').length
}

/** Recompute statuses so stage `index` is current (prior = done, after = upcoming). */
export function withCurrent(pipeline: PipelineStage[], index: number): PipelineStage[] {
  return pipeline.map((s, i) => ({
    ...s,
    status: i < index ? 'done' : i === index ? 'current' : 'upcoming',
  }))
}
