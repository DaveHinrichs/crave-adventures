import { useCallback, useEffect, useMemo, useState } from 'react'
import Landing from './pages/Landing'
import Editor from './pages/Editor'
import TourViewer from './pages/TourViewer'

function normalizePath(pathname) {
  if (!pathname) return '/'
  const withoutTrailingSlash = pathname !== '/' ? pathname.replace(/\/+$/, '') : pathname
  return withoutTrailingSlash || '/'
}

function matchRoute(pathname) {
  const normalized = normalizePath(pathname)
  if (normalized === '/') return { page: 'landing' }

  const editorMatch = normalized.match(/^\/editor\/([^/]+)$/)
  if (editorMatch) return { page: 'editor', tourId: decodeURIComponent(editorMatch[1]) }

  const tourMatch = normalized.match(/^\/tour\/([^/]+)$/)
  if (tourMatch) return { page: 'tour', slug: decodeURIComponent(tourMatch[1]) }

  return { page: 'not-found' }
}

export default function App() {
  const [pathname, setPathname] = useState(() => normalizePath(window.location.pathname))

  useEffect(() => {
    const onPopState = () => setPathname(normalizePath(window.location.pathname))
    window.addEventListener('popstate', onPopState)
    return () => window.removeEventListener('popstate', onPopState)
  }, [])

  const route = useMemo(() => matchRoute(pathname), [pathname])

  const navigate = useCallback((to) => {
    const nextPath = normalizePath(to)
    if (nextPath === pathname) return
    window.history.pushState({}, '', nextPath)
    setPathname(nextPath)
  }, [pathname])

  if (route.page === 'landing') return <Landing navigate={navigate} />
  if (route.page === 'editor') return <Editor navigate={navigate} tourId={route.tourId} />
  if (route.page === 'tour') return <TourViewer navigate={navigate} slug={route.slug} />

  return (
    <main className="page shell">
      <h1>Not Found</h1>
      <button type="button" className="btn btn-primary" onClick={() => navigate('/')}>Back to Home</button>
    </main>
  )
}
