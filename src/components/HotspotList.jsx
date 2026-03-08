export default function HotspotList({ hotspots, activeId, onSelect }) {
  return (
    <aside className="hotspot-list">
      <h3>Hotspots</h3>
      <ul>
        {hotspots.map((item, index) => (
          <li key={item.id || `${index}-${item.title}`}>
            <button
              className={activeId === item.id ? 'active' : ''}
              type="button"
              onClick={() => onSelect(item.id)}
            >
              {index + 1}. {item.title || 'Untitled'}
            </button>
          </li>
        ))}
      </ul>
    </aside>
  )
}
