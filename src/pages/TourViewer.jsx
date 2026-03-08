import { useEffect, useMemo, useState } from 'react'
import PanoramaViewer from '../components/PanoramaViewer'
import ImageViewer from '../components/ImageViewer'
import HotspotCard from '../components/HotspotCard'
import HotspotList from '../components/HotspotList'
import { listHotspotsByTourId } from '../services/hotspotService'
import { getTourBySlug } from '../services/tourService'

export default function TourViewer({ navigate, slug }) {
  const [tour, setTour] = useState(null)
  const [hotspots, setHotspots] = useState([])
  const [activeHotspotId, setActiveHotspotId] = useState(null)
  const [presentation, setPresentation] = useState(false)
  const [showSidebar, setShowSidebar] = useState(true)

  useEffect(() => {
    async function load() {
      const tourData = await getTourBySlug(slug)
      setTour(tourData)
      const hotspotData = await listHotspotsByTourId(tourData.id)
      setHotspots(hotspotData)
      setActiveHotspotId(hotspotData[0]?.id || null)
    }
    load()
  }, [slug])

  const activeIndex = hotspots.findIndex((item) => item.id === activeHotspotId)

  useEffect(() => {
    const onKeyDown = (event) => {
      if (!presentation) return
      if (event.key === 'Escape') setPresentation(false)
      if (event.key === 'ArrowRight' && hotspots.length) {
        const next = hotspots[(activeIndex + 1) % hotspots.length]
        setActiveHotspotId(next.id)
      }
      if (event.key === 'ArrowLeft' && hotspots.length) {
        const prev = hotspots[(activeIndex - 1 + hotspots.length) % hotspots.length]
        setActiveHotspotId(prev.id)
      }
    }

    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [activeIndex, hotspots, presentation])

  const activeHotspot = useMemo(
    () => hotspots.find((item) => item.id === activeHotspotId) || null,
    [activeHotspotId, hotspots],
  )

  if (!tour) return <main className="page shell">Loading tour…</main>

  const Viewer = tour.scene_type === 'panorama' ? PanoramaViewer : ImageViewer

  return (
    <main className={`page ${presentation ? 'presentation' : ''}`}>
      <header className="toolbar">
        <button onClick={() => navigate('/')} type="button">← Home</button>
        <h2>{tour.title}</h2>
        <div className="row gap-8">
          <button type="button" onClick={() => setShowSidebar((prev) => !prev)}>{showSidebar ? 'Hide' : 'Show'} Hotspot List</button>
          <button type="button" onClick={() => setPresentation((prev) => !prev)}>{presentation ? 'Exit Presentation' : 'Presentation Mode'}</button>
        </div>
      </header>

      <section className="viewer-only-layout">
        <Viewer
          sceneUrl={tour.scene_url}
          hotspots={hotspots}
          activeHotspotId={activeHotspotId}
          onHotspotClick={setActiveHotspotId}
          presentation={presentation}
        />

        <HotspotCard hotspot={activeHotspot} onClose={() => setActiveHotspotId(null)} />
        {showSidebar && !presentation ? (
          <HotspotList hotspots={hotspots} activeId={activeHotspotId} onSelect={setActiveHotspotId} />
        ) : null}
      </section>
    </main>
  )
}
