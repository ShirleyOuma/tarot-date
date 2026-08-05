import { supabase } from './supabaseClient'

// Uploads an image file to the card-images bucket and returns its public URL.
export async function uploadCardImage(file) {
    const ext = file.name.split('.').pop()
    const path = `${crypto.randomUUID()}.${ext}`

    const { error } = await supabase.storage.from('card-images').upload(path, file)
    if (error) throw error

    const { data } = supabase.storage.from('card-images').getPublicUrl(path)
    return data.publicUrl
}