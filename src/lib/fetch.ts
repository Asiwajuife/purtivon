/**
 * Safe fetch utilities
 *
 * These wrappers ensure API calls in server components never crash the page:
 * - Always check res.ok before parsing
 * - Always verify Content-Type is JSON before calling .json()
 * - Always catch network errors and return a typed fallback
 */

type FetchOptions = RequestInit & {
  revalidate?: number | false
  tags?: string[]
}

/** Base URL for internal API calls in server components */
export function getBaseUrl(): string {
  if (process.env.NEXT_PUBLIC_APP_URL) {
    return process.env.NEXT_PUBLIC_APP_URL
  }
  // Vercel preview deployments
  if (process.env.VERCEL_URL) {
    return `https://${process.env.VERCEL_URL}`
  }
  return 'http://localhost:3000'
}

/**
 * Fetch JSON from an internal API route.
 * Returns { data, error } — never throws.
 */
export async function fetchJSON<T>(
  path: string,
  options: FetchOptions = {}
): Promise<{ data: T | null; error: string | null }> {
  const { revalidate, tags, ...init } = options

  const nextOpts: RequestInit['next'] = {}
  if (revalidate !== undefined) nextOpts.revalidate = revalidate
  if (tags?.length)             nextOpts.tags = tags

  try {
    const url = path.startsWith('http') ? path : `${getBaseUrl()}${path}`

    const res = await fetch(url, {
      ...init,
      next: Object.keys(nextOpts).length ? nextOpts : undefined,
      headers: {
        Accept: 'application/json',
        ...init.headers,
      },
    })

    if (!res.ok) {
      const text = await res.text().catch(() => '')
      console.error(`[fetchJSON] ${res.status} ${res.statusText} — ${url}\n${text.slice(0, 200)}`)
      return { data: null, error: `HTTP ${res.status}` }
    }

    const contentType = res.headers.get('content-type') ?? ''
    if (!contentType.includes('application/json')) {
      console.error(`[fetchJSON] Non-JSON content-type "${contentType}" from ${url}`)
      return { data: null, error: 'Non-JSON response' }
    }

    const data = (await res.json()) as T
    return { data, error: null }
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err)
    console.error(`[fetchJSON] Network error: ${message}`)
    return { data: null, error: message }
  }
}
