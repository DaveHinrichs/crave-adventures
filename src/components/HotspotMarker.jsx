export default function HotspotMarker({ hotspot, isActive = false, presentation = false, onClick }) {
  const size = presentation ? 28 : 18
  const style = {
    left: `${hotspot.x}%`,
    top: `${hotspot.y}%`,
    background: hotspot.marker_color || '#ff5f1f',
    width: size,
    height: size,
  }

  const classNames = [
    'hotspot-marker',
    `shape-${hotspot.marker_shape || 'circle'}`,
    hotspot.marker_border ? 'with-border' : '',
    hotspot.marker_pulse ? 'pulse' : '',
    isActive ? 'active' : '',
  ].join(' ')

  return (
    <button className={classNames} style={style} onClick={onClick} title={hotspot.title || 'Hotspot'} type="button">
      {hotspot.marker_label ? <span className="marker-label">{hotspot.marker_label}</span> : null}
    </button>
  )
}
