export default function HotspotCard({ hotspot, onClose }) {
  if (!hotspot) return null

  return (
    <aside className="hotspot-card">
      <button className="close-btn" onClick={onClose} type="button">×</button>
      <h3>{hotspot.title || 'Untitled hotspot'}</h3>
      {hotspot.text ? <p>{hotspot.text}</p> : null}
      {hotspot.image_url ? <img src={hotspot.image_url} alt={hotspot.title || 'Hotspot media'} /> : null}
      {hotspot.video_url ? <a href={hotspot.video_url} target="_blank" rel="noreferrer">Watch video</a> : null}
      {hotspot.audio_url ? <audio src={hotspot.audio_url} controls /> : null}
      {hotspot.link_url ? (
        <a href={hotspot.link_url} target="_blank" rel="noreferrer">
          {hotspot.link_label || 'Open link'}
        </a>
      ) : null}
    </aside>
  )
}
