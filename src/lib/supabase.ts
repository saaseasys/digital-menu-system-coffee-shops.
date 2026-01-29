import { createClient } from '@supabase/supabase-js'
import { Database } from './database.types'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || ''
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''

// Use placeholder values during build time to prevent errors
// The actual values will be available at runtime in production
export const supabase = createClient<Database>(
  supabaseUrl || 'https://placeholder.supabase.co',
  supabaseKey || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBsYWNlaG9sZGVyIiwicm9sZSI6ImFub24iLCJpYXQiOjE2NDUxOTI4MDAsImV4cCI6MTk2MDc2ODgwMH0.placeholder'
)

// Helper function to check if Supabase is properly configured
export const isSupabaseConfigured = (): boolean => {
  return !!(
    supabaseUrl && 
    supabaseKey && 
    supabaseUrl !== 'https://placeholder.supabase.co' &&
    supabaseUrl.includes('supabase.co')
  )
}

// Helper function to ensure Supabase is configured before use
export const ensureSupabaseConfigured = () => {
  if (!isSupabaseConfigured()) {
    console.error('Supabase environment variables are not configured')
    return false
  }
  return true
}

export const uploadImage = async (file: File, bucket: string) => {
  if (!ensureSupabaseConfigured()) {
    throw new Error('Supabase is not configured')
  }

  const fileName = `${Date.now()}-${file.name.replace(/\s/g, '-')}`
  
  const { data, error } = await supabase.storage
    .from(bucket)
    .upload(fileName, file, {
      cacheControl: '3600',
      upsert: false
    })
  
  if (error) throw error
  
  const { data: { publicUrl } } = supabase.storage
    .from(bucket)
    .getPublicUrl(fileName)
    
  return publicUrl
}
