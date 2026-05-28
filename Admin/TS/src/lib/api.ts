import { supabase } from '@/lib/supabase/client'

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? ''

export class ApiError extends Error {
  status: number
  body: unknown

  constructor(message: string, status: number, body: unknown) {
    super(message)
    this.name = 'ApiError'
    this.status = status
    this.body = body
  }
}

async function getAuthToken(): Promise<string | null> {
  const { data } = await supabase.auth.getSession()
  return data.session?.access_token ?? null
}

async function parseResponse<T>(res: Response): Promise<T> {
  const contentType = res.headers.get('content-type') ?? ''
  const isJson = contentType.includes('application/json')
  const body = isJson ? await res.json() : await res.text()

  if (!res.ok) {
    const message =
      (isJson && typeof body === 'object' && body && 'detail' in body && typeof (body as { detail: unknown }).detail === 'string'
        ? (body as { detail: string }).detail
        : null) ??
      (isJson && typeof body === 'object' && body && 'message' in body && typeof (body as { message: unknown }).message === 'string'
        ? (body as { message: string }).message
        : null) ??
      `Request failed with status ${res.status}`

    if (res.status === 401 && typeof window !== 'undefined') {
      console.error('[api] 401 from backend:', { url: res.url, detail: message, body })
      // Evitamos el loop: si ya estamos en sign-in (o auth/*), no re-redirigimos.
      const path = window.location.pathname
      if (!path.startsWith('/auth/')) {
        window.location.assign('/auth/sign-in')
      }
    }

    throw new ApiError(message, res.status, body)
  }

  return body as T
}

export interface ApiFetchOptions extends Omit<RequestInit, 'body'> {
  body?: unknown
  query?: Record<string, string | number | boolean | undefined | null>
}

function buildUrl(path: string, query?: ApiFetchOptions['query']) {
  const base = API_URL.replace(/\/$/, '')
  const url = new URL(`${base}${path.startsWith('/') ? path : `/${path}`}`)
  if (query) {
    Object.entries(query).forEach(([key, value]) => {
      if (value === undefined || value === null) return
      url.searchParams.set(key, String(value))
    })
  }
  return url.toString()
}

export async function apiFetch<T = unknown>(path: string, options: ApiFetchOptions = {}): Promise<T> {
  const { body, query, headers, ...rest } = options
  const token = await getAuthToken()

  const isFormData = typeof FormData !== 'undefined' && body instanceof FormData

  const finalHeaders: Record<string, string> = {
    Accept: 'application/json',
    'ngrok-skip-browser-warning': 'true',
    ...(isFormData ? {} : { 'Content-Type': 'application/json' }),
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...((headers as Record<string, string>) ?? {}),
  }

  const res = await fetch(buildUrl(path, query), {
    ...rest,
    headers: finalHeaders,
    body: body === undefined ? undefined : isFormData ? (body as FormData) : JSON.stringify(body),
  })

  return parseResponse<T>(res)
}

export const api = {
  get: <T = unknown>(path: string, options?: ApiFetchOptions) => apiFetch<T>(path, { ...options, method: 'GET' }),
  post: <T = unknown>(path: string, body?: unknown, options?: ApiFetchOptions) =>
    apiFetch<T>(path, { ...options, method: 'POST', body }),
  put: <T = unknown>(path: string, body?: unknown, options?: ApiFetchOptions) =>
    apiFetch<T>(path, { ...options, method: 'PUT', body }),
  patch: <T = unknown>(path: string, body?: unknown, options?: ApiFetchOptions) =>
    apiFetch<T>(path, { ...options, method: 'PATCH', body }),
  delete: <T = unknown>(path: string, options?: ApiFetchOptions) =>
    apiFetch<T>(path, { ...options, method: 'DELETE' }),
}