import { useRef } from 'react'

const clamp = (value, min, max) => Math.min(max, Math.max(min, value))

export default function HotspotMarker({
  hotspot,
  isActive = false,
  presentation = false,
  editable = false,
  onClick,
  onMove,
  onMoveEnd,
}) {
  const skipClickRef = useRef(false)
  const defaultSize = presentation ? 28 : 18
  const width = hotspot.width ?? defaultSize
  const height = hotspot.height ?? defaultSize
  const textPosition = hotspot.text_position || 'below'
  const borderWidth = hotspot.marker_border_width ?? 2
  const borderColor = hotspot.marker_border_color || '#ffffff'

  const style = {
    left: `${hotspot.x}%`,
    top: `${hotspot.y}%`,
    width: `${width}px`,
    height: `${height}px`,
    opacity: hotspot.opacity ?? 1,
  }

  const classNames = [
    'hotspot-marker',
    `shape-${hotspot.marker_shape || 'circle'}`,
    hotspot.marker_border ? 'with-border' : '',
    hotspot.marker_pulse ? 'pulse' : '',
    isActive ? 'active' : '',
  ].join(' ')

  const handlePointerDown = (event) => {
    if (!editable || !onMove) return
    event.preventDefault()
    event.stopPropagation()

    const container = event.currentTarget.closest('.viewer-shell')
    if (!container) return

    const rect = container.getBoundingClientRect()
    const startPoint = { x: event.clientX, y: event.clientY }
    const start = { x: hotspot.x, y: hotspot.y }
    let moved = false

    const handlePointerMove = (moveEvent) => {
      const dx = ((moveEvent.clientX - startPoint.x) / rect.width) * 100
      const dy = ((moveEvent.clientY - startPoint.y) / rect.height) * 100
      const next = {
        x: clamp(start.x + dx, 0, 100),
        y: clamp(start.y + dy, 0, 100),
      }
      moved = moved || Math.abs(moveEvent.clientX - startPoint.x) > 2 || Math.abs(moveEvent.clientY - startPoint.y) > 2
      onMove(next)
    }

    const handlePointerUp = (upEvent) => {
      window.removeEventListener('pointermove', handlePointerMove)
      window.removeEventListener('pointerup', handlePointerUp)
      if (!moved) return

      skipClickRef.current = true
      const dx = ((upEvent.clientX - startPoint.x) / rect.width) * 100
      const dy = ((upEvent.clientY - startPoint.y) / rect.height) * 100
      onMoveEnd?.({ x: clamp(start.x + dx, 0, 100), y: clamp(start.y + dy, 0, 100) })
      window.setTimeout(() => {
        skipClickRef.current = false
      }, 0)
    }

    window.addEventListener('pointermove', handlePointerMove)
    window.addEventListener('pointerup', handlePointerUp)
  }

  const handleClick = (event) => {
    event.stopPropagation()
    if (skipClickRef.current) return
    onClick?.()
  }

  return (
    <button className={classNames} style={style} onClick={handleClick} onPointerDown={handlePointerDown} title={hotspot.title || 'Hotspot'} type="button">
      <span
        className="marker-shape"
        style={{
          background: hotspot.marker_color || '#ff5f1f',
          border: hotspot.marker_border ? `${borderWidth}px solid ${borderColor}` : 'none',
        }}
      />
      {hotspot.hotspot_text ? <span className={`marker-text marker-text-${textPosition}`}>{hotspot.hotspot_text}</span> : null}
    </button>
  )
}
