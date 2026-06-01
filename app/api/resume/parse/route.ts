import { auth } from '@clerk/nextjs/server'
import { NextResponse } from 'next/server'

const BASE = process.env.BACKEND_URL ?? 'http://localhost:8080'

/**
 * Multipart proxy for resume file uploads. Unlike the JSON proxyToBackend helper,
 * this forwards the multipart form body (letting fetch set the boundary) along with
 * the verified Clerk token.
 */
export async function POST(request: Request) {
  const { userId, getToken } = await auth()
  if (!userId) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }
  const token = await getToken()
  if (!token) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  let form: FormData
  try {
    form = await request.formData()
  } catch {
    return NextResponse.json({ error: 'Invalid upload' }, { status: 400 })
  }

  let res: Response
  try {
    res = await fetch(`${BASE}/api/resume/parse`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${token}` }, // no Content-Type: fetch sets the multipart boundary
      body: form,
      cache: 'no-store',
    })
  } catch {
    return NextResponse.json(
      { error: 'Backend unavailable. Is the API running on ' + BASE + '?' },
      { status: 502 },
    )
  }

  const body = await res.text()
  return new NextResponse(body, {
    status: res.status,
    headers: { 'Content-Type': res.headers.get('Content-Type') ?? 'application/json' },
  })
}
