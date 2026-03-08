import HotspotMarker from './HotspotMarker'

export default function ImageViewer({
  sceneUrl,
  hotspots,
  onSceneClick,
  onHotspotClick,
  onHotspotMove,
  onHotspotMoveEnd,
  activeHotspotId,
  presentation,
  editable = false,
}) {
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
            editable={editable}
            onClick={() => onHotspotClick?.(hotspot.id)}
            onMove={(coords) => onHotspotMove?.(hotspot.id, coords)}
            onMoveEnd={(coords) => onHotspotMoveEnd?.(hotspot.id, coords)}
          />
        ))}
      </div>
    </section>
  )
}
