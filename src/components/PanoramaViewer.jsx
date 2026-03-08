import { useEffect, useMemo, useRef } from 'react'
import HotspotMarker from './HotspotMarker'

const PANNELLUM_SCRIPT = 'https://cdn.jsdelivr.net/npm/pannellum@2.5.6/build/pannellum.js'
const PANNELLUM_CSS = 'https://cdn.jsdelivr.net/npm/pannellum@2.5.6/build/pannellum.css'

function loadPannellumAssets() {
  if (!document.querySelector(`script[src="${PANNELLUM_SCRIPT}"]`)) {
    const script = document.createElement('script')
    script.src = PANNELLUM_SCRIPT
    script.async = true
    document.body.appendChild(script)
  }

  if (!document.querySelector(`link[href="${PANNELLUM_CSS}"]`)) {
    const link = document.createElement('link')
    link.rel = 'stylesheet'
    link.href = PANNELLUM_CSS
    document.head.appendChild(link)
  }
}

export default function PanoramaViewer({ sceneUrl, hotspots, onSceneClick, onHotspotClick, activeHotspotId, presentation }) {
  const containerRef = useRef(null)
  const pannellumRef = useRef(null)

  useEffect(() => {
    loadPannellumAssets()
    const interval = setInterval(() => {
      if (window.pannellum && containerRef.current && sceneUrl && !pannellumRef.current) {
        pannellumRef.current = window.pannellum.viewer(containerRef.current, {
          type: 'equirectangular',
          panorama: sceneUrl,
          autoLoad: true,
          compass: false,
          showControls: !presentation,
        })
        clearInterval(interval)
      }
    }, 100)

    return () => clearInterval(interval)
  }, [presentation, sceneUrl])

  useEffect(() => {
    if (pannellumRef.current && sceneUrl) {
      pannellumRef.current.loadScene(undefined, undefined, undefined, sceneUrl)
    }
  }, [sceneUrl])

  const markerLayer = useMemo(
    () => hotspots.map((hotspot) => (
      <HotspotMarker
        key={hotspot.id || `${hotspot.x}-${hotspot.y}`}
        hotspot={hotspot}
        isActive={activeHotspotId === hotspot.id}
        presentation={presentation}
        onClick={() => onHotspotClick(hotspot.id)}
      />
    )),
    [activeHotspotId, hotspots, onHotspotClick, presentation],
  )

  const handleClick = (event) => {
    const rect = event.currentTarget.getBoundingClientRect()
    const x = ((event.clientX - rect.left) / rect.width) * 100
    const y = ((event.clientY - rect.top) / rect.height) * 100
    const yaw = x * 3.6 - 180
    const pitch = 90 - y * 1.8
    onSceneClick?.({ x, y, yaw, pitch })
  }

  return (
    <section className="viewer-shell" onClick={handleClick}>
      <div ref={containerRef} className="pannellum-container" />
      <div className="marker-layer">{markerLayer}</div>
    </section>
  )
}
