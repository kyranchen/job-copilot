import type { PipelineStage } from './types'

/** Inline dot-and-connector pipeline indicator, used in the app list and overview. */
export default function MiniPipeline({ pipeline }: { pipeline: PipelineStage[] }) {
  return (
    <span className="inline-flex items-center">
      {pipeline.map((s, i) => {
        const color =
          s.status === 'done' ? 'var(--ws-teal)'
            : s.status === 'current' ? 'var(--ws-accent)'
            : s.status === 'rejected' ? 'var(--ws-red)'
            : 'transparent'
        const border = s.status === 'upcoming' ? '1px solid var(--ws-border)' : 'none'
        const size = s.status === 'current' ? 10 : 7
        const connectorColor =
          pipeline[i - 1]?.status === 'done' ? 'var(--ws-teal)'
            : pipeline[i - 1]?.status === 'rejected' ? 'var(--ws-red)'
            : 'var(--ws-border)'
        return (
          <span key={s.id} className="inline-flex items-center">
            {i > 0 && (
              <span style={{ width: 12, height: 1.5, background: connectorColor, display: 'inline-block' }} />
            )}
            <span
              style={{
                width: size,
                height: size,
                borderRadius: '50%',
                background: color,
                border,
                boxShadow: s.status === 'current' ? '0 0 6px rgba(240,193,75,0.3)' : 'none',
                display: 'inline-block',
              }}
            />
          </span>
        )
      })}
    </span>
  )
}
