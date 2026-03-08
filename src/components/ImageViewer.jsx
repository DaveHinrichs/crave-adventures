import HotspotMarker from './HotspotMarker'

export default function ImageViewer({ sceneUrl, hotspots, onSceneClick, onHotspotClick, activeHotspotId, presentation }) {
  const handleClick = (event) => {
    const rect = event.currentTarget.getBoundingClientRect()
    const x = ((event.clientX - rect.left) / rect.width) * 100
    const y = ((event.clientY - rect.top) / rect.height) * 100
    onSceneClick?.({ x, y })
  }

  return (
    <section className="viewer-shell" onClick={handleClick}>
      <img className="scene-image" src={sceneUrl} alt="Tour scene" />
      <div className="marker-layer">
        {hotspots.map((hotspot) => (
          <HotspotMarker
            key={hotspot.id || `${hotspot.x}-${hotspot.y}`}
            hotspot={hotspot}
            isActive={activeHotspotId === hotspot.id}
            presentation={presentation}
            onClick={() => onHotspotClick(hotspot.id)}
          />
        ))}
      </div>
    </section>
  )
}
