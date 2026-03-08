import { useEffect, useMemo, useState } from 'react'
import Landing from './pages/Landing'
import Editor from './pages/Editor'
import TourViewer from './pages/TourViewer'

function matchRoute(pathname) {
  if (pathname === '/') return { page: 'landing' }

  const editorMatch = pathname.match(/^\/editor\/([^/]+)$/)
  if (editorMatch) return { page: 'editor', tourId: editorMatch[1] }

  const tourMatch = pathname.match(/^\/tour\/([^/]+)$/)
  if (tourMatch) return { page: 'tour', slug: tourMatch[1] }

  return { page: 'not-found' }
}

export default function App() {
  const [pathname, setPathname] = useState(window.location.pathname)

  useEffect(() => {
    const onPopState = () => setPathname(window.location.pathname)
    window.addEventListener('popstate', onPopState)
    return () => window.removeEventListener('popstate', onPopState)
  }, [])

  const route = useMemo(() => matchRoute(pathname), [pathname])

  const navigate = (to) => {
    if (to === window.location.pathname) return
    window.history.pushState({}, '', to)
    setPathname(to)
  }

  if (route.page === 'landing') return <Landing navigate={navigate} />
  if (route.page === 'editor') return <Editor navigate={navigate} tourId={route.tourId} />
  if (route.page === 'tour') return <TourViewer navigate={navigate} slug={route.slug} />

  return (
    <main className="page shell">
      <h1>Not Found</h1>
      <button onClick={() => navigate('/')}>Back to Home</button>
    </main>
  )
}
