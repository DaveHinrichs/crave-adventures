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
  marker_pulse: false,
  width: 18,
  height: 18,
  opacity: 1,
  hotspot_text: '',
  text_position: 'below',
}

export default function HotspotEditor({ hotspot, onSave, onCancel }) {
  const [draft, setDraft] = useState({ ...defaults, ...hotspot })
  const [busyField, setBusyField] = useState('')

  const setField = (key, value) => setDraft((prev) => ({ ...prev, [key]: value }))

  const onUpload = async (event, field) => {
    const file = event.target.files?.[0]
    if (!file) return
    setBusyField(field)
    try {
      const url = await uploadHotspotMedia(file)
      setField(field, url)
    } finally {
      setBusyField('')
    }
  }

  return (
    <div className="hotspot-editor">
      <h3>{hotspot?.id ? 'Edit Hotspot' : 'New Hotspot'}</h3>
      <label>Title<input value={draft.title} onChange={(e) => setField('title', e.target.value)} /></label>
      <label>Text<textarea value={draft.text} onChange={(e) => setField('text', e.target.value)} /></label>

      <div className="grid-2">
        <label>Shape
          <select value={draft.marker_shape} onChange={(e) => setField('marker_shape', e.target.value)}>
            <option value="circle">Circle</option>
            <option value="square">Square</option>
            <option value="rectangle">Rectangle</option>
            <option value="rounded-square">Rounded square</option>
            <option value="diamond">Diamond</option>
          </select>
        </label>
        <label>Color<input type="color" value={draft.marker_color} onChange={(e) => setField('marker_color', e.target.value)} /></label>
      </div>

      <div className="grid-2">
        <label>Width (px)
          <input type="number" min="8" max="300" value={draft.width} onChange={(e) => setField('width', Number(e.target.value) || 8)} />
        </label>
        <label>Height (px)
          <input type="number" min="8" max="300" value={draft.height} onChange={(e) => setField('height', Number(e.target.value) || 8)} />
        </label>
      </div>

      <label>Opacity ({draft.opacity})
        <input type="range" min="0.1" max="1" step="0.05" value={draft.opacity} onChange={(e) => setField('opacity', Number(e.target.value))} />
      </label>

      <div className="grid-2">
        <label>Hotspot Text<input value={draft.hotspot_text} onChange={(e) => setField('hotspot_text', e.target.value)} /></label>
        <label>Text Placement
          <select value={draft.text_position} onChange={(e) => setField('text_position', e.target.value)}>
            <option value="inside">Inside hotspot</option>
            <option value="below">Below hotspot</option>
          </select>
        </label>
      </div>

      <label><input type="checkbox" checked={draft.marker_border} onChange={(e) => setField('marker_border', e.target.checked)} /> Border</label>
      <label><input type="checkbox" checked={draft.marker_pulse} onChange={(e) => setField('marker_pulse', e.target.checked)} /> Pulse</label>

      <h4>Media</h4>
      <label>Upload Image<input type="file" accept="image/*" onChange={(e) => onUpload(e, 'image_url')} disabled={busyField === 'image_url'} /></label>
      {draft.image_url ? <a href={draft.image_url} target="_blank" rel="noreferrer">Preview uploaded image</a> : null}

      <label>Video URL / Embed URL<input value={draft.video_url} onChange={(e) => setField('video_url', e.target.value)} /></label>

      <label>Upload Audio<input type="file" accept="audio/*" onChange={(e) => onUpload(e, 'audio_url')} disabled={busyField === 'audio_url'} /></label>
      {draft.audio_url ? <audio src={draft.audio_url} controls /> : null}

      <label>Link URL<input value={draft.link_url} onChange={(e) => setField('link_url', e.target.value)} /></label>
      <label>Link Label<input value={draft.link_label} onChange={(e) => setField('link_label', e.target.value)} /></label>

      <div className="actions">
        <button type="button" onClick={() => onSave(draft)}>Save Hotspot</button>
        <button type="button" onClick={onCancel}>Cancel</button>
      </div>
    </div>
  )
}
