import { api } from '@/lib/api'

export type RagScope = 'tours' | 'variants' | 'destinations' | 'policies' | 'faqs' | 'company'

// Fire-and-forget resync. Failures are logged but do not block the UI flow,
// because the catalog write already succeeded — the RAG index is downstream.
export function resyncRag(scope: RagScope): Promise<void> {
  return api
    .post<void>(`/admin/rag/resync/${scope}`)
    .catch((err) => {
      console.warn(`[rag] resync ${scope} failed`, err)
    })
}