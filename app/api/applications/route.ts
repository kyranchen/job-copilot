import { proxyToBackend } from '@/lib/backend'

export async function GET() {
  return proxyToBackend('/api/applications')
}

export async function POST(request: Request) {
  const body = await request.text()
  return proxyToBackend('/api/applications', { method: 'POST', body })
}
