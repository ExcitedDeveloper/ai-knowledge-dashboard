import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.SUPABASE_URL || 'https://hzzxgsmngyurzribiths.supabase.co'
const supabaseKey = process.env.SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imh6enhnc21uZ3l1cnpyaWJpdGhzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjIxMTIwMjMsImV4cCI6MjA3NzY4ODAyM30.SRAFIla77RlEMDb1EJzTPIl45Rh284_TzEGlS7XyMg4'

export const supabase = createClient(supabaseUrl, supabaseKey)

export type FileRecord = {
  id: string
  filename: string
  mimetype: string | null
  content: string | null
  embedding: number[]
  uploaded_at: string
}
