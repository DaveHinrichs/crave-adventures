import { supabase } from './supabaseClient'

const TOUR_COLUMNS = 'id,title,slug,scene_type,scene_url,created_at,updated_at'

export async function listTours() {
  const { data, error } = await supabase
    .from('tours')
    .select(TOUR_COLUMNS)
    .order('updated_at', { ascending: false })

  if (error) throw error
  return data || []
}

export async function getTourById(id) {
  const { data, error } = await supabase
    .from('tours')
    .select(TOUR_COLUMNS)
    .eq('id', id)
    .single()

  if (error) throw error
  return data
}

export async function getTourBySlug(slug) {
  const { data, error } = await supabase
    .from('tours')
    .select(TOUR_COLUMNS)
    .eq('slug', slug)
    .single()

  if (error) throw error
  return data
}

export async function createTour(payload) {
  const { data, error } = await supabase
    .from('tours')
    .insert([{ ...payload, updated_at: new Date().toISOString() }])
    .select(TOUR_COLUMNS)
    .single()

  if (error) throw error
  return data
}

export async function updateTour(id, patch) {
  const { data, error } = await supabase
    .from('tours')
    .update({ ...patch, updated_at: new Date().toISOString() })
    .eq('id', id)
    .select(TOUR_COLUMNS)
    .single()

  if (error) throw error
  return data
}

export async function uploadScene(file) {
  const filePath = `${Date.now()}-${file.name}`
  const { error } = await supabase.storage.from('panoramas').upload(filePath, file, { upsert: true })
  if (error) throw error

  const { data } = supabase.storage.from('panoramas').getPublicUrl(filePath)
  return data.publicUrl
}
