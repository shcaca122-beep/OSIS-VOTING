import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY

// JURUS PAMUNGKAS: Berikan string/URL tiruan jika variabel belum terbaca saat build di server Netlify
const safeUrl = supabaseUrl || 'https://placeholder-project-xyz.supabase.co'
const safeKey = supabaseKey || 'placeholder-anon-key-security-bypass'

export const supabase = createClient(safeUrl, safeKey)