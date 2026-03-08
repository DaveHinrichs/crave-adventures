import { useState } from 'react'
import { uploadHotspotMedia } from '../services/hotspotService'

const defaults = {
  title: '',
  text: '',
  image_url: '',
  video_url: '',
  audio_url: '',
  link_url: '',
  link_label: '',
  marker_shape: 'circle',
  marker_color: '#ff5f1f',
  marker_border: false,
  marker_label: '',
  marker_pulse: false,
}

export default function HotspotEditor({ hotspot, onSave, onCancel }) {
  const [draft, setDraft] = useState({ ...defaults, ...hotspot })
  const [busy, setBusy] = useState(false)

  const setField = (key, value) => setDraft((prev) => ({ ...prev, [key]: value }))

  const onUpload = async (event, field) => {
    const file = event.target.files?.[0]
    if (!file) return
    setBusy(true)
    try {
      const url = await uploadHotspotMedia(file)
      setField(field, url)
    } finally {
      setBusy(false)
    }
  }

  return (
    <div className="hotspot-editor">
      <h3>{hotspot?.id ? 'Edit Hotspot' : 'New Hotspot'}</h3>
      <label>Title<input value={draft.title} onChange={(e) => setField('title', e.target.value)} /></label>
      <label>Text<textarea value={draft.text} onChange={(e) => setField('text', e.target.value)} /></label>
      <label>Image URL<input value={draft.image_url} onChange={(e) => setField('image_url', e.target.value)} /></label>
      <label>Upload Image<input type="file" accept="image/*" onChange={(e) => onUpload(e, 'image_url')} disabled={busy} /></label>
      <label>Video URL<input value={draft.video_url} onChange={(e) => setField('video_url', e.target.value)} /></label>
      <label>Audio URL<input value={draft.audio_url} onChange={(e) => setField('audio_url', e.target.value)} /></label>
      <label>Upload Audio<input type="file" accept="audio/*" onChange={(e) => onUpload(e, 'audio_url')} disabled={busy} /></label>
      <label>Link URL<input value={draft.link_url} onChange={(e) => setField('link_url', e.target.value)} /></label>
      <label>Link Label<input value={draft.link_label} onChange={(e) => setField('link_label', e.target.value)} /></label>

      <div className="grid-2">
        <label>Shape
          <select value={draft.marker_shape} onChange={(e) => setField('marker_shape', e.target.value)}>
            <option value="circle">Circle</option>
            <option value="square">Square</option>
            <option value="rounded-square">Rounded square</option>
            <option value="diamond">Diamond</option>
          </select>
        </label>
        <label>Color<input type="color" value={draft.marker_color} onChange={(e) => setField('marker_color', e.target.value)} /></label>
      </div>

      <label>Marker Label<input value={draft.marker_label} onChange={(e) => setField('marker_label', e.target.value)} /></label>
      <label><input type="checkbox" checked={draft.marker_border} onChange={(e) => setField('marker_border', e.target.checked)} /> Border</label>
      <label><input type="checkbox" checked={draft.marker_pulse} onChange={(e) => setField('marker_pulse', e.target.checked)} /> Pulse</label>

      <div className="actions">
        <button type="button" onClick={() => onSave(draft)}>Save Hotspot</button>
        <button type="button" onClick={onCancel}>Cancel</button>
      </div>
    </div>
  )
}
