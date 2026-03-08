import { useCallback, useEffect, useMemo, useState } from 'react'
import PanoramaViewer from '../components/PanoramaViewer'
import ImageViewer from '../components/ImageViewer'
import Toolbar from '../components/Toolbar'
import HotspotCard from '../components/HotspotCard'
import HotspotEditor from '../components/HotspotEditor'
import HotspotList from '../components/HotspotList'
import { useAutosave } from '../hooks/useAutosave'
import { deleteHotspot, listHotspotsByTourId, upsertHotspot } from '../services/hotspotService'
import { getTourById, updateTour, uploadScene } from '../services/tourService'

export default function Editor({ navigate, tourId }) {
  const [tour, setTour] = useState(null)
  const [hotspots, setHotspots] = useState([])
  const [activeHotspotId, setActiveHotspotId] = useState(null)
  const [placementMode, setPlacementMode] = useState(false)
  const [editingHotspot, setEditingHotspot] = useState(null)
  const [presentation, setPresentation] = useState(false)

  useEffect(() => {
    Promise.all([getTourById(tourId), listHotspotsByTourId(tourId)]).then(([tourData, hotspotData]) => {
      setTour(tourData)
      setHotspots(hotspotData)
      setActiveHotspotId(hotspotData[0]?.id || null)
    })
  }, [tourId])

  const autosaveStatus = useAutosave(tour, async (value) => {
    if (!value) return
    await updateTour(tourId, {
      title: value.title,
      slug: value.slug,
      scene_type: value.scene_type,
      scene_url: value.scene_url,
    })
  })

  const onSceneClick = useCallback((coords) => {
    if (!placementMode) return

    const draft = {
      tour_id: tourId,
      x: coords.x,
      y: coords.y,
      yaw: coords.yaw,
      pitch: coords.pitch,
      order_index: hotspots.length,
    }

    setEditingHotspot(draft)
    setPlacementMode(false)
  }, [hotspots.length, placementMode, tourId])

  const onSaveHotspot = async (draft) => {
    const saved = await upsertHotspot(draft)
    setHotspots((prev) => {
      const exists = prev.find((item) => item.id === saved.id)
      if (!exists) return [...prev, saved]
      return prev.map((item) => item.id === saved.id ? saved : item)
    })
    setEditingHotspot(null)
    setActiveHotspotId(saved.id)
  }

  const duplicateActive = async () => {
    const current = hotspots.find((item) => item.id === activeHotspotId)
    if (!current) return
    const clone = { ...current, id: undefined, x: Math.min(current.x + 3, 95), y: Math.min(current.y + 3, 95) }
    const saved = await upsertHotspot(clone)
    setHotspots((prev) => [...prev, saved])
  }

  const deleteActive = async () => {
    if (!activeHotspotId) return
    await deleteHotspot(activeHotspotId)
    setHotspots((prev) => prev.filter((item) => item.id !== activeHotspotId))
    setActiveHotspotId(null)
  }

  const activeHotspot = useMemo(
    () => hotspots.find((item) => item.id === activeHotspotId) || null,
    [activeHotspotId, hotspots],
  )

  const onUploadScene = async (event) => {
    const file = event.target.files?.[0]
    if (!file) return
    const url = await uploadScene(file)
    setTour((prev) => ({ ...prev, scene_url: url }))
  }

  const Viewer = tour?.scene_type === 'panorama' ? PanoramaViewer : ImageViewer

  if (!tour) return <main className="page shell">Loading editor…</main>

  return (
    <main className={`page ${presentation ? 'presentation' : ''}`}>
      <Toolbar
        autosaveStatus={autosaveStatus}
        placementMode={placementMode}
        onAddHotspot={() => setPlacementMode((prev) => !prev)}
        onTogglePresentation={() => setPresentation((prev) => !prev)}
        presentation={presentation}
      />

      <section className="editor-layout">
        <div className="left-panel">
          <button type="button" onClick={() => navigate('/')}>← Home</button>
          <label>Title<input value={tour.title || ''} onChange={(e) => setTour((prev) => ({ ...prev, title: e.target.value }))} /></label>
          <label>Slug<input value={tour.slug || ''} onChange={(e) => setTour((prev) => ({ ...prev, slug: e.target.value }))} /></label>
          <label>Mode
            <select value={tour.scene_type || 'image'} onChange={(e) => setTour((prev) => ({ ...prev, scene_type: e.target.value }))}>
              <option value="panorama">360 Panorama</option>
              <option value="image">Flat Image</option>
            </select>
          </label>
          <label>Upload Background<input type="file" accept="image/*" onChange={onUploadScene} /></label>
          <div className="row gap-8">
            <button type="button" onClick={duplicateActive}>Duplicate Hotspot</button>
            <button type="button" onClick={deleteActive}>Delete Hotspot</button>
          </div>
        </div>

        <div className="viewer-panel">
          {tour.scene_url ? (
            <Viewer
              sceneUrl={tour.scene_url}
              hotspots={hotspots}
              activeHotspotId={activeHotspotId}
              onSceneClick={onSceneClick}
              onHotspotClick={setActiveHotspotId}
              presentation={presentation}
            />
          ) : <div className="empty-scene">Upload a scene image to start.</div>}

          <HotspotCard hotspot={activeHotspot} onClose={() => setActiveHotspotId(null)} />
          {!presentation ? (
            <HotspotList hotspots={hotspots} activeId={activeHotspotId} onSelect={setActiveHotspotId} />
          ) : null}
        </div>
      </section>

      {editingHotspot ? (
        <div className="modal-backdrop">
          <HotspotEditor
            hotspot={editingHotspot}
            onSave={onSaveHotspot}
            onCancel={() => setEditingHotspot(null)}
          />
        </div>
      ) : null}
    </main>
  )
}
