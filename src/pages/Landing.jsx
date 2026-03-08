import { useEffect, useState } from 'react'
import { createTour, listTours } from '../services/tourService'

export default function Landing({ navigate }) {
  const [tours, setTours] = useState([])
  const [busy, setBusy] = useState(false)

  useEffect(() => {
    listTours().then(setTours).catch(() => setTours([]))
  }, [])

  const handleCreate = async () => {
    setBusy(true)
    try {
      const slug = `tour-${Date.now()}`
      const created = await createTour({ title: 'Untitled Tour', slug, scene_type: 'image' })
      navigate(`/editor/${created.id}`)
    } finally {
      setBusy(false)
    }
  }

  return (
    <main className="page shell">
      <h1>Crave Adventures</h1>
      <p className="subtitle">by Crave EdVentures</p>
      <button type="button" onClick={handleCreate} disabled={busy}>Create New Tour</button>

      <section>
        <h2>Existing Tours</h2>
        <ul className="simple-list">
          {tours.map((tour) => (
            <li key={tour.id}>
              <strong>{tour.title}</strong>
              <div className="row gap-8">
                <button type="button" onClick={() => navigate(`/editor/${tour.id}`)}>Edit</button>
                <button type="button" onClick={() => navigate(`/tour/${tour.slug}`)}>View</button>
              </div>
            </li>
          ))}
        </ul>
      </section>
    </main>
  )
}
