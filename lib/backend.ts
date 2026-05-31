import { auth } from '@clerk/nextjs/server'
import { NextResponse } from 'next/server'

const BASE = process.env.BACKEND_URL ?? 'http://localhost:8080'

/**
 * Proxies a request to the Spring Boot backend, forwarding the Clerk session
 * token as a Bearer credential. The backend validates the JWT against Clerk's
 * JWKS and derives the user id from its `sub` claim — so identity is verified
 * cryptographically end to end, not trusted from a header.
 */
export async function proxyToBackend(path: string, init: RequestInit = {}): Promise<NextResponse> {
  const { userId, getToken } = await auth()
  if (!userId) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const token = await getToken()
  if (!token) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  let res: Response
  try {
    res = await fetch(`${BASE}${path}`, {
      ...init,
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
        ...init.headers,
      },
      cache: 'no-store',
    })
  } catch {
    return NextResponse.json(
      { error: 'Backend unavailable. Is the API running on ' + BASE + '?' },
      { status: 502 },
    )
  }

  if (res.status === 204) {
    return new NextResponse(null, { status: 204 })
  }

  const body = await res.text()
  return new NextResponse(body, {
    status: res.status,
    headers: { 'Content-Type': res.headers.get('Content-Type') ?? 'application/json' },
  })
}
