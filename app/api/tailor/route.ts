import { proxyToBackend } from '@/lib/backend'

// Claude calls (and a cold-starting backend) can take a while — give the
// serverless function room so it doesn't time out at the default ~10s.
export const maxDuration = 60

export async function POST(request: Request) {
  const body = await request.text()
  return proxyToBackend('/api/tailor', { method: 'POST', body })
}
