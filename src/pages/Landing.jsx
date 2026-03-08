import { useEffect, useState } from 'react'
import { createTour, listTours } from '../services/tourService'

function createNewTourSlug() {
  const suffix = `${Date.now()}-${Math.floor(Math.random() * 1000)}`
  return `untitled-tour-${suffix}`
}

export default function Landing({ navigate }) {
  const [tours, setTours] = useState([])
  const [busy, setBusy] = useState(false)
  const [loading, setLoading] = useState(true)
  const [errorMessage, setErrorMessage] = useState('')

  useEffect(() => {
    async function loadTours() {
      try {
        setLoading(true)
        const data = await listTours()
        setTours(data)
      } catch {
        setErrorMessage('Unable to load tours right now. Please refresh and try again.')
        setTours([])
      } finally {
        setLoading(false)
      }
    }

    loadTours()
  }, [])

  const handleCreate = async () => {
    setBusy(true)
    setErrorMessage('')

    try {
      const created = await createTour({
        title: 'Untitled Tour',
        slug: createNewTourSlug(),
        scene_type: 'image',
        scene_url: null,
      })

      setTours((prev) => [created, ...prev])
      navigate(`/editor/${encodeURIComponent(created.id)}`)
    } catch {
      setErrorMessage('Could not create a new tour. Please check your Supabase setup and try again.')
    } finally {
      setBusy(false)
    }
  }

  return (
    <main className="page shell landing-page">
      <section className="hero-card">
        <p className="hero-eyebrow">Crave EdVentures</p>
        <h1>Build interactive tours in minutes</h1>
        <p className="hero-copy">
          Create educational adventures with hotspots, media, and shareable links.
          Start with a blank tour or continue editing an existing one.
        </p>

        <div className="row gap-8">
          <button type="button" className="btn btn-primary" onClick={handleCreate} disabled={busy}>
            {busy ? 'Creating…' : 'Create New Tour'}
          </button>
        </div>

        {errorMessage ? <p className="inline-error">{errorMessage}</p> : null}
      </section>

      <section className="tours-section">
        <div className="section-header">
          <h2>Your Tours</h2>
          <p>Jump back into any tour to edit or preview.</p>
        </div>

        {loading ? <p>Loading tours…</p> : null}

        {!loading && tours.length === 0 ? (
          <div className="empty-state">
            <h3>No tours yet</h3>
            <p>Click “Create New Tour” to start your first interactive experience.</p>
          </div>
        ) : null}

        {!loading && tours.length > 0 ? (
          <ul className="simple-list">
            {tours.map((tour) => (
              <li key={tour.id}>
                <div>
                  <strong>{tour.title || 'Untitled Tour'}</strong>
                  <p className="tour-meta">/{tour.slug}</p>
                </div>
                <div className="row gap-8">
                  <button type="button" className="btn btn-secondary" onClick={() => navigate(`/editor/${encodeURIComponent(tour.id)}`)}>Edit</button>
                  <button type="button" className="btn btn-ghost" onClick={() => navigate(`/tour/${encodeURIComponent(tour.slug)}`)}>View</button>
                </div>
              </li>
            ))}
          </ul>
        ) : null}
      </section>
    </main>
  )
}
