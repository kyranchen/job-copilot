import { proxyToBackend } from '@/lib/backend'

export const maxDuration = 60

export async function POST(request: Request) {
  const body = await request.text()
  return proxyToBackend('/api/jd/fetch', { method: 'POST', body })
}
