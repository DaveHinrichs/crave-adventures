import { supabase } from './supabaseClient'

const HOTSPOT_COLUMNS = `
  id,tour_id,title,text,image_url,video_url,audio_url,link_url,link_label,
  x,y,yaw,pitch,marker_shape,marker_color,marker_border,marker_label,marker_pulse,
  width,height,opacity,hotspot_text,text_position,order_index,
  created_at,updated_at
`

export async function listHotspotsByTourId(tourId) {
  const { data, error } = await supabase
    .from('hotspots')
    .select(HOTSPOT_COLUMNS)
    .eq('tour_id', tourId)
    .order('order_index', { ascending: true })

  if (error) throw error
  return data || []
}

export async function upsertHotspot(hotspot) {
  const payload = {
    ...hotspot,
    updated_at: new Date().toISOString(),
    marker_shape: hotspot.marker_shape || 'circle',
    marker_color: hotspot.marker_color || '#ff5f1f',
    marker_border: hotspot.marker_border ?? false,
    marker_pulse: hotspot.marker_pulse ?? false,
    width: hotspot.width ?? 18,
    height: hotspot.height ?? 18,
    opacity: hotspot.opacity ?? 1,
    text_position: hotspot.text_position || 'below',
    order_index: hotspot.order_index ?? 0,
  }

  const query = hotspot.id
    ? supabase.from('hotspots').update(payload).eq('id', hotspot.id)
    : supabase.from('hotspots').insert([payload])

  const { data, error } = await query.select(HOTSPOT_COLUMNS).single()
  if (error) throw error
  return data
}

export async function deleteHotspot(id) {
  const { error } = await supabase.from('hotspots').delete().eq('id', id)
  if (error) throw error
}

export async function uploadHotspotMedia(file) {
  const filePath = `${Date.now()}-${file.name}`
  const { error } = await supabase.storage.from('hotspot-media').upload(filePath, file, { upsert: true })
  if (error) throw error

  const { data } = supabase.storage.from('hotspot-media').getPublicUrl(filePath)
  return data.publicUrl
}
