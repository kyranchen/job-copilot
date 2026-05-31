import { proxyToBackend } from '@/lib/backend'

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params
  const body = await request.text()
  return proxyToBackend(`/api/applications/${id}`, { method: 'PATCH', body })
}

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params
  return proxyToBackend(`/api/applications/${id}`, { method: 'DELETE' })
}
