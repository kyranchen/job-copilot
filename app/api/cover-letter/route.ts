import { proxyToBackend } from '@/lib/backend'

export async function POST(request: Request) {
  const body = await request.text()
  return proxyToBackend('/api/cover-letter', { method: 'POST', body })
}
